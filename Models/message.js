import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  fromId:{
    type: String,
    required: true,
  },
  petOwnerId:{
    type: String,
    required: true,
  },
  petId:{
    type: String,
    required: true,
  },
  petName:{
    type: String,
    required: true,
  },
  message:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: false,
  },
  number: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  meetingTime:{
    type: Date,
    required: true,
  },
})

const Message = mongoose.model("Message", messageSchema);
export default Message;
