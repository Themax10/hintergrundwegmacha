const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");

const app = express();
const storage = multer.memoryStorage(); // Speicherung im Arbeitsspeicher
const upload = multer({ storage: storage });

app.use(cors()); // Erlaubt CORS

// remove.bg API-Key
const API_KEY = "AEZL4iWDuhjrpztuDUPp9DUX";

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Kein Bild hochgeladen.");
    }

    const formData = new FormData();
    formData.append("image_file", req.file.buffer, {
      filename: "uploaded-image.png",
      contentType: "image/png",
    });

    const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
      headers: {
        "X-Api-Key": API_KEY,
        ...formData.getHeaders(),
      },
      responseType: "arraybuffer", // Binärdaten (Bild) zurückerhalten
    });

    res.setHeader("Content-Type", "image/png");
    res.send(response.data); // Das Bild zurückgeben
  } catch (error) {
    console.error("Fehler bei der Verarbeitung:", error.response?.data || error.message);
    res.status(500).send("Fehler bei der Verarbeitung.");
  }
});

app.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});
