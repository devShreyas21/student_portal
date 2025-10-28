import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  user_id: Number,                // from MySQL
  action: String,                 // what happened
  timestamp: { type: Date, default: Date.now },
});

export const Log = mongoose.model("Log", logSchema);
