const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const cors = require("cors");
const FormData = require("form-data");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

// Dein API-Schlüssel für remove.bg
const API_KEY = "AEZL4iWDuhjrpztuDUPp9DUX";

// POST-Route, um das Bild zu empfangen und zu verarbeiten
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Kein Bild hochgeladen.");
    }

    const apiUrl = "https://api.remove.bg/v1.0/removebg";
    const imagePath = req.file.path;

    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(imagePath));

    const response = await axios.post(apiUrl, formData, {
      headers: {
        "X-Api-Key": API_KEY,
        ...formData.getHeaders(),
      },
      responseType: "arraybuffer", // Bild als Binärdaten zurückgeben
    });

    fs.unlinkSync(imagePath); // Lokale Datei löschen

    res.setHeader("Content-Type", "image/png");
    res.send(response.data); // Bearbeitetes Bild zurückgeben
  } catch (error) {
    console.error("Fehler bei der Verarbeitung:", error.response?.data || error.message);
    res.status(500).send("Fehler bei der Verarbeitung.");
  }
});

// Server läuft auf Port 3000
app.listen(3000, () => {
  console.log("Backend läuft auf Port 3000");
});

