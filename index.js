const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const apiKey = "DEIN_API_SCHLÜSSEL";
    const apiUrl = "https://api.remove.bg/v1.0/removebg";

    const response = await axios.post(
      apiUrl,
      new FormData().append("image_file", fs.createReadStream(req.file.path)),
      {
        headers: {
          "X-Api-Key": apiKey,
          ...form.getHeaders(),
        },
      }
    );

    fs.unlinkSync(req.file.path); // Lokale Datei löschen
    res.setHeader("Content-Type", "image/png");
    res.send(response.data); // Ergebnis zurückgeben
  } catch (error) {
    console.error(error);
    res.status(500).send("Fehler bei der Verarbeitung.");
  }
});

module.exports = app;
