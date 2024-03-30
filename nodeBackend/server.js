const express = require("express")
const app = express()
const port = 5222 // You can change the port number if needed
const fs = require("fs")
const axios = require("axios")
const FormData = require("form-data")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

app.use(cors())

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!")
})

// app.get("/imageGen", async (req, res) => {
//   try {
//     const formData = new FormData()
//     formData.append("prompt", "Lighthouse on a cliff overlooking the ocean")
//     formData.append("output_format", "webp")

//     const response = await axios.post(
//       "https://api.stability.ai/v2beta/stable-image/generate/core",
//       formData,
//       {
//         headers: {
//           ...formData.getHeaders(),
//           Authorization:
//             "Bearer sk-pMw2w3SB1SQeD0dyChEdSkW851YpPTliE2F0TZcxoqTjHrgj",
//           Accept: "image/*",
//         },
//         responseType: "arraybuffer",
//       }
//     )

//     if (response.status === 200) {
//       fs.writeFileSync("./lighthouse.webp", Buffer.from(response.data))
//       res.send("Image generated successfully!")
//     } else {
//       throw new Error(`${response.status}: ${response.data.toString()}`)
//     }
//   } catch (error) {
//     console.error("Error generating image:", error)
//     res.status(500).send("An error occurred while generating the image.")
//   }
// })

app.post("/imageGen", async (req, res) => {
  try {
    const { prompt } = req.body
    const formData = new FormData()
    formData.append("prompt", prompt)
    formData.append("output_format", "webp")

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.STABILITY_TOKEN}`,
          Accept: "image/*",
        },
        responseType: "arraybuffer",
      }
    )

    if (response.status === 200) {
      const base64Image = Buffer.from(response.data, "binary").toString(
        "base64"
      )
      res.json({ imageData: base64Image })
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`)
    }
  } catch (error) {
    console.error("Error generating image:", error)
    res.status(500).send("An error occurred while generating the image.")
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
