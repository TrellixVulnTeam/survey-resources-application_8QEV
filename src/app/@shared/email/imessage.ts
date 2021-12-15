export interface EmailMessage {
  subject: string;
  to: string;
  senderName: string;
  senderEmail: string;
  cc: string;
  bcc: string;
  textbody: string;
  htmlbody: string;
  attachments: string;
}

export interface EmailResponse {
  status: string;
  messageDate: string;
  message: EmailMessage;
}

export interface EmailTemplate {
  id?: number;
  title?: string;
  emailPurpose?: string;
  emailDescription?: string;
  subject?: string;
  to?: string;
  senderName?: string;
  senderEmail?: string;
  cC?: string;
  bCC?: string;
  messageSubtitle?: string;
  textbody?: string;
  htmlbody?: string;
  dataSource?: string;
  clientId?: string;
}

export interface vwEmailTemplate {
  id?: number;
  title?: string;
  emailPurpose?: string;
  emailDescription?: string;
}
