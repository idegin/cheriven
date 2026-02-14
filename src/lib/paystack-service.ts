
import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

export const initializePayment = async (email: string, amount: number, callbackUrl: string, metadata?: any) =>
{
    try {
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amount * 100, // Paystack amount is in kobo
                callback_url: callbackUrl,
                metadata: JSON.stringify(metadata)
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return { success: true, data: response.data.data };
    } catch (error: any) {
        console.error('Paystack Initialization Error:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};

export const verifyPayment = async (reference: string) =>
{
    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );
        return { success: true, data: response.data.data };
    } catch (error: any) {
        console.error('Paystack Verification Error:', error.response?.data || error.message);
        return { success: false, error: error.response?.data || error.message };
    }
};
