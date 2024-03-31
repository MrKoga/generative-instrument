import React, { useRef, useEffect, useState } from "react"
import p5 from "p5"
import { generate } from "./generate"
import * as Tone from "tone"
import AudioPlayer from "./AudioPlayer"

/** @param {p5} p */
const sketch = (p) => {
  /** @type p5.Renderer */
  let canvas
  /** @type p5.Graphics */
  let pg
  /** @type p5.Graphics */
  let aiImg
  /** @type p5.Element */
  let generateButton

  let isGenerating = false
  let toggleGenerated = false
  let roomSize = 0.5
  const MAX_ROOM_SIZE = 400

  const players = []
  const reverb = new Tone.Reverb(roomSize, 1000).toDestination()

  // try different combinations of 256, 512, 768
  // you may increase/reduce the size depending on RAM available
  let prompt = "electronic instrument, akai sampler, synthesizer"
  const width = 512
  const height = 512
  const seed = (Math.random() * 100000) | 0

  // set up DOM elements
  const inputContainer = p.createDiv()
  inputContainer.class("input-container")
  const promptInput = p.createElement("textarea", prompt)
  promptInput.parent(inputContainer)
  generateButton = p.createButton("generate")
  generateButton.parent(inputContainer)
  generateButton.mouseClicked(() => {
    prompt = promptInput.value()
    generateAndDraw()
  })

  p.setup = () => {
    canvas = p.createCanvas(width, height)
    pg = p.createGraphics(width, height)
    aiImg = p.createGraphics(width, height)

    const reverbLevelNode = document.getElementById("reverb_level")
    const config = { attributes: true, childList: true, subtree: true }
    reverbLevelNode.innerText = 0.3
    console.log("set room size to", +reverbLevelNode.dataset.reverbLevel)
    reverb.set({
      roomSize: +reverbLevelNode.dataset.reverbLevel,
    })

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          console.log("A child node has been added or removed.")
        } else if (mutation.type === "attributes") {
          const roomSize = +reverbLevelNode.dataset.reverbLevel
          console.log("set room size to", roomSize)
          reverbLevelNode.innerText = roomSize
          reverb.set({
            roomSize: roomSize,
          })
        }
      }
    }

    const observer = new MutationObserver(callback)
    observer.observe(reverbLevelNode, config)

    canvas.parent(document.querySelector("#player-container"))

    // set parent after canvas is created
    inputContainer.parent(document.querySelector("#player-container"))

    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 4; i++) {
        let player = new AudioPlayer(i * 100 + 60, j * 100 + 280)
        player.player.connect(reverb)
        players.push(player)
      }
    }

    players[0].load("/kick.mp3")
    players[1].load("/snare.mp3")
    players[2].load("/cymbal.mp3")
    players[3].load("/hihat.mp3")
    players[4].load("/noise.mp3")
    players[5].load("/scratch.mp3")
    players[6].load("/synth.mp3")
    players[7].load("/square.mp3")

    p.ellipseMode(p.CORNER)

    p.noLoop()
    p.redraw()
  }

  p.draw = () => {
    p.background(50)
    p.stroke(0)
    p.fill(150)

    for (let i = 0; i < players.length; i++) {
      p.rect(players[i].x, players[i].y, players[i].w, players[i].h)
    }

    // Pads
    p.noStroke()
    p.fill(150)
    for (let i = 0; i < players.length; i++) {
      p.rect(players[i].x, players[i].y, players[i].w, players[i].h)
    }

    // meaningless UIs
    p.fill(0, 80, 120)
    p.rect(60, 30, 390, 100)

    p.fill(0)
    for (let i = 0; i < 5; i++) {
      p.ellipse(i * 80 + 70, 150, 50, 50)
      p.rect(i * 80 + 70, 220, 50, 30)
    }

    p.fill(250, 0, 0)
    p.rect(0, 0, 20, 512)
    p.rect(492, 0, 20, 512)
  }

  p.mousePressed = () => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].hitTest(p.mouseX, p.mouseY)) {
        players[i].play()
      }
    }
  }

  async function generateAndDraw() {
    if (isGenerating) {
      console.warn("processing previous request..")
      return
    }

    isGenerating = true

    generateButton.attribute("disabled", true)
    generateButton.html("Generating")

    // resize main canvas to fit into the model
    const tempCanvas = p.createGraphics(width, height)
    const w = p.width
    const h = p.height
    tempCanvas.pixelDensity(1)
    tempCanvas.copy(canvas, 0, 0, w, h, 0, 0, width, height)
    // returns HTMLImageElement
    const imgElt = await generate({
      prompt,
      image: tempCanvas.elt.toDataURL("image/jpeg"),
      width,
      height,
      steps: 4,
      strength: 0.6,
      seed,
      outdir: "../output",
    })
    // remove temporary canvas
    tempCanvas.elt.remove()
    // draw generated image onto graphics object
    aiImg.drawingContext.drawImage(imgElt, 0, 0)

    isGenerating = false
    toggleGenerated = true

    generateButton.removeAttribute("disabled")
    generateButton.html("Generate")

    p.image(aiImg, 0, 0)

    // TODO: replace audio with generated audio
  }

  function requestMIDIAccess() {
    return navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)
  }
  function onMIDISuccess(midiAccess) {
    startLoggingMIDIInput(midiAccess)
  }
  function onMIDIFailure(msg) {
    console.error(`Failed to get MIDI access - ${msg}`)
  }
  function onMIDIMessage(event) {
    const data = event.data
    const status = data[0] & 0xf0
    const channel = data[0] & 0x0f
    const note = data[1]
    const velocity = data[2]

    const noteNames = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ]
    const octave = Math.floor(note / 12) - 1
    const noteName = noteNames[note % 12]
    console.log(note)

    switch (status) {
      case 0x90:
        switch (note) {
          case 40:
            players[0].play()
            break
          case 41:
            players[1].play()
            break
          case 42:
            players[2].play()
            break
          case 43:
            players[3].play()
            break
          case 36:
            players[4].play()
            break
          case 37:
            players[5].play()
            break
          case 38:
            players[6].play()
            break
          case 39:
            players[7].play()
            break
          default:
            break
        }
        break
    }

    // let message = ""
    // switch (status) {
    //   case 0x80:
    //     message = `Note Off - Channel: ${channel}, Note: ${noteName}${octave}, Velocity: ${velocity}`
    //     break
    //   case 0x90:
    //     message =
    //       velocity > 0
    //         ? `Note On - Channel: ${channel}, Note: ${noteName}${octave}, Velocity: ${velocity}`
    //         : `Note Off - Channel: ${channel}, Note: ${noteName}${octave}, Velocity: ${velocity}`
    //     break
    //   case 0xb0:
    //     message = `Control Change - Channel: ${channel}, Controller: ${note}, Value: ${velocity}`
    //     break
    //   case 0xe0:
    //     const pitchBend = (velocity << 7) | note
    //     message = `Pitch Bend - Channel: ${channel}, Value: ${pitchBend}`
    //     break
    //   default:
    //     message = `Unknown MIDI message - Status: ${status}, Data: [${data.join(
    //       ", "
    //     )}]`
    // }
    // console.log(message)
  }

  function startLoggingMIDIInput(midiAccess) {
    midiAccess.inputs.forEach((entry) => {
      entry.onmidimessage = onMIDIMessage
    })
  }
  requestMIDIAccess()
}

export default function Player() {
  const handleClick = async (e) => {
    await Tone.start()
    console.log("audio is ready")
    e.target.remove()
    new p5(sketch, document.querySelector("#player-container"))
  }

  return <button onClick={handleClick}>Start</button>
}
