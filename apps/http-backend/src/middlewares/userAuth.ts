import express, { NextFunction, Request, Response  } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import cookieParser from "cookie-parser"
import { JWT_SECRET } from "@repo/common/common"

const app = express()

app.use(cookieParser())

export const userAuthMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const token:string = req.cookies.token
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