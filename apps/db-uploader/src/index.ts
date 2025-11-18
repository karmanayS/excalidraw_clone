import { queueName } from "@repo/common/common";
import { createClient } from "redis";
import { prisma } from "@repo/db"
 
const redis = createClient()

async function main() {
    try {
        await redis.connect()
        while (true) {
            const message = await redis.brPop(queueName,0)
            if (!message) return
            console.log(message.element)
            await 
        }
    } catch (err) {
        console.log(err)
        await redis.quit()
        return
    }
}

main()