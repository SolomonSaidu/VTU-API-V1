import express from "express";
import { DateTime } from "luxon";
import prisma from "../lib/prisma.js";
import AppError from "../utils/appError.js";
import { airtimeQueues } from "../queues/airtimeQueues.js";

const route = express.Router();

route.post("/schedule/ping", async (req, res) => {
  //Convert status to pending if the frequency is not ONCE
  // await prisma.schedule.updateMany({
  //   where: {
  //     active: true,
  //     frequency: {
  //       not: "ONCE",
  //     },
  //     lastStatus: "PROCESSING",
  //     lastRunAt: {
  //       lt: DateTime.now().toUTC().toJSDate(),
  //     },
  //   },
  //   data: {
  //     lastStatus: "PENDING",
  //   },
  // });

  //check (schedule) if the active is true in schedule
  //and also the nextRun if its now or has passed
  const activeShedule = await prisma.schedule.findMany({
    where: {
      active: true,
      nextRunAt: {
        lte: DateTime.now().toUTC().toJSDate(),
      },
      lastStatus: {
        not: "PROCESSING",
      },
    },
  });

  //VAL: validat code
  for (const schedule of activeShedule) {
    const claimedSchedule = await prisma.schedule.updateMany({
      where: {
        id: schedule.id,
        active: true,
        lastStatus: {
          not: "PROCESSING",
        },
      },
      data: {
        lastStatus: "PROCESSING",
      },
    });

    if (claimedSchedule.count == 0) {
      continue;
    }

    // creat transaction
    const transaction = await prisma.transaction.create({
      data: {
        type: schedule.type,
        status: "PENDING",
        userId: schedule.userId,

        amount: schedule.amount,
        phone: schedule.phone,
        network: schedule.network,
        PortedNumber: schedule.PortedNumber,
        airtimeType: schedule.airtimeType,
        plan: schedule.plan,
      },
    });

    //all to queue
    if (transaction.type == "AIRTIME") {
      await airtimeQueues.add("buy-airtime", {
        transactionId: transaction.id,
        scheduleId: schedule.id,
      });
    } else {
      // add for data
    }

    // Calculating the next run
    const now = DateTime.now().toUTC();
    // calculation for once
    if (schedule.frequency == "ONCE") {
      await prisma.schedule.update({
        where: {
          id: schedule.id,
        },
        data: {
          active: false,
          lastRunAt: now.toJSDate(),
          lastStatus: "SUCCESS",
        },
      });
    }

    //calculation for minutely
    if (schedule.frequency == "MINUTELY") {
      const nextRun = DateTime.fromJSDate(schedule.nextRunAt).plus({
        minute: 1,
      });

      await prisma.schedule.update({
        where: {
          id: schedule.id,
        },
        data: {
          nextRunAt: nextRun.toJSDate(),
          lastStatus: "PENDING",
          lastRunAt: now.toJSDate(),
        },
      });
    }

    //calculation for daily
    if (schedule.frequency == "DAILY") {
      const nextRun = DateTime.fromJSDate(schedule.nextRunAt).plus({ day: 1 });

      await prisma.schedule.update({
        where: {
          id: schedule.id,
        },
        data: {
          nextRunAt: nextRun.toJSDate(),
          lastStatus: "PENDING",
          lastRunAt: now.toJSDate(),
        },
      });
    }
    //calculation for monthly
    if (schedule.frequency == "MONTHLY") {
      const nextRun = DateTime.fromJSDate(schedule.nextRunAt).plus({
        month: 1,
      });

      await prisma.schedule.update({
        where: {
          id: schedule.id,
        },
        data: {
          nextRunAt: nextRun.toJSDate(),
          lastStatus: "PENDING",
          lastRunAt: now.toJSDate(),
        },
      });
    }
  }

  res.status(201).json({
    status: "success",
    message: "Schedule ping successfuly.",
    dueSchedule: activeShedule.map((schedule) => ({
      id: schedule.id,
      userId: schedule.userId,
      amount: schedule.amount,
    })),
  });

  //if all requement meet, then add a new transaction and also add (depending on the type, ie Airtime or data) job to airtime queue for the worker
  // then respond 201
});

export default route;
