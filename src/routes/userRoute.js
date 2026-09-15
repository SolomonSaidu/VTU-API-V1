import express from "express";
import { Register, Login, User } from "../controllers/userController.js";
import { Authenticate } from "../middleware/authenticate.js";
import Validate from "../middleware/validateMiddleware.js";
import { LoginSchema, RegisterSchema } from "../schema/userShema.js";

const route = express.Router();

route.get("/me", Authenticate, User);

//REGISTER USER
route.post("/register", Validate(RegisterSchema), Register);

// LOGIN
route.post("/login", Validate(LoginSchema), Login);

export default route;
