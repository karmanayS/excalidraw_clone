import { queueName } from "@repo/common/common";
import { prisma } from "@repo/db/client";
import { createClient } from "redis";
 
const redis = createClient()

async function main() {
    try {
        await redis.connect()
        while (true) {
            const message = await redis.brPop(queueName,0)
            if (!message) return
            const parsedData = JSON.parse(message.element)
            console.log(parsedData)
            await prisma.chats.create({
                data: {
                    roomName: parsedData.roomName,
                    content: parsedData.message,
                    userId: parsedData.userId        
                }
            })
        }
    } catch (err) {
        console.log(err)
        await redis.quit()
        return
    }
}

main()