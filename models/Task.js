const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  deadline: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
  },
  status: {
    type: String,
    enum: ["active", "pending", "completed"],
    default: "active",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  pdfUrl: {
    type: String,
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  expiredAt: {
    type: Date,
    index: {
      expireAfterSeconds: 0,
    },
  },
});

module.exports = mongoose.model("Task", taskSchema, "tasks");
