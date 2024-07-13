/*
  Warnings:

  - The primary key for the `group_tickets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `group_tickets` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `role_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `approvedBy` on the `role_requests` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `role_requests` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `single_tickets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `single_tickets` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'group_tickets'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_group_tickets] (
    [id] INT NOT NULL IDENTITY(1,1),
    [eventId] NVARCHAR(1000) NOT NULL,
    [slots] INT NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [group_tickets_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [group_tickets_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_group_tickets] ON;
IF EXISTS(SELECT * FROM [dbo].[group_tickets])
    EXEC('INSERT INTO [dbo].[_prisma_new_group_tickets] ([createdAt],[eventId],[id],[price],[slots],[updatedAt]) SELECT [createdAt],[eventId],[id],[price],[slots],[updatedAt] FROM [dbo].[group_tickets] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_group_tickets] OFF;
DROP TABLE [dbo].[group_tickets];
EXEC SP_RENAME N'dbo._prisma_new_group_tickets', N'group_tickets';
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'role_requests'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_role_requests] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] NVARCHAR(1000) NOT NULL,
    [requestedRole] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [role_requests_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [approved] BIT NOT NULL CONSTRAINT [role_requests_approved_df] DEFAULT 0,
    CONSTRAINT [role_requests_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_role_requests] ON;
IF EXISTS(SELECT * FROM [dbo].[role_requests])
    EXEC('INSERT INTO [dbo].[_prisma_new_role_requests] ([approved],[createdAt],[id],[requestedRole],[updatedAt],[userId]) SELECT [approved],[createdAt],[id],[requestedRole],[updatedAt],[userId] FROM [dbo].[role_requests] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_role_requests] OFF;
DROP TABLE [dbo].[role_requests];
EXEC SP_RENAME N'dbo._prisma_new_role_requests', N'role_requests';
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'single_tickets'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_single_tickets] (
    [id] INT NOT NULL IDENTITY(1,1),
    [eventId] NVARCHAR(1000) NOT NULL,
    [slots] INT NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [single_tickets_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [single_tickets_pkey] PRIMARY KEY CLUSTERED ([id])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_single_tickets] ON;
IF EXISTS(SELECT * FROM [dbo].[single_tickets])
    EXEC('INSERT INTO [dbo].[_prisma_new_single_tickets] ([createdAt],[eventId],[id],[price],[slots],[updatedAt]) SELECT [createdAt],[eventId],[id],[price],[slots],[updatedAt] FROM [dbo].[single_tickets] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_single_tickets] OFF;
DROP TABLE [dbo].[single_tickets];
EXEC SP_RENAME N'dbo._prisma_new_single_tickets', N'single_tickets';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[events] ADD CONSTRAINT [events_createdById_fkey] FOREIGN KEY ([createdById]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
