
import nodemailer from 'nodemailer';

export interface EmailOptions
{
    to: string;
    subject: string;
    html: string;
    from?: string;
}

const transport = nodemailer.createTransport({
    host: "smtp.zeptomail.com",
    port: 587,
    auth: {
        user: "emailapikey", // This could also be an env var if different across environments
        pass: process.env.ZEPTO_PASSWORD || ''
    }
});

export const sendEmail = async (options: EmailOptions) =>
{
    const mailOptions = {
        from: options.from || '"Cheriven Foundation" <noreply@idegin.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
    };

    try {
        const info = await transport.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

export const getAdminEmailTemplate = (donation: any) =>
{
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>New Donation Received!</h2>
            <p><strong>Donor Name:</strong> ${donation.name}</p>
            <p><strong>Donor Email:</strong> ${donation.email}</p>
            <p><strong>Amount:</strong> ₦${(donation.amount / 100).toLocaleString()}</p>
            <p><strong>Reference:</strong> ${donation.reference}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Message:</strong> ${donation.message || 'No message provided.'}</p>
        </div>
    `;
};

export const getDonorEmailTemplate = (donation: any) =>
{
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Thank You for Your Donation!</h2>
            <p>Dear ${donation.name},</p>
            <p>Thank you so much for your generous donation of <strong>₦${(donation.amount / 100).toLocaleString()}</strong> to Cheriven Foundation.</p>
            <p>Your support helps us reach the most vulnerable communities around the world.</p>
            <p><strong>Transaction Reference:</strong> ${donation.reference}</p>
            <br>
            <p>Warm regards,</p>
            <p>The Cheriven Foundation Team</p>
        </div>
    `;
};
