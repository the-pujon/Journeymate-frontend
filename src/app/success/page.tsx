'use client';

import React,{ useEffect,useState } from 'react';
import { useSearchParams } from 'next/navigation';

const SuccessPage = () => {
    const [transactionId,setTransactionId] = useState<string | null>(null);
    const searchParams = useSearchParams();

    useEffect(() => {
        const txnId = searchParams.get('transactionId');
        if (txnId) {
            setTransactionId(txnId);
            // Here you can make an API call to create the payment record
            // createPayment(txnId);
        }
    },[searchParams]);

    return (
        <div className="container mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
            {transactionId ? (
                <div>
                    <p className="text-lg mb-2">Thank you for your payment.</p>
                    <p className="text-md">
                        Transaction ID: <span className="font-semibold">{transactionId}</span>
                    </p>
                </div>
            ) : (
                <p className="text-lg text-red-500">No transaction ID found.</p>
            )}
        </div>
    );
};

export default SuccessPage;
