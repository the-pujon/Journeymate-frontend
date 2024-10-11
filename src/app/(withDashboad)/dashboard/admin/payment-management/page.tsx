'use client'

import React from 'react';
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table"; // Table components from shadcn
import { motion } from 'framer-motion';

const PaymentManagement = () => {
    // Example payment data
    const payments = [
        {
            user: "64b9c9c0f1234f0123456789",
            amount: 500,
            status: "success",
            transactionId: "TXN123456789",
        },
        {
            user: "64b9c9c0f9876a0987654321",
            amount: 250,
            status: "pending",
            transactionId: "TXN987654321",
        },
        {
            user: "64b9c9c0a9876f7654321234",
            amount: 750,
            status: "failed",
            transactionId: "TXN2468101214",
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-center text-primary" > Payment Management</h1 >
            <div className="overflow-x-auto w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Transaction ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((payment,index) => (
                            <TableRow key={index}>
                                <TableCell>{payment.user}</TableCell>
                                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded-md ${payment.status === 'success'
                                            ? 'bg-green-200 text-green-800'
                                            : payment.status === 'pending'
                                                ? 'bg-yellow-200 text-yellow-800'
                                                : 'bg-red-200 text-red-800'
                                            }`}
                                    >
                                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                    </span>
                                </TableCell>
                                <TableCell>{payment.transactionId}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </motion.div >
    );
};

export default PaymentManagement;
