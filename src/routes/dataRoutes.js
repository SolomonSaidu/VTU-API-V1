import express from "express";
import { Authenticate } from "../middleware/authenticate.js";
import { addTransaction } from "../middleware/transactionMiddleware.js";
import Data from "../controllers/dataController.js";
import Validate from "../middleware/validateMiddleware.js";
import { dataShema } from "../schema/dataSchema.js";

const route = express.Router();

route.post(
  "/data",
  Authenticate,
  Validate(dataShema),
  addTransaction("DATA"),
  Data,
);

export default route;
