const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const cors = require("cors");
const FormData = require("form-data");

const app = express();
const storage = multer.memoryStorage();  // Ändern auf Speicher und nicht auf Festplatte
const upload = multer({ storage: storage });

app.use(cors());

const API_KEY = "AEZL4iWDuhjrpztuDUPp9DUX";  // Dein API-Schlüssel

// Route zum Hochladen des Bildes
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Kein Bild hochgeladen.");
    }

    // API URL von remove.bg
    const apiUrl = "https://api.remove.bg/v1.0/removebg";

    // Die Datei, die wir im Speicher haben
    const formData = new FormData();
    formData.append("image_file", req.file.buffer, {
      filename: "image.png",  // Gebe einen Dateinamen für die temporäre Datei
      contentType: "image/png",
    });

    // Anfrage an remove.bg senden
    const response = await axios.post(apiUrl, formData, {
      headers: {
        "X-Api-Key": API_KEY,
        ...formData.getHeaders(),
      },
      responseType: "arraybuffer",  // Rückgabe als Binärdaten
    });

    // Bearbeitetes Bild zurückgeben
    res.setHeader("Content-Type", "image/png");
    res.send(response.data);  // Das Bild mit entferntem Hintergrund zurückgeben
  } catch (error) {
    console.error("Fehler bei der Verarbeitung:", error.response?.data || error.message);
    res.status(500).send("Fehler bei der Verarbeitung.");
  }
});

// Vercel benötigt keine feste Portnummer, aber du kannst die Portnummer mit einem Standardwert festlegen
app.listen(3000, () => {
  console.log("Server läuft auf Port 3000");
});
