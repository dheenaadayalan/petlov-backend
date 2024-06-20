import express from "express";
import { verifyToken } from "../Middleware/verifyToken.js";
import {
  addPet,
  allPets,
  deletePet,
  editPets,
  getUserPets,
  getUserProfile,
  isPetOwnerRes,
  petData,
  petOwnerSignup,
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
userRouter.get("/petowner/pets/all", verifyToken,allPets);

export default userRouter;
