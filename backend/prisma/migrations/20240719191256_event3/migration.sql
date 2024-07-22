BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[booking_analytics] (
    [id] NVARCHAR(1000) NOT NULL,
    [eventId] NVARCHAR(1000) NOT NULL,
    [eventName] NVARCHAR(1000) NOT NULL,
    [totalBookings] INT NOT NULL CONSTRAINT [booking_analytics_totalBookings_df] DEFAULT 0,
    [totalRevenue] FLOAT(53) NOT NULL CONSTRAINT [booking_analytics_totalRevenue_df] DEFAULT 0,
    [date] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [booking_analytics_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [booking_analytics_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[event_analytics] (
    [id] NVARCHAR(1000) NOT NULL,
    [eventId] NVARCHAR(1000) NOT NULL,
    [eventName] NVARCHAR(1000) NOT NULL,
    [totalTicketsSold] INT NOT NULL CONSTRAINT [event_analytics_totalTicketsSold_df] DEFAULT 0,
    [totalRevenue] FLOAT(53) NOT NULL CONSTRAINT [event_analytics_totalRevenue_df] DEFAULT 0,
    [attendance] INT NOT NULL CONSTRAINT [event_analytics_attendance_df] DEFAULT 0,
    [date] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [event_analytics_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [event_analytics_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
