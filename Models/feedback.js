import mongoose from "mongoose";

const userFeedBack = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    feedback: {
      type: String,
    },
    isFeedBackGiven: {
      type: Boolean,
      default: false,
    },
  },
);

const Feedback = mongoose.model("Feedback", userFeedBack);
export default Feedback;
