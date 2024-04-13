import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";

import {
  login,
  register,
  myProfile,
  logout,
} from "../Controllers/userController.js";

const router = express.Router();


router.post("/login",login);
router.get("/logout",isAuthenticated,logout);
router.get("/me",isAuthenticated,myProfile);
router.post("/register",register);


export default router;