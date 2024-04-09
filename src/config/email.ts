import dotenv from 'dotenv';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { UserDocument } from '../model/UserModel';
dotenv.config({ path: '.env' });

export const sendWelcomeEmail = async (user: UserDocument, plainPasswordForGoogleLogin: string | null = null) => {  
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILER_API_KEY as string,
  });
  
  const welcomeTemplateId: string = '3yxj6ljd931ldo2r';
  const welcomeTemplateIdForGoogle: string = 'yzkq340je3xld796'; 
  const templateId: string = plainPasswordForGoogleLogin ? welcomeTemplateIdForGoogle : welcomeTemplateId;
  
  const sender: string = 'admin@trial-jy7zpl93980l5vx6.mlsender.net';
  const sentFrom: Sender = new Sender(sender, "fs17-Node, Group 5");
  const recipients: Recipient[] = [
    new Recipient(user.email, `Hello, ${user.firstname}!`)
  ];
  
  const personalization = [{
    "email": user.email, 
    "data": {
      "name": user.firstname,
      "group_name": "fs17-node-group5",
      "password": plainPasswordForGoogleLogin
    }
  }];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setTemplateId(templateId)
    .setPersonalization(personalization)
    .setSubject("Welcome to fs17-Node, Group5");

  return await mailerSend.email.send(emailParams);
}
