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

  const players = [];

  // try different combinations of 256, 512, 768
  // you may increase/reduce the size depending on RAM available
  let prompt = "electronic instrument, akai sampler, synthesizer";
  const width = 512;
  const height = 512;
  const seed = (Math.random() * 100000) | 0;

  // set up DOM elements
  const inputContainer = p.createDiv();
  inputContainer.class("input-container");
  const promptInput = p.createInput(prompt);
  promptInput.parent(inputContainer);
  generateButton = p.createButton("generate");
  generateButton.parent(inputContainer);
  generateButton.mouseClicked(() => {
    prompt = promptInput.value();
    generateAndDraw();
  });

  p.setup = () => {
    canvas = p.createCanvas(width, height);
    pg = p.createGraphics(width, height);
    aiImg = p.createGraphics(width, height);

    // set parent after canvas is created
    inputContainer.parent(document.querySelector("main"));

    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 4; i++) {
        players.push(new AudioPlayer(i * 100 + 60, j * 100 + 80));
      }
    }

    players[0].load("/kick.mp3");
    players[1].load("/snare.mp3");

    p.noLoop();
    p.redraw();
  };

  p.draw = () => {
    p.background(50);
    p.stroke(0);
    p.fill(150);
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 4; i++) {
        p.rect(i * 100 + 60, j * 100 + 80, 90, 90);
      }
    }
  };

  p.mousePressed = () => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].hitTest(p.mouseX, p.mouseY)) {
        players[i].play();
      }
    }
  };

  p.keyPressed = () => {

  };

  async function generateAndDraw() {
    if (isGenerating) {
      console.warn("processing previous request..");
      return;
    }

    isGenerating = true;

    generateButton.attribute("disabled", true);
    generateButton.html("generating");

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
  }
};

document.querySelector('button')?.addEventListener('click', async (e) => {
  await Tone.start();
  console.log('audio is ready');
  e.target.remove();
  new p5(sketch);
})
