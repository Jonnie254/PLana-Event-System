BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[users] DROP CONSTRAINT [users_role_df];
ALTER TABLE [dbo].[users] ADD CONSTRAINT [users_role_df] DEFAULT 'admin' FOR [role];

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
