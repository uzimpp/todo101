const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 15000;
const mongoURl = process.env.MONGO_URL || "mongodb://localhost:27017/todos";
app.use(cors());
app.use(express.json());

// Mongoose Schema
const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    text: String,
    completed: Boolean,
  })
);

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body);
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});
// docker run -d -p 27017:27017 mongo
const connectWithRetry = () => {
  console.log("Connecting to MongoDB...");
  mongoose
    .connect(mongoURl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDV connected");
      app.listen(PORT, () => {
        console.log(`Backed running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.log(
        "MongoDB connection error. Retrying in 5 seconds...",
        err.message
      );
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
