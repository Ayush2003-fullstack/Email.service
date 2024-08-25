
import { EmailService, MockEmailProvider, Email } from './EmailService';

const primaryProvider = new MockEmailProvider('Primary');
const secondaryProvider = new MockEmailProvider('Secondary');

const emailService = new EmailService(primaryProvider, secondaryProvider);

const email: Email = {
    to: 'example@example.com',
    subject: 'Hello World',
    body: 'This is a test email.',
    id: 'email-1234'
};

emailService.sendEmail(email).catch(console.error);
