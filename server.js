const express = require("express");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const upload = multer({ storage: multer.memoryStorage() }); // store in memory

app.use(express.static("public"));

// Upload route
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  const fileName = Date.now() + "-" + req.file.originalname;

  const { error } = await supabase.storage
    .from("minecraft-images")
    .upload(fileName, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: true,
    });

  if (error) {
    console.error(error);
    return res.status(500).send("Upload failed");
  }

  res.redirect("/");
});

// Gallery route
app.get("/images", async (req, res) => {
  const { data, error } = await supabase.storage
    .from("minecraft-images")
    .list("", { sortBy: { column: "created_at", order: "desc" } });

  if (error) return res.json([]);

  const urls = data.map(
    (file) =>
      `${process.env.SUPABASE_URL}/storage/v1/object/public/minecraft-images/${file.name}`
  );

  res.json(urls);
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
