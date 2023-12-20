const express = require("express");
const app = express();
const cors = require("cors");
// require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;
let uri = "mongodb+srv://moshahab:mohammed@cluster0.zganuhb.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
});

const exerciseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  description: String,
  duration: Number,
  date: { type: Date, default: Date.now },
});

const User = model("User", userSchema);
const Exercise = model("Exercise", exerciseSchema);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Create a new user
app.post("/api/users", async (req, res) => {
  try {
    const { username } = req.body;
    // Check if the username is provided
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    // // Check if the username is already taken
    // const existingUser = await User.findOne({ username });
    // if (existingUser) {
    //   return res.status(400).json({ error: "Username already taken" });
    // }

    // Create a new user
    const newUser = await User.create({ username });

    // Return the user object with username and _id properties
    res.json({ username: newUser.username, _id: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a list of all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "username _id");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add exercise to a user
// Update the response to include the newly created exercise with username
app.post("/api/users/:_id/exercises", async (req, res) => {
    try {
      const { _id } = req.params;
      const { description, duration, date } = req.body;
  
      // Create a new exercise
      const exercise = await Exercise.create({
        userId: _id,
        description,
        duration,
        date: date ? new Date(date) : new Date(),
      });
  
      // Find the user by ID
      const user = await User.findById(_id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Return the newly created exercise with username
      const newExercise = {
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString(),
        _id: exercise._id,
      };
  
      res.json(newExercise);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
// Get full exercise log of a user
app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    // Find the user by ID
    const user = await User.findOne({ _id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the user's log
    let log = user.log || [];

    // Apply filters if provided
    if (from) {
      const fromDate = new Date(from);
      log = log.filter(exercise => new Date(exercise.date) >= fromDate);
    }

    if (to) {
      const toDate = new Date(to);
      log = log.filter(exercise => new Date(exercise.date) <= toDate);
    }

    // Limit the number of logs if the limit is provided
    if (limit) {
      log = log.slice(0, parseInt(limit, 10));
    }

    // Format the date in the log array to use the dateString format
    log = log.map(exercise => ({
      description: exercise.description,
      duration: +exercise.duration, // Convert duration to a number
      date: new Date(exercise.date).toDateString(),
    }));

    // Return the user object with the formatted log
    res.json({
      _id: user._id,
      username: user.username,
      count: log.length,
      log,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
