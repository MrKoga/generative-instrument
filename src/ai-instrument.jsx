import React from "react";
import p5 from "p5";
import { generate } from "./generate";
import * as Tone from "tone";
import AudioPlayer from "./AudioPlayer";

/** @param {p5} p */
const sketch = (p) => {
  /** @type p5.Renderer */
  let canvas;
  /** @type p5.Graphics */
  let pg;
  /** @type p5.Graphics */
  let aiImg;
  /** @type p5.Element */
  let generateButton;

  let isGenerating = false;
  let toggleGenerated = false;
  let roomSize = 0.5;

  const players = [];
  const reverb = new Tone.Freeverb(roomSize, 1000).toDestination();

  // try different combinations of 256, 512, 768
  // you may increase/reduce the size depending on RAM available
  let prompt = "electronic instrument, akai mpc sampler, synthesizer";
  const width = 512;
  const height = 512;
  const seed = (Math.random() * 100000) | 0;

  // set up DOM elements
  const inputContainer = p.createDiv();
  inputContainer.class("input-container");
  const promptInput = p.createElement("textarea", prompt);
  promptInput.parent(inputContainer);
  generateButton = p.createButton("Generate");
  generateButton.parent(inputContainer);
  generateButton.mouseClicked(() => {
    prompt = promptInput.value();
    generateAndDraw();
  });

  p.setup = () => {
    canvas = p.createCanvas(width, height);
    pg = p.createGraphics(width, height);
    aiImg = p.createGraphics(width, height);

    const reverbLevelNode = document.getElementById("reverb_level");
    const config = { attributes: true, childList: true, subtree: true };
    reverbLevelNode.innerText = 0.3;
    console.log("set room size to", +reverbLevelNode.dataset.reverbLevel);
    reverb.set({
      roomSize: +reverbLevelNode.dataset.reverbLevel,
    });

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          console.log("A child node has been added or removed.");
        } else if (mutation.type === "attributes") {
          const roomSize = +reverbLevelNode.dataset.reverbLevel;
          console.log("set room size to", roomSize);
          reverbLevelNode.innerText = roomSize;
          reverb.set({
            roomSize: roomSize,
          });
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(reverbLevelNode, config);

    canvas.parent(document.querySelector("#player-container"));

    // set parent after canvas is created
    inputContainer.parent(document.querySelector("#player-container"));

    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 4; i++) {
        let player = new AudioPlayer(i * 100 + 60, j * 100 + 280);
        player.player.connect(reverb);
        players.push(player);
      }
    }

    players[0].load("/kick.mp3");
    players[1].load("/snare.mp3");
    players[2].load("/cymbal.mp3");
    players[3].load("/hihat.mp3");
    players[4].load("/noise.mp3");
    players[5].load("/scratch.mp3");
    players[6].load("/synth.mp3");
    players[7].load("/square.mp3");

    p.ellipseMode(p.CORNER);

    p.noLoop();
    p.redraw();
  };

  p.draw = () => {
    p.background(50);

    // Pads
    p.noStroke();
    p.fill(150);
    for (let i = 0; i < players.length; i++) {
      p.rect(players[i].x, players[i].y, players[i].w, players[i].h);
    }

    // meaningless UIs
    p.fill(0, 80, 120);
    p.rect(60, 30, 390, 100);

    p.fill(0);
    for (let i = 0; i < 5; i++) {
      p.ellipse(i * 80 + 70, 150, 50, 50);
      p.rect(i * 80 + 70, 220, 50, 30);
    }

    p.fill(250, 0, 0);
    p.rect(0, 0, 20, 512);
    p.rect(492, 0, 20, 512);
  };

  p.mousePressed = () => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].hitTest(p.mouseX, p.mouseY)) {
        players[i].play();
      }
    }
  };

  p.keyPressed = () => {};

  async function generateAndDraw() {
    if (isGenerating) {
      console.warn("processing previous request..");
      return;
    }

    isGenerating = true;

    generateButton.attribute("disabled", true);
    generateButton.html("Generating");

    // resize main canvas to fit into the model
    const tempCanvas = p.createGraphics(width, height);
    const w = p.width;
    const h = p.height;
    tempCanvas.pixelDensity(1);
    tempCanvas.copy(canvas, 0, 0, w, h, 0, 0, width, height);
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
    });
    // remove temporary canvas
    tempCanvas.elt.remove();
    // draw generated image onto graphics object
    aiImg.drawingContext.drawImage(imgElt, 0, 0);

    isGenerating = false;
    toggleGenerated = true;

    generateButton.removeAttribute("disabled");
    generateButton.html("generate");

    p.image(aiImg, 0, 0);

    // TODO: replace audio with generated audio
  }
};

export default function Player() {
  const handleClick = async (e) => {
    await Tone.start();
    console.log("audio is ready");
    e.target.remove();
    new p5(sketch, document.querySelector("#player-container"));
  };

  return <button onClick={handleClick}>Start</button>;
}
