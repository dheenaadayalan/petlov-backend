import { json } from "express";
import pets from "../Models/petModel.js";
import petOwner from "../Models/petOwnerModel.js";
import User from "../Models/userModel.js";
import jwt from "jsonwebtoken";

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
  const newPet = new pets({
    name,
    personality,
    behavior,
    requirements,
    petPictures,
    catorgry,
    petOwnerId: petOwnerId,
  });
  try {
    const userPetDetail = await petOwner.findById(petOwnerId);
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
