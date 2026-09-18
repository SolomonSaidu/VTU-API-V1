import express from "express";
import prisma from "../lib/prisma.js";
import { DateTime } from "luxon";
import { Authenticate } from "../middleware/authenticate.js";
import AppError from "../utils/appError.js";

const route = express.Router();

route.get("/airtime/schedule", Authenticate, async (req, res, next) => {
  const userId = req.user.id;

  try {
    const schedules = await prisma.schedule.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: 0,
      take: 10,
    });

    res.status(200).json({
      status: "success",
      schedules,
    });
  } catch (error) {
    next(error);
  }
});

route.post("/airtime/schedule", Authenticate, async (req, res, next) => {
  const VALID_FREQUENCY = ["ONCE", "MINUTELY", "DAILY", "MONTHLY"];

  try {
    const userId = req.user.id;
    const {
      frequency,
      year,
      month,
      day,
      hour,
      minute,

      //Provider Data
      type,
      amount,
      phone,
      network,
      PortedNumber,
      airtimeType,
    } = req.body;

    if (!VALID_FREQUENCY.includes(frequency))
      throw new AppError("Frequency must be ONCE, DAILY, or MONTHLY.", 400);

    const scheduleDate = DateTime.fromObject(
      {
        year,
        month,
        day,
        hour,
        minute,
      },
      {
        zone: "Africa/Lagos",
      },
    )
      .toUTC()
      .toJSDate();

    if (scheduleDate <= DateTime.now().setZone("Africa/Lagos"))
      throw new AppError("Schedule time must be in the future.", 400);

    const Schedule = await prisma.schedule.create({
      data: {
        userId,
        active: true,
        frequency,
        nextRunAt: scheduleDate,
        type,
        amount,
        phone,
        network,
        PortedNumber,
        airtimeType,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Schedule created successfuly.",
      Schedule,
    });
  } catch (error) {
    next(error);
  }
});

export default route;
