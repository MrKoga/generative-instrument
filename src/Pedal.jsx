import React, { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"

export default function Pedal() {
  return (
    <div>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box />
      </Canvas>
    </div>
  )
}
