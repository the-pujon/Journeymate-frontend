'use client';

import React,{ useEffect,useState } from 'react';
import { useRouter,useSearchParams } from 'next/navigation';
import { useCreatePaymentMutation } from '@/redux/features/payment/paymentApi';
import { toast } from 'sonner';

const SuccessPage = () => {
    const [transactionId,setTransactionId] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [createPayment,{ isLoading,isError,error }] = useCreatePaymentMutation();

    useEffect(() => {
        const txnId = searchParams.get('transactionId');
        if (txnId) {
            setTransactionId(txnId);
            handlePayment(txnId);
        } else {
            // Redirect to verification page if no transaction ID
            router.push('/verify');
        }
    },[searchParams,router]);

    const handlePayment = async (txnId: string) => {
        try {
            const paymentData = {
                transactionId: txnId,
                status: "success",
                amount: 50, // Assuming a fixed amount, adjust as needed
            };
            await createPayment(paymentData).unwrap();
            toast.success('Payment created successfully');
            // Redirect to profile page on successful payment creation
            router.push('/profile');
        } catch (err) {
            console.error('Failed to create payment:',err);
            // You might want to show an error message to the user here
        }
    };

    if (isLoading) {
        return <div className="text-center mt-10">Processing payment...</div>;
    }

    if (isError) {
        return <div className="text-center mt-10 text-red-500">Error: {(error as any)?.data?.message || 'Failed to process payment'}</div>;
    }

    return (
        <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
            {transactionId ? (
                <div>
                    <p className="text-lg mb-2">Thank you for your payment.</p>
                    <p className="text-md">
                        Transaction ID: <span className="font-semibold">{transactionId}</span>
                    </p>
                    <p className="text-md mt-4">Redirecting to your profile...</p>
                </div>
            ) : (
                <p className="text-lg text-red-500">No transaction ID found. Redirecting to verification...</p>
            )}
        </div>
    );
};

export default SuccessPage;
