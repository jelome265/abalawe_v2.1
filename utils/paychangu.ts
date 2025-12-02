export const PAYCHANGU_API_URL = 'https://api.paychangu.com';

export interface PayChanguPaymentProps {
    amount: number;
    currency: string;
    email: string;
    firstName: string;
    lastName: string;
    callbackUrl: string;
    returnUrl: string;
    txRef: string;
}

export async function initiatePayment(paymentDetails: PayChanguPaymentProps) {
    const response = await fetch(`${PAYCHANGU_API_URL}/payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
        },
        body: JSON.stringify({
            amount: paymentDetails.amount,
            currency: paymentDetails.currency,
            email: paymentDetails.email,
            first_name: paymentDetails.firstName,
            last_name: paymentDetails.lastName,
            callback_url: paymentDetails.callbackUrl,
            return_url: paymentDetails.returnUrl,
            tx_ref: paymentDetails.txRef,
            customization: {
                title: 'Abalawe Payment',
                description: 'Payment for items in cart',
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment initiation failed');
    }

    return response.json();
}

export async function verifyPayment(txRef: string) {
    const response = await fetch(`${PAYCHANGU_API_URL}/payment/verify/${txRef}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
        },
    });

    if (!response.ok) {
        throw new Error('Payment verification failed');
    }

    return response.json();
}
