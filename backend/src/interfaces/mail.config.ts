export interface MailConfig {
  host: string;
  service: string;
  port: number;
  secure: boolean;
  requireTLS: {
    rejectUnauthorized: boolean;
  };
  auth: {
    user: string;
    pass: string;
  };
}
