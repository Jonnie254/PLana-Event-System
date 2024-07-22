BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[group_ticket_members] DROP CONSTRAINT [group_ticket_members_email_key];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
