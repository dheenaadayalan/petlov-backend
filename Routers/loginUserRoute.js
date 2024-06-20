import express from 'express';
import { sigUp, signIn, updateUser } from '../Controllers/authController.js'
import { verifyToken } from '../Middleware/verifyToken.js';

const router = express.Router();

router.post("/sign-up",sigUp)
router.post("/sign-in",signIn)
router.post("/update",verifyToken,updateUser)

export default router;