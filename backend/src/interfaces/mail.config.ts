export interface MailConfig {
  host: string;
  service: string;
  port: number;
  requireTLS: boolean;
  auth: {
    user: string;
    pass: string;
  };
}
