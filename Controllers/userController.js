import { json } from "express";
import pets from "../Models/petModel.js";
import petOwner from "../Models/petOwnerModel.js";
import User from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import Message from "../Models/message.js";
import Feedback from "../Models/feedback.js";

export const petOwnerSignup = async (req, res, next) => {
  const { username, email, address, dob, isPetOwner } = req.body;
  const userid = req.user.id;
  const newPetOwner = new petOwner({
    username: username,
    email: email,
    address: address,
    dob: dob,
    isPetOwner: isPetOwner,
  });

  try {
    const doc = await newPetOwner.save();
    await User.findByIdAndUpdate(userid, {
      isPetOwner: true,
    });
    const userDetail = await User.findById(userid);
    const petOwnerDetail = await petOwner.findById(doc._id);
    const token = jwt.sign(
      { idPet: petOwnerDetail._id, id: userDetail._id },
      process.env.JWT_SECRET_KEY
    );
    res.json({
      message: "Signed up as pet owner",
      userData: userDetail,
      petOwnerData: petOwnerDetail,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error in Sign-up Pet Owner",
      error: error,
      success: false,
    });
  }
};

export const isPetOwnerRes = async (req, res, next) => {
  try {
    res.json({ message: "authorized", isPetOwner: true });
  } catch (error) {
    res.json({
      message: "Internal Server error in confirm yor peofile",
      error: error,
    });
  }
};

export const getUserProfile = async (req, res, next) => {
  const userid = req.user.idPet;
  try {
    const userDetail = await petOwner.findById(userid);
    res.json({ data: userDetail });
  } catch (error) {
    res.json({
      message: "Internal Server error in Getting your profile",
      error: error,
    });
  }
};

export const getUserPets = async (req, res, next) => {
  const userPetId = req.user.idPet;
  try {
    const userDetail = await petOwner.findById(userPetId);
    const usersPetsId = userDetail.pets;

    let petData = [];
    for (const ele of usersPetsId) {
      const pet = await pets.findById(ele);
      petData.push(pet);
    }
    res.json({ data: petData });
  } catch (error) {
    res.json({
      message: "Internal Server error in Getting your pets",
      error: error,
    });
  }
};

export const addPet = async (req, res) => {
  const petOwnerId = req.user.idPet;
  const { name, personality, behavior, requirements, petPictures, catorgry } =
    req.body;

  try {
    const userPetDetail = await petOwner.findById(petOwnerId);
    const address = userPetDetail.address;
    const newPet = new pets({
      name,
      personality,
      behavior,
      requirements,
      petPictures,
      catorgry,
      petOwnerId: petOwnerId,
      address: address,
    });
    const userPets = userPetDetail.pets;
    const newPetDoc = await newPet.save();
    const petId = newPetDoc._id;
    userPets.push(petId);
    await petOwner.findByIdAndUpdate(petOwnerId, {
      pets: userPets,
    });
    res.json({
      message: "Your Pet saved successfully",
      petOwnerData: userPetDetail,
      petData: newPetDoc,
    });
  } catch (error) {
    res.json({
      message: "Internal Server error in adding the pet",
      error: error,
      success: false,
    });
  }
};

export const petData = async (req, res) => {
  const petId = req.params.id;
  try {
    const pet = await pets.findById(petId);
    res.json({
      data: pet,
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Internal Server error in adding the pet",
      error: error,
      success: false,
    });
  }
};

export const editPets = async (req, res) => {
  const petId = req.params.id;
  const {
    name,
    personality,
    behavior,
    requirements,
    petPictures,
    isAdopted,
    catorgry,
  } = req.body;
  try {
    await pets.findByIdAndUpdate(petId, {
      name: name,
      personality: personality,
      behavior: behavior,
      requirements: requirements,
      petPictures: petPictures,
      isAdopted: isAdopted,
      catorgry: catorgry,
    });
    const pet = await pets.findById(petId);
    res.json({
      message: "Your Pet updated successfully",
      data: pet,
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Internal Server error in editing the pet",
      error: error,
      success: false,
    });
  }
};

export const deletePet = async (req, res) => {
  const petId = req.params.id;
  const petOwnerId = req.user.idPet;
  const userPetDetail = await petOwner.findById(petOwnerId);
  try {
    const index = userPetDetail.pets.indexOf(petId);
    if (index > -1) {
      userPetDetail.pets.splice(index, 1);
    }
    await petOwner.findByIdAndUpdate(petOwnerId, {
      pets: userPetDetail.pets,
    });
    await pets.findByIdAndDelete(petId);
    res.json({
      message: "Your Pet delete successfully",
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Internal Server error in delecting the pet",
      error: error,
      success: false,
    });
  }
};

export const allPets = async (req, res) => {
  try {
    const allPetsData = await pets.find();
    res.json({
      data: allPetsData,
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Internal Server error in loading the pet",
      error: error,
      success: false,
    });
  }
};

export const sendMessage = async (req, res) => {
  const {
    email,
    fromId,
    message,
    number,
    address,
    meetingTime,
    petId,
    petOwnerId,
    petName,
  } = req.body;
  const userPetDetail = await petOwner.findById(petOwnerId);
  const newMessage = new Message({
    email,
    fromId,
    message,
    number,
    address,
    meetingTime,
    petId,
    petOwnerId,
    petName,
  });
  try {
    const newmessageDoc = await newMessage.save();
    const userPetsMessage = userPetDetail.message;
    userPetsMessage.push(newmessageDoc);
    await petOwner.findByIdAndUpdate(petOwnerId, {
      message: userPetsMessage,
    });
    const userFeedBack = await Feedback.findOne({ userId:fromId });
    res.json({
      message: "Message sent to the owner",
      success: true,
      feedback:userFeedBack
    });
  } catch (error) {
    res.json({
      message: "Internal Server error in sending message",
      error: error,
      success: false,
    });
  }
};

export const addFeedBack = async (req,res)=>{
  const {userId, feedback} = req.body;
  const userFeedBack = await Feedback.findOne({ userId });
  try {
    await Feedback.findByIdAndUpdate(userFeedBack._id, {
      feedback: feedback,
      isFeedBackGiven:true,
    });
    res.json({
      message:"Feedback add successfully",
      success: true,
    })
  } catch (error) {
    res.json({
      message: "Internal Server error in sending feedback",
      error: error,
      success: false,
    });
  }
}

export const allHomePets = async(req,res)=>{
  try {
    const PetsData = await pets.find();
    const allPetsData = PetsData.slice(0,4)
   
    res.json({
      data: allPetsData,
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Internal Server error in loading the pet",
      error: error,
      success: false,
    });
  }
}

export const getAllMessage = async (req,res)=>{
  const petOwnerId = req.user.idPet;
  try {
    const allMessage = await Message.find({petOwnerId})
    res.json({
      message: allMessage,
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Internal Server error in loading message",
      error: error,
      success: false,
    });
  }
  
}

export const updateProfile = async (req,res)=>{
  const userid = req.user.id;
  const {profilePicture} = req.body;
  try {
    await User.findByIdAndUpdate(userid, {
      profilePicture 
    });
    const userDetail = await User.findById(userid);
    res.json({
      message: "Updated profile pic",
      data:userDetail,
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Internal Server error in updating profile pic",
      error: error,
      success: false,
    });
  }
}