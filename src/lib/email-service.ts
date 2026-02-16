
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

export const getDonorEmailTemplate = (donation: any) =>
{
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #FF5E14;">
                <img src="https://cherivenfoundation.org/logo.jpeg" alt="Cheriven Foundation" style="max-height: 80px; width: auto;">
            </div>
            <div style="padding: 40px 30px; background-color: #ffffff;">
                <h2 style="color: #1a1a1a; margin-top: 0;">Thank You for Your Donation!</h2>
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">Dear ${donation.name},</p>
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">Thank you so much for your generous donation of <strong>₦${(donation.amount / 100).toLocaleString()}</strong> to Cheriven Foundation.</p>
                ${donation.program ? `<p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">Your donation will support: <strong>${donation.program}</strong></p>` : ''}
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">Your support helps us reach the most vulnerable communities around the world.</p>
                <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; color: #333;"><strong>Transaction Reference:</strong> ${donation.reference}</p>
                </div>
                <br>
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">Warm regards,</p>
                <p style="color: #1a1a1a; font-weight: bold;">The Cheriven Foundation Team</p>
            </div>
            <div style="background-color: #1a1a1a; color: #ffffff; padding: 20px; text-align: center; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} Cheriven Foundation. All rights reserved.</p>
                <p>Suite 111/125 El-Rufai Block, New Garki International Market, Abuja, Nigeria.</p>
            </div>
        </div>
    `;
};

export const getAdminEmailTemplate = (donation: any) =>
{
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #FF5E14;">
                <img src="https://cherivenfoundation.org/logo.jpeg" alt="Cheriven Foundation" style="max-height: 80px; width: auto;">
            </div>
            <div style="padding: 40px 30px; background-color: #ffffff;">
                <h2 style="color: #1a1a1a; margin-top: 0;">New Donation Received!</h2>
                <p><strong>Donor Name:</strong> ${donation.name}</p>
                <p><strong>Donor Email:</strong> ${donation.email}</p>
                <p><strong>Amount:</strong> ₦${(donation.amount / 100).toLocaleString()}</p>
                ${donation.program ? `<p><strong>Program:</strong> ${donation.program}</p>` : ''}
                <p><strong>Reference:</strong> ${donation.reference}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Message:</strong> ${donation.message || 'No message provided.'}</p>
            </div>
             <div style="background-color: #1a1a1a; color: #ffffff; padding: 15px; text-align: center; font-size: 12px;">
                <p>System Notification - Cheriven Foundation Website</p>
            </div>
        </div>
    `;
};

export const getContactUserTemplate = (data: any) =>
{
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #FF5E14;">
                <img src="https://cherivenfoundation.org/logo.jpeg" alt="Cheriven Foundation" style="max-height: 80px; width: auto;">
            </div>
            <div style="padding: 40px 30px; background-color: #ffffff;">
                <h2 style="color: #1a1a1a; margin-top: 0;">We Received Your Message</h2>
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">Dear ${data.name},</p>
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">Thank you for contacting Cheriven Foundation. We have received your message and will get back to you as soon as possible.</p>
                <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; color: #333;"><strong>Subject:</strong> Contact Inquiry</p>
                </div>
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">If your inquiry is urgent, please call our support line.</p>
                <br>
                <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">Warm regards,</p>
                <p style="color: #1a1a1a; font-weight: bold;">The Cheriven Foundation Team</p>
            </div>
            <div style="background-color: #1a1a1a; color: #ffffff; padding: 20px; text-align: center; font-size: 12px;">
                <p>&copy; ${new Date().getFullYear()} Cheriven Foundation. All rights reserved.</p>
                <p>Suite 111/125 El-Rufai Block, New Garki International Market, Abuja, Nigeria.</p>
            </div>
        </div>
    `;
};

export const getContactAdminTemplate = (data: any) =>
{
    return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9;">
            <div style="background-color: #ffffff; padding: 20px; text-align: center; border-bottom: 3px solid #FF5E14;">
                <img src="https://cherivenfoundation.org/logo.jpeg" alt="Cheriven Foundation" style="max-height: 80px; width: auto;">
            </div>
            <div style="padding: 40px 30px; background-color: #ffffff;">
                <h2 style="color: #1a1a1a; margin-top: 0;">New Contact Message</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 0; color: #333;"><strong>Message:</strong></p>
                    <p style="margin-top: 10px; color: #555;">${data.message}</p>
                </div>
            </div>
             <div style="background-color: #1a1a1a; color: #ffffff; padding: 15px; text-align: center; font-size: 12px;">
                <p>System Notification - Cheriven Foundation Website</p>
            </div>
        </div>
    `;
};
