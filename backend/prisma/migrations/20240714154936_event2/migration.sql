/*
  Warnings:

  - You are about to drop the column `EventTime` on the `events` table. All the data in the column will be lost.
  - Added the required column `eventTime` to the `events` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[events] DROP COLUMN [EventTime];
ALTER TABLE [dbo].[events] ADD [eventTime] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
