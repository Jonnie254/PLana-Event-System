/*
  Warnings:

  - You are about to drop the column `userId` on the `chat_messages` table. All the data in the column will be lost.
  - Added the required column `chatRoomId` to the `chat_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `chat_messages` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[chat_messages] DROP CONSTRAINT [chat_messages_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[chat_messages] DROP COLUMN [userId];
ALTER TABLE [dbo].[chat_messages] ADD [chatRoomId] NVARCHAR(1000) NOT NULL,
[senderId] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[users] DROP CONSTRAINT [users_role_df];
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_role_df] DEFAULT 'planner' FOR [role];

-- CreateTable
CREATE TABLE [dbo].[chat_rooms] (
    [id] NVARCHAR(1000) NOT NULL,
    [eventId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [chat_rooms_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[chat_room_users] (
    [chatRoomId] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [chat_room_users_pkey] PRIMARY KEY CLUSTERED ([chatRoomId],[userId])
);

-- AddForeignKey
ALTER TABLE [dbo].[chat_messages] ADD CONSTRAINT [chat_messages_senderId_fkey] FOREIGN KEY ([senderId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[chat_messages] ADD CONSTRAINT [chat_messages_chatRoomId_fkey] FOREIGN KEY ([chatRoomId]) REFERENCES [dbo].[chat_rooms]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[chat_rooms] ADD CONSTRAINT [chat_rooms_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[events]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[chat_room_users] ADD CONSTRAINT [chat_room_users_chatRoomId_fkey] FOREIGN KEY ([chatRoomId]) REFERENCES [dbo].[chat_rooms]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[chat_room_users] ADD CONSTRAINT [chat_room_users_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
