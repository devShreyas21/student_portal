import { Log } from "../models/log.model.js";

export const logActivity = async (user_id, action) => {
  try {
    const log = new Log({ user_id, action });
    await log.save();
  } catch (err) {
    console.error("Error logging activity:", err);
  }
};
