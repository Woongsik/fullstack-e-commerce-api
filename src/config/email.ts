import dotenv from 'dotenv';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

import { UserDocument } from '../model/UserModel';

dotenv.config({ path: '.env' });



export const sendEmail = async (email: string, title: string, subTitle: string, personalization: any, templateId: string) => {
  const mailerSend = new MailerSend({
    apiKey: process.env.MAILER_API_KEY as string,
  });
  
  const sender: string = process.env.MAILER_SENDER as string;
  const sentFrom: Sender = new Sender(sender, "fs17-Fullstack");
  const recipients: Recipient[] = [
    new Recipient(email, title)
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setTemplateId(templateId)
    .setPersonalization(personalization)
    .setSubject(subTitle);

  return await mailerSend.email.send(emailParams);
}


export const sendWelcomeEmail = async (user: UserDocument, plainPasswordForGoogleLogin: string | null = null) => {  
  const personalization = [{
    "email": user.email, 
    "data": {
      "username": user.username,
      "email": user.email,
      "password": plainPasswordForGoogleLogin
    }
  }];

  const templateId: string = process.env.MAILER_TEMPLATE_WELCOME_FOR_GOOGLE_USER as string;
  
  return await sendEmail(
    user.email, 
    `Hello, ${user.username}!`, 
    `Welcome to join us!`,
    personalization, 
    templateId);
}

export const sendForgetPasswordEmail = async (user: UserDocument, newPassword: string) => {  
  const personalization = [{
    "email": user.email, 
    "data": {
      "username": user.username,
      "email": user.email,
      "password": newPassword,
      "support_team": 'support@mail.com'
    }
  }];

  const templateId: string = process.env.MAILER_TEMPLATE_FORGET_PASSWORD as string;
  
  return await sendEmail(
    user.email, 
    `Hello, ${user.username}!`, 
    `Forget password`,
    personalization, 
    templateId);
}
