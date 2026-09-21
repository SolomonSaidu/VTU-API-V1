import express from "express";
import { Authenticate } from "../middleware/authenticate.js";
import {
  addAirtimeSchedule,
  addDataSchedule,
  deleteScheduleById,
  getSchedule,
} from "../controllers/scheduleController.js";
import { airtimeSchema, dataSchema } from "../schema/scheduleSchema.js";
import Validate from "../middleware/validateMiddleware.js";

const route = express.Router();

route.get("/schedule", Authenticate, getSchedule);

route.post(
  "/airtime/schedule",
  Authenticate,
  Validate(airtimeSchema),
  addAirtimeSchedule,
);

route.post(
  "/data/schedule",
  Authenticate,
  Validate(dataSchema),
  addDataSchedule,
);

route.delete("/delete/schedule/:id", deleteScheduleById);

export default route;
