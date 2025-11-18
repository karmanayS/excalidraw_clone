import { NextFunction, Request, Response  } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/common/common"

export const userAuthMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const token = req.headers.authorization
    if (!token) return res.json({
        success: false,
        messsage: "Invalid auth token"
    })
    try {
        const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload 
        req.userId = decoded.userId
        if (!req.userId) return res.json({
            success: false,
            message: "Error fetching user ID from cookie"
        })
        next()
    } catch(err) {
        console.log(err)
        return res.json({
            success: false,
            message: "Error while authenticating user"
        })
    }
    
}