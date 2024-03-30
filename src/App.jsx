import React, { useEffect, useState } from "react"
import Player from "./ai-instrument"
import data from "../instabase.json"
import { GoArrowRight } from "react-icons/go"
import axios from "axios"

export default function App() {
  const roomData = data.query_result.data.rows.slice(1, 10)

  const [selectedRoomId, setSelectedRoomId] = useState(roomData[0].room_id)

  const [selectedRoomData, setSelectedRoomData] = useState(null)

  useEffect(() => {
    const thisRoomData = roomData.find((item) => item.room_id == selectedRoomId)
    setSelectedRoomData(thisRoomData)
  }, [selectedRoomId])

  const [backgroundImage, setBackgroundImage] = useState("")

  const handleImageClick = async () => {
    console.log("Generating image...")
    try {
      const prompt = "Lighthouse on a cliff overlooking the ocean"
      const response = await axios.post("http://localhost:5222/imageGen", {
        prompt,
      })

      if (response.status === 200) {
        console.log("Image generated successfully!")
        const imageData = `data:image/webp;base64,${response.data.imageData}`
        console.log("imageData: ", imageData)
        setBackgroundImage(imageData)
      } else {
        console.error("Error generating image:", response.status)
      }
    } catch (error) {
      console.error("Error generating image:", error)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
      }}
    >
      {backgroundImage && (
        <img
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100vh",
            width: "50%",
          }}
          src={backgroundImage}
          alt="Generated Image"
        />
      )}

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
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            flexDirection: "column",
            border: "4px solid red",
            backgroundColor: "red",
            padding: "20px",
            gap: "20px",
          }}
        >
          <img
            style={{
              // border: "4px solid blue",
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
              id="reverb_level"
              data-reverb-level={selectedRoomData?.square_meter}
            >
              {selectedRoomData?.square_meter}
            </span>
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
            onClick={handleImageClick}
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
