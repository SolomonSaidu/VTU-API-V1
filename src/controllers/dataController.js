import crypto from "crypto";
import prisma from "../lib/prisma.js";
import AppError from "../utils/appError.js";
import { dataQueues } from "../queues/dataQueues.js";
import { tryCatch } from "bullmq";

const Data = async (req, res, next) => {
  const transactionId = req.transaction.id;

  try {
    await dataQueues.add("data", {
      transactionId,
    });

    res.status(202).json({
      status: "PENDING",
      message: "Data purchase is being processed.",
      transactionId,
    });
  } catch (error) {
    next(error);
  }
};

export default Data;
