/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react';
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table"; // Table components from shadcn
import { motion } from 'framer-motion';
import { useGetPaymentsQuery } from '@/redux/features/payment/paymentApi';
import Loading from '@/components/shared/Loading';
import { withAuth } from '@/components/auth/withAuth';

const PaymentManagement = () => {

    const { data: payments,isLoading } = useGetPaymentsQuery(undefined);

    console.log(payments);

    if (isLoading) return <Loading />;

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
                            <TableHead>User Name</TableHead>
                            <TableHead>User Email</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Transaction ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments?.data?.map((payment: any,index: number) => (
                            <TableRow key={index}>
                                <TableCell>{payment?.user?._id}</TableCell>
                                <TableCell>{payment?.user?.name}</TableCell>
                                <TableCell>{payment?.user?.email}</TableCell>
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

export default withAuth(PaymentManagement,['admin']);
