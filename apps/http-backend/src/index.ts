import express from "express";
import jwt from "jsonwebtoken"
import cors from "cors"
import cookieParser from "cookie-parser"
import { userAuthMiddleware } from "./middlewares/userAuth";
import { JWT_SECRET, signupSchema, signinSchema } from "@repo/common/common"
import { prisma } from "@repo/db"
import bcrypt from "bcrypt"

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000" // this should be the frontend url
}))
app.use(cookieParser())

app.post("/signup",async(req,res) => {
    const {username, email, password} = req.body
    const result = signupSchema.safeParse({
        username, email, password
    })
    if (!result.success) return res.json({
        success: false,
        message: result.error.message
    })
    const existingUser = await prisma.users.findFirst({
        where: {
            email,password
        }
    }) 
    if (existingUser) return res.json({success: false, message:"User already exists please signin"})
    const hashedPassword = bcrypt.hash(password,10)
    res.json({
        success:true,
        message: "Signed up successfully"
    })
})

app.post("/signin",(req,res) => {
    const {email,password} = req.body
    const result = signinSchema.safeParse({
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
    // room name is a unique field in db so put create room logic in try catch and if a room name already exists while creating the room it should enter in the catch block
    const roomId = 2 // get this from the db
    return res.json({
        success:true,
        message: "Created room successfully"
    })
})

app.listen(PORT,() => {
    console.log(`listening on port ${PORT}...`)
})