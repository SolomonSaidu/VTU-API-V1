import "dotenv/config";
import express from "express"
import users from "./routes/userRoute.js"
import airtime from "./routes/airtimeRoute.js"
import data from "./routes/dataRoutes.js"
import transactions from "./routes/transactionRoute.js"
import { errorHandler } from "./middleware/errorHandler.js";
import wallet from "./routes/walletRoutes.js"
import "./worker/airtimeWorker.js"
import "./worker/dataWorker.js"


const app = express()
app.use(express.json())
const version = "v1"

app.use(`/api/${version}/user`, users);
app.use(`/api/${version}/wallet`, wallet)
app.use(`/api/${version}`, airtime)
app.use(`/api/${version}`, data)
app.use(`/api/${version}`, transactions)
app.use(errorHandler)

app.get("/api", (req, res)=>{
    res.json({msg:"Server is working..."})
})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log("sever runing on port:", PORT);
})