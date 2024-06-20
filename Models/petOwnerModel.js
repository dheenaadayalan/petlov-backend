import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema({
//   name:{
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   number: {
//     type: Number,
//     required: true,
//   },
//   address: {
//     type: String,
//     required: true,
//   },
//   meetingTime:Date,
// })


const petOwnerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg",
    },
    isPetOwner: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    pets:[],
  },
  { timestamps: true }
);

const petOwner = mongoose.model("petOwner", petOwnerSchema);
export default petOwner;
