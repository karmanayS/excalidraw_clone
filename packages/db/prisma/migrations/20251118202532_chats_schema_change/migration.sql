/*
  Warnings:

  - You are about to drop the column `roomId` on the `Chats` table. All the data in the column will be lost.
  - Added the required column `roomName` to the `Chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_roomId_fkey";

-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "roomId",
ADD COLUMN     "roomName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_roomName_fkey" FOREIGN KEY ("roomName") REFERENCES "Rooms"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
