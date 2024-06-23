import express from "express";
import { verifyToken } from "../Middleware/verifyToken.js";
import {
  addFeedBack,
  addPet,
  allHomePets,
  allPets,
  deletePet,
  editPets,
  getAllMessage,
  getUserPets,
  getUserProfile,
  isPetOwnerRes,
  petData,
  petOwnerSignup,
  sendMessage,
} from "../Controllers/userController.js";
import { isPetOwner } from "../Middleware/isPetOwner.js";

const userRouter = express.Router();

userRouter.get("/petowner", verifyToken, isPetOwner, isPetOwnerRes);
userRouter.post("/petowner/signup", verifyToken, petOwnerSignup);
userRouter.get("/profile/petowner", verifyToken, isPetOwner, getUserProfile);
userRouter.get("/petowner/data", verifyToken, isPetOwner, getUserPets);
userRouter.post("/petowner/pets/add", verifyToken, isPetOwner, addPet);
userRouter.get("/petowner/pets/edit/:id", verifyToken, isPetOwner, petData);
userRouter.post("/petowner/pets/update/:id", verifyToken, isPetOwner, editPets);
userRouter.delete("/petowner/pets/delete/:id", verifyToken, isPetOwner, deletePet);
userRouter.get("/pets/all", verifyToken,allPets);
userRouter.post("/send/message", verifyToken, sendMessage);
userRouter.post("/feedback", verifyToken, addFeedBack);
userRouter.get("/pets/home/all",allHomePets);
userRouter.get("/get/all/petowner/message", verifyToken,isPetOwner,getAllMessage);

export default userRouter;
