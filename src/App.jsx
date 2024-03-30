import React, { useEffect, useState } from "react"
import Player from "./ai-instrument"
import data from "../instabase.json"
import { GoArrowRight } from "react-icons/go"

export default function App() {
  const roomData = data.query_result.data.rows.slice(1, 10)

  const [selectedRoomId, setSelectedRoomId] = useState(roomData[0].room_id)
  const [selectedRoomData, setSelectedRoomData] = useState(null)

  useEffect(() => {
    const thisRoomData = roomData.find(
      (item) => item.room_id === selectedRoomId
    )
    setSelectedRoomData(thisRoomData)
  }, [selectedRoomId])

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
          // border: "4px solid green",
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
          // width: "50%",
          // border: "4px solid yellow",
          position: "relative",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            // width: "400px",
            // height: "400px",
            // position: "absolute",
            // top: "0",
            // right: "0",
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            flexDirection: "column",
            border: "4px solid red",
            backgroundColor: "red",
            padding: "20px",
          }}
        >
          <img
            style={{
              border: "4px solid blue",
              width: "200px",
              height: "200px",
              objectFit: "cover",
            }}
            src={`/images/${selectedRoomId}.webp`}
          />
          <select
            style={{
              width: "200px",
              height: "30px",
            }}
            value={selectedRoomId}
            onChange={(e) => {
              console.log("SELECTION VALUE", e.target.value)
              setSelectedRoomId(e.target.value)
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
            Room reverb level: 0.3
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
  )
}
