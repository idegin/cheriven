import { Request, Response } from 'express';
import { sendEmail, getContactUserTemplate, getContactAdminTemplate } from '../lib/email-service.js';

export const handleContactForm = async (req: Request, res: Response): Promise<void> =>
{
    try {
        const { name, email, phone, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            res.status(400).json({ success: false, message: 'Please provide all required fields (Name, Email, Message).' });
            return;
        }

        // Prepare data for templates
        const contactData = {
            name,
            email,
            phone,
            message
        };

        // 1. Send Admin Notification
        const adminEmailOptions = {
            to: 'info@cherivenfoundation.org', // Foundation email
            subject: `New Contact Message from ${name}`,
            html: getContactAdminTemplate(contactData),
            from: '"Cheriven Web" <noreply@cherivenfoundation.org>'
        };

        // 2. Send User Acknowledgment
        const userEmailOptions = {
            to: email,
            subject: 'We received your message - Cheriven Foundation',
            html: getContactUserTemplate(contactData),
            from: '"Cheriven Foundation" <info@cherivenfoundation.org>'
        };

        // Send emails in parallel (fire and forget for faster response, or await?)
        // Better to await to ensure success, or at least log errors.
        const adminSend = sendEmail(adminEmailOptions);
        const userSend = sendEmail(userEmailOptions);

        await Promise.all([ adminSend, userSend ]);

        res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (error) {
        console.error('Error handling contact form:', error);
        res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
    }
};


