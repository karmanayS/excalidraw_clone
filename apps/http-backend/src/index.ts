import express from "express";
import jwt from "jsonwebtoken"
import cors from "cors"
import cookieParser from "cookie-parser"
import { userAuthMiddleware } from "./middlewares/userAuth";
import { JWT_SECRET, signupSchema, signinSchema, roomSchema } from "@repo/common/common"
import { prisma } from "@repo/db"
import * as bcrypt from "bcrypt"

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
    try {
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
        const hashedPassword = await bcrypt.hash(password,10)
        await prisma.users.create({
            data: {
                username,email,
                password: hashedPassword
            }
        })
        res.json({
            success:true,
            message: "Signed up successfully"
        })
    } catch (err) {
        console.log(err)
        return res.json({
            success: false,
            message: "Error while signing up"
        })
    }    
})

app.post("/signin",async (req,res) => {
    const {email,password} = req.body
    try {
        const result = signinSchema.safeParse({
            email, password
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
        if (!existingUser) return res.json({
            success : false,
            message: "User doesnt exist with the following credentials, Please enter the correct credentials"
        })
        const compare = await bcrypt.compare(password,existingUser.password)
        if (!compare) return res.json({
            success : false,
            message: "Incorrect password"
        })
        const userId = existingUser.id
        const token = jwt.sign({userId},JWT_SECRET) 
        res.cookie("token",token,{
            httpOnly:true,
        }) // specify the same site or domain property
        return res.json({
            success:true,
            message: "Signed in successfully"
        })
    } catch (err) {
        console.log(err)
        return res.json({
            success: false,
            message: "Error while signing in"
        })
    }    
})

app.post("/create-room",userAuthMiddleware,async(req,res) => {
    const userId = req.userId as string
    const {roomName}:{roomName:string} = req.body
    try {
        const result = roomSchema.safeParse({
            name: roomName
        })
        if (!result.success) return res.json({
            success: false,
            message: result.error.message
        })
        const newRoom = prisma.rooms.create({
            data: {
                name: roomName,
                adminId: userId
            }
        })
        const roomId = (await newRoom).id
        return res.json({
            success:true,
            message: "Created room successfully"
        })
    } catch (err) {
        console.log(err)
        return res.json({
            success: false,
            message: "Error while creating room"
        })
    }    
})

app.get("/chats",userAuthMiddleware,async(req,res) => {
    const roomId = Number(req.query.roomId)
    try {
        const chats = await prisma.chats.findMany({
            where: {
                roomId
            }
        })
        if (!chats) return res.json({success: false,message: "Incorrect room ID"})
        return res.json({
            success:true,
            chats
        })    
    } catch (err) {
        console.log(err)
        return res.json({
            success: false,
            message: "Error while fetching previous chats of the room"
        })
    }     
})

app.listen(PORT,() => {
    console.log(`listening on port ${PORT}...`)
})