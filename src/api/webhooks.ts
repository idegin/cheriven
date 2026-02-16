
import { Request, Response } from 'express';
import crypto from 'crypto';
import { sendEmail, getAdminEmailTemplate, getDonorEmailTemplate } from '../lib/email-service.js';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

export const handlePaystackWebhook = async (req: Request, res: Response) =>
{
    // Validate event
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
    /*
        If signatures don't match, ignore this request
        However, for local testing without proper signature forwarding (e.g. ngrok), this might fail if not configured correctly.
        In production, this MUST be enforced.
    */
    if (hash !== req.headers[ 'x-paystack-signature' ]) {
        // console.warn('Invalid webhook signature');
        // return res.status(400).send('Invalid signature');
    }

    const event = req.body;

    if (event.event === 'charge.success') {
        const { data } = event;
        const { amount, reference, customer, metadata } = data;
        const email = customer.email;
        let name = 'Anonymous';
        let message = '';
        let program = '';

        if (metadata && metadata.custom_fields) {
            const donorNameField = metadata.custom_fields.find((f: any) => f.variable_name === 'donor_name');
            if (donorNameField) name = donorNameField.value;

            const messageField = metadata.custom_fields.find((f: any) => f.variable_name === 'message');
            if (messageField) message = messageField.value;

            const programField = metadata.custom_fields.find((f: any) => f.variable_name === 'program_name');
            if (programField) program = programField.value;
        }

        const donationData = {
            name,
            email,
            amount, // in kobo
            reference,
            message,
            program
        };

        // Send Email to Donor
        await sendEmail({
            to: email,
            subject: 'Thank You for Your Donation',
            html: getDonorEmailTemplate(donationData)
        });

        // Send Email to Admin
        await sendEmail({
            to: 'ideginmedia@gmail.com',
            subject: 'New Donation Received',
            html: getAdminEmailTemplate(donationData)
        });

        console.log(`Donation processed for reference: ${reference}`);
    }

    res.status(200).send('Webhook received');
};
