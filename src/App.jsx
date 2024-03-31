import React, { useEffect, useState } from "react"
import Player from "./ai-instrument"
import data from "../instabase.json"
import { GoArrowRight } from "react-icons/go"
import { ScaleLoader } from "react-spinners"

export default function App() {
  const roomData = data.query_result.data.rows.slice(1, 10)
  console.log("Room data", roomData)

  const [selectedRoomId, setSelectedRoomId] = useState(roomData[0].room_id)
  const [roomDescription, setRoomDescription] = useState("")

  // const [selectedRoomData, setSelectedRoomData] = useState(null)

  const [isLoading, setIsLoading] = useState(false)

  const getReverbLevel = async (roomId) => {
    const response = await fetch(`http://127.0.0.1:5000/api/reverb/${roomId}`, {
      mode: "cors",
    })
    const data = await response.json()
    if (data.status === "success") {
      setIsLoading(false)
      const reverb = JSON.parse(data.reverb)
      console.log(data.sentence)
      setRoomDescription(data.sentence)
      const reverbLevel = parseFloat(reverb.sonic_reverberation)
      document.getElementById("reverb_level").dataset.reverbLevel = Math.min(
        reverbLevel,
        0.9
      )
      console.log("Reverb level", reverbLevel)
    } else {
      setIsLoading(false)
      console.log("Failed to get reverb level")
    }
  }

  // useEffect(() => {
  //   // console.log("ROOM ID: ", selectedRoomId)
  //   // const thisRoomData = roomData.find((item) => item.room_id == selectedRoomId)
  //   // setSelectedRoomData(thisRoomData)
  //   setIsLoading(true)
  //   getReverbLevel(selectedRoomId)
  // }, [selectedRoomId])

  useEffect(() => {
    console.log("HERE", roomDescription)
  }, [roomDescription])

  useEffect(() => {
    const fetchReverbLevel = async () => {
      setIsLoading(true)
      const response = await fetch(
        `http://127.0.0.1:5000/api/reverb/${selectedRoomId}`,
        {
          mode: "cors",
        }
      )
      const data = await response.json()
      if (data.status === "success") {
        setIsLoading(false)
        const reverb = JSON.parse(data.reverb)
        console.log(data.sentence)
        setRoomDescription(data.sentence)
        const reverbLevel = parseFloat(reverb.sonic_reverberation)
        document.getElementById("reverb_level").dataset.reverbLevel = Math.min(
          reverbLevel,
          0.9
        )
        console.log("Reverb level", reverbLevel)
      } else {
        setIsLoading(false)
        console.log("Failed to get reverb level")
      }
    }

    fetchReverbLevel()
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
            Room reverb level:{" "}
            <span
              style={{
                display: isLoading ? "none" : "block",
              }}
              id="reverb_level"
              data-reverb-level="0.3"
            >
              0.3
            </span>
            <ScaleLoader
              style={{
                display: isLoading ? "block" : "none",
              }}
              color="blue"
            />
            <p
              id="room-description"
              style={{
                display: isLoading ? "none" : "block",
              }}
            >
              {roomDescription}
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
