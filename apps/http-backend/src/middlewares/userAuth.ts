import express, { NextFunction, Request, Response  } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import cookieParser from "cookie-parser"

const app = express()

app.use(cookieParser())

export const userAuthMiddleware = (req:Request,res:Response,next:NextFunction) => {
    const token:string = req.cookies.token
    try {
        const decoded = jwt.verify(token,"Secret") as JwtPayload //secret from env
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