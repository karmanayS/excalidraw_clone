import express from "express"
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/common/common"

const app = express()
const server = createServer(app)
const io = new Server(server);
const PORT = 8080

io.use((socket,next) => {
    console.log("Inside socket middleware")
    const token:string = socket.handshake.auth.token; 
    const decoded = jwt.verify(token,JWT_SECRET) as JwtPayload
    if (!decoded.userId) {
        console.log("caught error")
        const err = new Error("Error while authenticating user in ws-server")
        next(err)  
    }
    next() 
})

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(PORT,() => {
    console.log(`listening on port ${PORT}...`)
})
