import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["completed", "incomplete"],
      default: "incomplete",
    },
    archived: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

const Task = mongoose.model('Task', taskSchema);

export default Task;
