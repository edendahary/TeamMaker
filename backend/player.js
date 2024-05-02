const mongoose = require("mongoose");

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
const Player =  mongoose.model("player", playerSchema);

module.exports = Player;
