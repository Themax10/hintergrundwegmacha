const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");

const app = express();
const storage = multer.memoryStorage();  // Speichern im Arbeitsspeicher
const upload = multer({ storage: storage });

app.use(cors());

// API-Schlüssel aus Umgebungsvariable
const API_KEY = process.env.REMOVE_BG_API_KEY || "AEZL4iWDuhjrpztuDUPp9DUX";  // Standard-Schlüssel als Fallback

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Kein Bild hochgeladen.");
    }

    // Die Datei, die wir im Speicher haben
    const formData = new FormData();
    formData.append("image_file", req.file.buffer, {
      filename: "image.png",  // Gebe einen Dateinamen für die temporäre Datei
      contentType: "image/png",
    });

    // API-Anfrage an remove.bg
    const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
      headers: {
        "X-Api-Key": API_KEY,
        ...formData.getHeaders(),
      },
      responseType: "arraybuffer",  // Binärdaten zurückgeben
    });

    // Erfolgreiche Antwort: Bild mit entferntem Hintergrund zurückgeben
    res.setHeader("Content-Type", "image/png");
    res.send(response.data);
  } catch (error) {
    console.error("Fehler bei der Verarbeitung:", error.response?.data || error.message);
    res.status(500).send("Fehler bei der Verarbeitung.");
  }
});

app.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});
