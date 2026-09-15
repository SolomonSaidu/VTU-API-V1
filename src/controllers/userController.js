import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { email, safeParse, validate } from "zod";
import z from "zod";

export const User = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        wallet: {
          where: {
            userId,
          },
          select: {
            balance: true,
          },
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        balance: user.wallet.balance,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const Register = async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 6);

  try {
    const checkUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkUser) throw new AppError("User already exist.", 400);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,

        wallet: {
          create: {},
        },
      },
      select: {
        name: true,
        email: true,
        phone: true,
        wallet: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new AppError("Invalid password or email", 404);

    const validatePassword = await bcrypt.compare(password, user.passwordHash);

    if (!validatePassword)
      throw new AppError("Invalid password or email.", 403);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      token,
    });
  } catch (error) {
    next(error);
  }
};
