import User from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import petOwner from "../Models/petOwnerModel.js";
dotenv.config();

export const sigUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    console.log(newUser);
    await newUser.save();
    const userDetail = await User.findOne({ email });
    const userPassword = bcryptjs.compareSync(password, userDetail.password);
    if (!userDetail || !userPassword) {
      return res.json({
        message: "User not found Invaid Credentials",
        success: false,
      });
    }
    const token = jwt.sign(
      { id: userDetail._id, isPetOwner: userDetail.isPetOwner },
      process.env.JWT_SECRET_KEY
    );
    res.json({
      message: "You have Successfully Registered",
      result: newUser,
      success: true,
      token,
    });
  } catch (error) {
    res.json({
      message: "Internal Server error in Sign-up user",
      error: error,
      success: false,
    });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userDetail = await User.findOne({ email });
    const petOwnerDetail = await petOwner.findOne({ email });
    const userPassword = bcryptjs.compareSync(password, userDetail.password);
    if (!userDetail || !userPassword) {
      return res.json({
        message: "User not found Invaid Credentials",
        success: false,
      });
    }
    if(petOwnerDetail){
      const token = jwt.sign(
        { id: userDetail._id,idPet: petOwnerDetail._id},
        process.env.JWT_SECRET_KEY
      );
      res.json({
        message: "Login in Successfully",
        success: true,
        token:token,
        result:userDetail
      });
    }
    if(!petOwnerDetail){
      const token = jwt.sign(
        { id: userDetail._id},
        process.env.JWT_SECRET_KEY
      );
      res.json({
        message: "Login in Successfully",
        success: true,
        token:token,
        result:userDetail
      });
    }
   
  } catch (error) {
    res.json({
      message: "Internal Server error in Sign-ip user",
      error: error,
      success: false,
    });
  }
};

export const updateUser =async (req,res,next)=>{
  const userid = req.user.id;
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  try {
    await User.findByIdAndUpdate(userid, {
      username:username,
      email :email,
      password: hashedPassword
    });
    const userDetail = await User.findById(userid);
    res.json({
      message: "Updated user",
      data:userDetail,
      success: true,
    })
  } catch (error) {
    res.json({
      message: "Internal Server error in Updating user",
      error: error,
      success: false,
    });
  }
}