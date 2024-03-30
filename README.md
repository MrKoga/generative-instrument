# Latent Consistency Model and p5js running locally on Mac

https://designersdecode.gumroad.com/

## Prerequisites

- Python: I suggest you install a virtual environment.
- [Node.js](https://nodejs.org/en): to run the Vitejs dev server.

## How-to

We need to run 2 local servers - one for the Python LCM backend to generate images and the other to write our p5js sketch and send/receive the canvas image to/from the model.

### How to run p5js sketch

1. In Terminal, `cd` into the root of the project folder.
1. Run `npm install` to install the dependencies.
1. Run `npm run dev` to run the local server.
1. Go to the URL displayed in the Terminal. ie. `http://localhost:5173`.
1. Use `public` folder to store any external files such as images.
1. If you need to install additional NPM packages, Run `npm install <name>`.
1. In `index.html`, edit either `ai-instrument.js` script.

### How to run LCM server

1. In terminal, `cd` into `backend` directory.
1. Create a new environment: `python3 -m venv lcm`.
1. Then, activate the environment: `source lcm/bin/activate`.
1. Run `pip install -r requirements.txt` to install the dependencies.
1. Run `python serve.py`.
1. Wait until the server starts and loads the models.
1. It will download the models from the web the first time you run it.
1. Once it's ready, you can start generating images from your p5js sketch.

## License

- The frontend code is licensed under MIT license.
- The backend code is modified from Replicate's [latent-consistency-model](https://github.com/replicate/latent-consistency-model/tree/prototype) and licensed under MIT license.
- Img2Img Python code is licensed under Apache License, Version 2.0.
