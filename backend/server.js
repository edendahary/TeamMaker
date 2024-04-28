const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { userName, passWord } = require("./config");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/angularapp");
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
const userSchema = new mongoose.Schema({
  name: String,
  verification: Number,
  email: String,
  password: String,
  userverify: { type: Boolean, default: false },
  isLogin: { type: Boolean, default: false },
});
const User = mongoose.model("Users", userSchema);
const Player = mongoose.model("Player", playerSchema);

app.use(bodyParser.json());

// API endpoints
app.get("/api/players", async (req, res) => {
  const players = await Player.find();
  res.json(players);
});

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/api/user/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  res.json(user);
});
app.put("/api/updateuser/:email", async (req, res) => {
const userEmail = req.body.user?.email || req.body.email;
const user = req.body.user || req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      user,
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update player" });
  }
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
    const deletePlayer = await Player.findByIdAndDelete(req.params.id);
    res.status(201).json(deletePlayer);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete player" });
  }
});
console.log(process.env);
console.log(passWord);
const transporter = nodemailer.createTransport({
  // need to implement env file for email and password. and to save the account in the database!!
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_NAME,
    pass: process.env.PASS_WORD,
  },
});

// Generate a random verification code
const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

// API endpoint to send verification code
app.post("/sendVerificationCode", async (req, res) => {
  const userExist = await User.find({ email: req.body.email });
  if (userExist.length !== 0) {
    res.status(200).send(false);
  } else {
    const { email, name, password } = req.body;
    const verificationCode = generateVerificationCode();

    const mailOptions = {
      from: "edendahary@gmail.com",
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send(false);
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password,
          verification: verificationCode,
        });
        await newUser.save();
        res.status(200).send(true);
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
