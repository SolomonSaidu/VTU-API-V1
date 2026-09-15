import express from "express";
import { Authenticate } from "../middleware/authenticate.js";
import { getBalance, fundWallet } from "../controllers/walletController.js";


const route = express.Router();


route.get("/balance", Authenticate, getBalance)


route.post("/fund", Authenticate, fundWallet)

export default route;