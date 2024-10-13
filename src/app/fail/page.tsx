'use client';

import React,{ useEffect,useState } from 'react';
import { useRouter,useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCreatePaymentMutation } from '@/redux/features/payment/paymentApi';
import { withAuth } from '@/components/auth/withAuth';

const FailPayment = () => {
    const [transactionId,setTransactionId] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [createPayment] = useCreatePaymentMutation();

    useEffect(() => {
        const txnId = searchParams.get('transactionId');
        if (txnId) {
            setTransactionId(txnId);
            handleFailedPayment(txnId);
        } else {
            router.push('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchParams,router]);

    const handleFailedPayment = async (txnId: string) => {
        try {
            const paymentData = {
                transactionId: txnId,
                status: "failed",
                amount: 50, // Adjust as needed
            };
            await createPayment(paymentData).unwrap();
        } catch (err) {
            console.error('Failed to record failed payment:',err);
        }
    };

    return (
        <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
            {transactionId ? (
                <div>
                    <p className="text-lg mb-2">We&apos;re sorry, but your payment could not be processed.</p>
                    <p className="text-md mb-4">
                        Transaction ID: <span className="font-semibold">{transactionId}</span>
                    </p>
                    <p className="text-md mb-6">
                        Please keep this transaction ID for your records and contact our support team if you need assistance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/dashboard/verify-user" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Try Again
                        </Link>
                        <Link href="/contact" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                            Contact Support
                        </Link>
                    </div>
                </div>
            ) : (
                <p className="text-lg text-red-500">No transaction information found. Redirecting to home page...</p>
            )}
        </div>
    );
};

export default withAuth(FailPayment,['user','admin']);
