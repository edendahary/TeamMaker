const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors'); 

const app = express();
const PORT = 3000;

app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/angularapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define a schema
const playerSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  city: String,
  shot: Number,
  pass: Number,
  accuracy: Number,
  pace: Number,
  dribbling: Number,
  overall_grade: Number,
  attack: Number,
  defense: Number,
});

const Player = mongoose.model("Player", playerSchema);

app.use(bodyParser.json());

// API endpoints
app.get("/api/players", async (req, res) => {
  const players = await Player.find();
  res.json(players);
});

app.post("/api/players", async (req, res) => {
  const newPlayer = new Player(req.body);
  await newPlayer.save();
  res.status(201).json(newPlayer);
});
app.put("/api/updateplayer/:id", async (req, res) => {
  const playerId = req.params.id;
  const updatedPlayerData = req.body;

  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      playerId,
      updatedPlayerData,
      { new: true }
    );
    res.json(updatedPlayer);
  } catch (err) {
    res.status(500).json({ message: "Failed to update player" });
  }
});
app.delete("/api/deleteplayer/:id", async (req, res) => {
  try {
    const deletePlayer = await Player.findByIdAndDelete(req.params.id)
    res.status(201).json(deletePlayer);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete player" });
  }
  
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
