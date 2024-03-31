# AI-coustic: AI-Powered Electronic Instrument Web App

AI-coustic is an innovative web app that harnesses the power of multiple AI technologies to create an immersive, interactive electronic instrument with a customizable UI and intelligent audio effects.

## Features

- **Sampler Section**: Built with p5.js, the sampler section provides an interactive UI for playing sounds. The default UI skin can be updated with an AI-generated image by prompting the locally running Stability AI image generation model through the text box below.

- **Effect Section**: The effect section uses a room image from the Instabase database to intelligently estimate the reverb level for the sampler sound. It works as follows:

1.  The Open AI Vision API generates a description of the provided room image.
2.  A text-to-text Open AI prompt based on the image description returns a reverb amount in JSON format.
3.  The reverb level is used to control the reverb effect (implemented with Tone.js) that is applied to the sampler sound.

- **AI-Generated Sampler Sounds**: The original sampler sounds were created by Stable Audio using AI generation techniques.

## Technologies Used

- p5.js: For interactive UI elements in the sampler section
- Stability AI: Local image generation model for updating the sampler UI skin
- Open AI Vision API: Describes the room image for the effect section
- Open AI Text-to-Text: Generates reverb level in JSON format based on the room description
- Instabase: Database providing the room image for the effect section
- Tone.js: Applies the AI-controlled reverb effect to the sampler sound
- Stable Audio: AI-generated original sampler sounds

## Setup and Usage

1. Clone the repository and navigate to the project directory.
2. Install the required dependencies.
3. Set up the necessary API keys and local AI models.
4. Launch the web app and interact with the sampler section.
5. Customize the sampler UI skin by prompting the Stability AI model through the provided text box.
6. Explore the intelligent reverb effect based on the room image in the effect section.

Please refer to the detailed setup and usage instructions in the [documentation](link-to-documentation).

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

AI-coustic is licensed under the [MIT License](link-to-license-file).
