import express from "express";
import jwt from "jsonwebtoken"
import cors from "cors"
import cookieParser from "cookie-parser"
import { userAuthMiddleware } from "./middlewares/userAuth";
import { JWT_SECRET, userAuthSchema } from "@repo/common/common"

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000" // this should be the frontend url
}))
app.use(cookieParser())

app.post("/signup",(req,res) => {
    const {email, password} = req.body
    const result = userAuthSchema.safeParse({
        email, password
    })
    if (!result.success) return res.json({
        success: false,
        message: result.error.message
    })
    //db query to check if the user already exists
    //hash the password
    //db query to create new user
    res.json({
        success:true,
        message: "Signed up successfully"
    })
})

app.post("/signin",(req,res) => {
    const {email,password} = req.body
    const result = userAuthSchema.safeParse({
        email, password
    })
    if (!result.success) return res.json({
        success: false,
        message: result.error.message
    })
    //db query to check if user exists
    //compare the password hash
    const userId = 1 //get this from the user in db
    const token = jwt.sign({userId},JWT_SECRET) // secret should be an env variable
    res.cookie("token",token,{
        httpOnly:true,
    }) // specify the same site or domain property
    return res.json({
        success:true,
        message: "Signed in successfully"
    })
})

app.post("/create-room",userAuthMiddleware,(req,res) => {
    const userId = req.userId
    const {roomName}:{roomName:string} = req.body
    //room names can be same but id's cannot so when the client sends a message the websocket event type will be roomID and not the name
    //db query to create the room 
    const roomId = 2 // get this from the db
    return res.json({
        success:true,
        message: "Created room successfully"
    })
})

app.listen(PORT,() => {
    console.log(`listening on port ${PORT}...`)
})