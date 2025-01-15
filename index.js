const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");

const app = express();
const storage = multer.memoryStorage(); // Speicherung im Arbeitsspeicher
const upload = multer({ storage: storage });

app.use(cors()); // Erlaubt CORS
app.use(express.json()); // Für JSON-Parsing
app.use(express.urlencoded({ extended: true })); // Für URL-encoded Daten

// remove.bg API-Key
const API_KEY = "AEZL4iWDuhjrpztuDUPp9DUX";

// POST-Route für Hochladen
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Kein Bild hochgeladen.");
    }

    const formData = new FormData();
    formData.append("image_file", req.file.buffer, {
      filename: "uploaded-image.png",
      contentType: req.file.mimetype,
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

// POST-Route für URL- und Zwischenablage-Bilder
app.post("/process", async (req, res) => {
  try {
    const { imageUrl, clipboardData } = req.body;

    if (!imageUrl && !clipboardData) {
      return res.status(400).send("Bitte gib eine Bild-URL oder Zwischenablagedaten an.");
    }

    const formData = new FormData();

    if (imageUrl) {
      formData.append("image_url", imageUrl);
    } else if (clipboardData) {
      const imageBuffer = Buffer.from(
        clipboardData.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      formData.append("image_file", imageBuffer, {
        filename: "clipboard-image.png",
        contentType: "image/png",
      });
    }

    const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
      headers: {
        "X-Api-Key": API_KEY,
        ...formData.getHeaders(),
      },
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "image/png");
    res.send(response.data);
  } catch (error) {
    console.error("Fehler bei der Verarbeitung:", error.response?.data || error.message);
    res.status(500).send("Fehler bei der Verarbeitung.");
  }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
