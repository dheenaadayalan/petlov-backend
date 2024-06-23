import mongoose from "mongoose";

const petsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  personality: {
    type: Array,
    required: true,
  },
  behavior: {
    type: Array,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  petPictures: {
    type: Array,
    required: true,
  },
  isAdopted: {
    type: Boolean,
    default: false,
  },
  petOwnerId: {
    type: String,
    required: true,
  },
  catorgry: {
    type: Array,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const pets = mongoose.model("Pets", petsSchema);
export default pets;
