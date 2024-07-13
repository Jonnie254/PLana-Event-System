/*
  Warnings:

  - The primary key for the `events` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `role_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[bookings] DROP CONSTRAINT [bookings_eventId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[group_tickets] DROP CONSTRAINT [group_tickets_eventId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[single_tickets] DROP CONSTRAINT [single_tickets_eventId_fkey];

-- AlterTable
ALTER TABLE [dbo].[bookings] ALTER COLUMN [eventId] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[group_tickets] ALTER COLUMN [eventId] NVARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE [dbo].[single_tickets] ALTER COLUMN [eventId] NVARCHAR(1000) NOT NULL;

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL1 NVARCHAR(MAX) = N''
SELECT @SQL1 += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'events'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL1
;
CREATE TABLE [dbo].[_prisma_new_events] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [image] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL,
    [location] NVARCHAR(1000) NOT NULL,
    [createdById] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [events_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [events_pkey] PRIMARY KEY CLUSTERED ([id])
);
IF EXISTS(SELECT * FROM [dbo].[events])
    EXEC('INSERT INTO [dbo].[_prisma_new_events] ([createdAt],[createdById],[date],[description],[id],[image],[location],[name],[updatedAt]) SELECT [createdAt],[createdById],[date],[description],[id],[image],[location],[name],[updatedAt] FROM [dbo].[events] WITH (holdlock tablockx)');
DROP TABLE [dbo].[events];
EXEC SP_RENAME N'dbo._prisma_new_events', N'events';
DECLARE @SQL2 NVARCHAR(MAX) = N''
SELECT @SQL2 += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'role_requests'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL2
;
CREATE TABLE [dbo].[_prisma_new_role_requests] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [requestedRole] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [role_requests_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [approved] BIT NOT NULL CONSTRAINT [role_requests_approved_df] DEFAULT 0,
    [approvedBy] NVARCHAR(1000),
    CONSTRAINT [role_requests_pkey] PRIMARY KEY CLUSTERED ([id])
);
IF EXISTS(SELECT * FROM [dbo].[role_requests])
    EXEC('INSERT INTO [dbo].[_prisma_new_role_requests] ([createdAt],[id],[requestedRole],[updatedAt],[userId]) SELECT [createdAt],[id],[requestedRole],[updatedAt],[userId] FROM [dbo].[role_requests] WITH (holdlock tablockx)');
DROP TABLE [dbo].[role_requests];
EXEC SP_RENAME N'dbo._prisma_new_role_requests', N'role_requests';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[bookings] ADD CONSTRAINT [bookings_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[events]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[single_tickets] ADD CONSTRAINT [single_tickets_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[events]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[group_tickets] ADD CONSTRAINT [group_tickets_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[events]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
