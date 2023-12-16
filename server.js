const express = require("express");
const app = express();
const pdfParse = require("pdf-parse");
const fs = require("fs");

app.use(express.static("public"));
app.use(express.json());

app.post("/upload", async (req, res) => {
  try {
    const { base64PDF } = req.body;
    const buffer = Buffer.from(base64PDF, "base64");

    const data = await pdfParse(buffer);
    res.json({ success: true, text: data.text });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
