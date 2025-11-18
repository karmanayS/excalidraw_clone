import express from "express"
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/common/common"

const app = express()
const server = createServer(app)
const io = new Server(server,{
  cors: {
    origin: ["http://localhost:3000"]
  }
});
const PORT = 8080

io.use((socket,next) => {
    console.log("Inside socket middleware")
    try {
        const token = socket.handshake.auth.token;
        if (typeof(token) !== "string" || !token) {next(new Error("Invalid auth token"))}
        const decoded = jwt.verify(token as string,JWT_SECRET) as JwtPayload
        if (!decoded.userId) {
            const err = new Error("Error while authenticating user in ws-server")
            next(err)  
        }
        next()
    } catch (err) {
        console.log(err)
        next(new Error("User authentication failed"))
    }     
})

io.on('connection', (socket) => {
  // join room logic
  socket.on("join",(roomName:string) => {
    console.log("joined room : ", roomName)
    socket.join(roomName)
  })

  //send Message
  socket.on("sendMessage",(data:{roomName:string,message:string}) => {
    console.log(data)
    //push to a queue
    
    socket.to(data.roomName).emit("message",data.message); 
  })

  //leave a room
  socket.on("leave",(roomName:string) => {
    console.log("left room : ", roomName)
    socket.leave(roomName)
  })
});

server.listen(PORT,() => {
    console.log(`listening on port ${PORT}...`)
})
