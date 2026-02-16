
import { Request, Response } from 'express';
import { initializePayment } from '../lib/paystack-service';

export const handleDonation = async (req: Request, res: Response) =>
{
    const { amount, email, name, message, programName } = req.body;

    if (!amount || !email) {
        return res.status(400).json({ error: 'Amount and Email are required' });
    }

    try {
        const amountNumber = parseFloat(amount.toString().replace(/,/g, ''));
        const callbackUrl = `${req.protocol}://${req.get('host')}/donations/success`; // or custom success page

        const metadata = {
            custom_fields: [] as any[]
        };

        if (name) metadata.custom_fields.push({ display_name: "Donor Name", variable_name: "donor_name", value: name });
        if (message) metadata.custom_fields.push({ display_name: "Message", variable_name: "message", value: message });
        if (programName) metadata.custom_fields.push({ display_name: "Program", variable_name: "program_name", value: programName });

        const result = await initializePayment(email, amountNumber, callbackUrl, metadata);

        if (result.success && result.data.authorization_url) {
            return res.redirect(result.data.authorization_url);
        } else {
            return res.status(500).json({ error: 'Failed to initialize payment', details: result.error });
        }
    } catch (error) {
        console.error('Donation Handler Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
