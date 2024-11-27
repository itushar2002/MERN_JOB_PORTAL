import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  requirents: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobtype: {
    type: String,
    required: true,
    enum: ["full-time", "part-time"],
  },
  NoOfpositions: {
    type: Number,
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  applications: 
    {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Application",
        default: [],
    }
});

export const Job = mongoose.model("Job", jobSchema);