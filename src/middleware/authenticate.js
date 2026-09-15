import jwt from "jsonwebtoken"

export const Authenticate = async (req, res, next) =>{
    const authHeader = req.headers.authorization

    if(!authHeader?.startsWith("Bearer ")) return res.status(401).json({msg:"Not Authenticated"})

    const token = authHeader.split(" ")[1]

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        
        req.user = decode
        next()
    } catch (error) {
        console.log(error.message);
        
        res.status(500).json("Error while authenticating")
    }
}