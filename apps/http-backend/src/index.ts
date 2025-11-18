import express from "express";
import jwt from "jsonwebtoken"
import cors from "cors"
import { userAuthMiddleware } from "./middlewares/userAuth";
import { JWT_SECRET, signupSchema, signinSchema, roomSchema } from "@repo/common/common"
import * as bcrypt from "bcrypt"
import { prisma } from "@repo/db/client";

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000" // this should be the frontend url
}))

app.post("/signup",async(req,res) => {
    const {username, email, password} = req.body
    try {
        const result = signupSchema.safeParse({
            username, email, password
        })
        if (!result.success) return res.json({
            success: false,
            message: JSON.parse(result.error.message)[0].message
        })
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
            message: "Error while signing up, Please signin if you already have an account"
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
            message: JSON.parse(result.error.message)[0].message
        })
        const existingUser = await prisma.users.findFirst({
            where: {
                email
            }
        })
        if (!existingUser) return res.json({
            success : false,
            message: "Invalid email, enter the right email or signup"
        })
        const compare = await bcrypt.compare(password,existingUser.password)
        if (!compare) return res.json({
            success : false,
            message: "Incorrect password"
        })
        const userId = existingUser.id
        const token = jwt.sign({userId: userId},JWT_SECRET) 
        return res.json({
            success:true,
            message: "Signed in successfully",
            token
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
        await prisma.rooms.create({
            data: {
                name: roomName,
                adminId: userId
            }
        })
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

app.get("/chats/:roomName",userAuthMiddleware,async(req,res) => {
    const roomName = req.params.roomName
    try {
        const existingRoom = await prisma.rooms.findFirst({
            where: {
                name: roomName
            }
        })
        if (!existingRoom) return res.json({success: false,message:"Room doesnt exist with the following name"})
        const chats = await prisma.chats.findMany({
            where: {
                roomId : existingRoom.id
            }, 
            orderBy : {
                id : "desc"
            },
            take:50
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