import React, { useEffect, useState } from "react";
import Player from "./ai-instrument";
import data from "../instabase.json";
import { GoArrowRight } from "react-icons/go";

export default function App() {
  const roomData = data.query_result.data.rows.slice(1, 10);

  const [selectedRoomId, setSelectedRoomId] = useState(roomData[0].room_id);
  const [roomDescription, setRoomDescription] = useState("");

  const [selectedRoomData, setSelectedRoomData] = useState(null);

  const getReverbLevel = async () => {
    const response = await fetch(
      `http://127.0.0.1:5000/api/reverb/${selectedRoomId}`,
      {
        mode: "cors",
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      const reverb = JSON.parse(data.reverb);
      setRoomDescription(data.sentence);
      const reverbLevel = parseFloat(reverb.sonic_reverberation);
      document.getElementById("reverb_level").dataset.reverbLevel = Math.min(
        reverbLevel,
        0.9
      );
      console.log("Reverb level", reverbLevel);
    } else {
      console.log("Failed to get reverb level");
    }
  };

  useEffect(() => {
    const thisRoomData = roomData.find(
      (item) => item.room_id == selectedRoomId
    );
    setSelectedRoomData(thisRoomData);
  }, [selectedRoomId]);

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          width: "50%",
          height: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "40px",
        }}
        id="player-container"
      >
        <Player />
      </div>
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // border: "4px solid blue",
        }}
      >
        <div>
          <GoArrowRight color="white" size={80} />
        </div>
      </div>
      <div
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: "250px",
            justifyContent: "end",
            alignItems: "center",
            flexDirection: "column",
            backgroundColor: "red",
            borderRadius: "16px",
            padding: "20px",
            gap: "20px",
          }}
        >
          <img
            style={{
              // border: "4px solid blue",
              width: "250px",
              height: "250px",
              objectFit: "cover",
            }}
            src={`/images/${selectedRoomId}.webp`}
          />
          <select
            style={{
              width: "250px",
              height: "30px",
            }}
            value={selectedRoomId}
            onChange={(e) => {
              setSelectedRoomId(e.target.value);
              getReverbLevel();
            }}
          >
            {roomData.map((item) => (
              <option key={item.room_id} value={item.room_id}>
                {item.room_title}
              </option>
            ))}
          </select>
          <div
            style={{
              color: "white",
            }}
          >
            Room reverb level:{" "}
            <span id="reverb_level" data-reverb-level="0.3">
              0.3
            </span>
            <p>{roomDescription}</p>
          </div>
        </div>
      </div>
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // border: "4px solid blue",
        }}
      >
        <div>
          <GoArrowRight color="white" size={80} />
        </div>
        <div
          style={{
            width: "200px",
            display: "flex",
            justifyContent: "center",
            // border: "4px solid red",
          }}
        >
          <img
            style={{
              height: "100px",
            }}
            src="ear.png"
          />
        </div>
      </div>
    </div>
  );
}
