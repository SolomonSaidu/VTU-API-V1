import { date } from "zod";
import prisma from "../lib/prisma.js"
import AppError from "../utils/appError.js";


export const getTransaction = async (req, res, next)=>{
    const userId = req.user.id;

    try {
        const transaction = await prisma.transaction.findMany({
        where:{
            userId
        },
        orderBy:{
            createdAt:"desc"
        },
        skip:0,
        take:10,
    })

    res.status(200).json({
        status:"success",
        transaction
    })
    } catch (error) {
        next(error)
    }
}


export const getTransactionById = async (req, res, next)=>{
    const id = req.params.id;
    console.log(id);
    const transactionId = parseInt(id)

    

    try {
        const transaction = await prisma.transaction.findUnique({
            where:{
                id:transactionId
            }
        });

        if(!transaction) throw new AppError(`Can't find transaction with id: ${id}`, 404)

        res.status(200).json({
            status:"SUCCESS",
            data:transaction
        })
    } catch (error) {
        next(error)
    }
}

