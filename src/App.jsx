import React, { useEffect, useState } from "react"
import Player from "./ai-instrument"
import data from "../instabase.json"

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
        color: "red",
        fontSize: "20px",
        fontWeight: "bold",
      }}
    >
      <Player />
      hello
      <select
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
      <img
        style={{
          border: "4px solid blue",
        }}
        src={`/images/${selectedRoomId}.webp`}
      />
    </div>
  )
}
