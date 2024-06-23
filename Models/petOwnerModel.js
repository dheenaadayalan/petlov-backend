import mongoose from "mongoose";

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
    message:[],
  },
  { timestamps: true }
);

const petOwner = mongoose.model("petOwner", petOwnerSchema);
export default petOwner;
