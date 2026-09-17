import express from "express";

const route = express.Router();

route.post("/schedule/ping", (req, res) => {
  //check (schedule) if the active is true in schedule and if its transaction type = artime
  //and also the nextRun if its now or has passed

  //if all requement meet, then add a new transaction and also add job to airtime queue for the worker
  // then respond 201

  res.send("Ping route working...");
});

export default route;
