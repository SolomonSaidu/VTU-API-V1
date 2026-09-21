import express from "express";
import { Authenticate } from "../middleware/authenticate.js";
import {
  addAirtimeSchedule,
  addDataSchedule,
  deleteScheduleById,
  getSchedule,
} from "../controllers/scheduleController.js";

const route = express.Router();

route.get("/schedule", Authenticate, getSchedule);

route.post("/airtime/schedule", Authenticate, addAirtimeSchedule);

route.post("/data/schedule", Authenticate, addDataSchedule);

route.delete("/delete/schedule/:id", deleteScheduleById);

export default route;
