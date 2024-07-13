BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [firstname] NVARCHAR(1000) NOT NULL,
    [lastname] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [users_role_df] DEFAULT 'USER',
    [isActive] BIT NOT NULL CONSTRAINT [users_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [isDeleted] BIT NOT NULL CONSTRAINT [users_isDeleted_df] DEFAULT 0,
    [isWelcome] BIT NOT NULL CONSTRAINT [users_isWelcome_df] DEFAULT 0,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[bookings] (
    [id] NVARCHAR(1000) NOT NULL,
    [ticketNumber] NVARCHAR(1000) NOT NULL,
    [eventId] INT NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [ticketType] NVARCHAR(1000) NOT NULL,
    [eventLocation] NVARCHAR(1000) NOT NULL,
    [eventDate] DATETIME2 NOT NULL,
    [eventTime] NVARCHAR(1000),
    [eventImage] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL,
    [canEdit] BIT NOT NULL CONSTRAINT [bookings_canEdit_df] DEFAULT 0,
    [canCancel] BIT NOT NULL CONSTRAINT [bookings_canCancel_df] DEFAULT 0,
    [canDelete] BIT NOT NULL CONSTRAINT [bookings_canDelete_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [bookings_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [bookings_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [bookings_ticketNumber_key] UNIQUE NONCLUSTERED ([ticketNumber])
);

-- CreateTable
CREATE TABLE [dbo].[role_requests] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] NVARCHAR(1000) NOT NULL,
    [requestedRole] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [role_requests_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [role_requests_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[events] (
    [id] INT NOT NULL IDENTITY(1,1),
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

-- CreateTable
CREATE TABLE [dbo].[single_tickets] (
    [id] NVARCHAR(1000) NOT NULL,
    [eventId] INT NOT NULL,
    [slots] INT NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [single_tickets_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [single_tickets_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[group_tickets] (
    [id] NVARCHAR(1000) NOT NULL,
    [eventId] INT NOT NULL,
    [slots] INT NOT NULL,
    [price] FLOAT(53) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [group_tickets_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [group_tickets_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[bookings] ADD CONSTRAINT [bookings_eventId_fkey] FOREIGN KEY ([eventId]) REFERENCES [dbo].[events]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[bookings] ADD CONSTRAINT [bookings_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[role_requests] ADD CONSTRAINT [role_requests_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[events] ADD CONSTRAINT [events_createdById_fkey] FOREIGN KEY ([createdById]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

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
