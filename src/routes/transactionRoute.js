import express from "express";
import { Authenticate } from "../middleware/authenticate.js";
import { getTransaction, getTransactionById } from "../controllers/transactionController.js";


const route = express.Router();

//GET TRANSACTIONS
route.get("/transactions", Authenticate, getTransaction)

//GET TRANSACTIONS BY ID
route.get("/transactions/:id", Authenticate, getTransactionById)


export default route;