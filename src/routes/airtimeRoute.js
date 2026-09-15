import express from "express";
import { Authenticate } from "../middleware/authenticate.js";
import { Airtime } from "../controllers/airtimeController.js";
import { addTransaction } from "../middleware/transactionMiddleware.js";
import { AirtimeSchema } from "../schema/airtimeSchema.js";
import Validate from "../middleware/validateMiddleware.js";

const route = express.Router();

route.post(
  "/airtime",
  Authenticate,
  Validate(AirtimeSchema),
  addTransaction("AIRTIME"),
  Airtime,
);

export default route;
