'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetUserByIdQuery,useRequestVerificationMutation } from '@/redux/features/user/userApi';
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle,X,Shield,Award,Star,ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Loading from '@/components/shared/Loading';

const VerifyUser = () => {
    const currentUser = useAppSelector(selectCurrentUser);
    const userId = currentUser?._id;
    const { data: userProfile,isLoading } = useGetUserByIdQuery(userId);
    const [requestVerification] = useRequestVerificationMutation();

    const containerVariants = {
        hidden: { opacity: 0,y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 100
            }
        },
    };

    const itemVariants = {
        hidden: { opacity: 0,x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: 'spring',
                damping: 25,
                stiffness: 120
            }
        },
    };

    const handleVerificationRequest = async () => {
        if (userProfile?.data.totalUpvotes === 0) {
            return; // The AlertDialog will handle this case
        }

        try {
            const url = "https://sandbox.aamarpay.com/jsonpost.php";

            const payload = {
                store_id: "aamarpaytest",
                tran_id: "123123173", // You might want to generate a unique transaction ID
                success_url: "http://localhost:3333/api/payment/success",
                fail_url: "http://localhost:3333/api/payment/fail",
                cancel_url: "http://localhost:3333/api/payment/cancel",
                amount: "10.0", // Adjust the amount as needed
                currency: "BDT",
                signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
                desc: "User Verification Payment",
                cus_name: userProfile?.data.name || "User",
                cus_email: userProfile?.data.email || "user@example.com",
                cus_add1: "Address Line 1",
                cus_add2: "Address Line 2",
                cus_city: "City",
                cus_state: "State",
                cus_postcode: "1234",
                cus_country: "Country",
                cus_phone: userProfile?.data.phone || "+1234567890",
                type: "json"
            };

            const response = await fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            // Handle the response from aamarpay
            if (data.result === "true") {
                // Payment initiation successful
                window.location.href = data.payment_url;
            } else {
                // Payment initiation failed
                toast.error('Failed to initiate payment: ' + data.error);
            }

            // If payment is successful, proceed with verification request
            await requestVerification({ userId }).unwrap();
            toast.success('Verification request submitted successfully');
        } catch (error) {
            toast.error('Failed to submit verification request');
            console.error(error);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <motion.div
            className="container mx-auto px-4 py-12 max-w-6xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <h1 className="text-4xl font-bold mb-12 text-center">User Verification</h1>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <motion.div variants={itemVariants}>
                    <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className=" border-b">
                            <CardTitle className="text-2xl font-bold flex items-center text-gray-800">
                                <Shield className="mr-2 text-blue-500" /> Free User
                            </CardTitle>
                            <CardDescription>Current features</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ul className="space-y-4">
                                <li className="flex items-center"><CheckCircle className="mr-2 text-green-600 flex-shrink-0" /> <span>Basic profile</span></li>
                                <li className="flex items-center"><CheckCircle className="mr-2 text-green-600 flex-shrink-0" /> <span>Create posts</span></li>
                                <li className="flex items-center text-gray-500"><X className="mr-2 text-red-600 flex-shrink-0" /> <span>Verified badge</span></li>
                                <li className="flex items-center text-gray-500"><X className="mr-2 text-red-600 flex-shrink-0" /> <span>Premium features</span></li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className=" border-b">
                            <CardTitle className="text-2xl font-bold flex items-center text-gray-800">
                                <Award className="mr-2 text-purple-500" /> Verified User
                            </CardTitle>
                            <CardDescription>Premium features</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <ul className="space-y-4">
                                <li className="flex items-center"><CheckCircle className="mr-2 text-green-600 flex-shrink-0" /> <span>All free features</span></li>
                                <li className="flex items-center"><CheckCircle className="mr-2 text-green-600 flex-shrink-0" /> <span>Verified badge</span></li>
                                <li className="flex items-center"><CheckCircle className="mr-2 text-green-600 flex-shrink-0" /> <span>Priority support</span></li>
                                <li className="flex items-center"><CheckCircle className="mr-2 text-green-600 flex-shrink-0" /> <span>Exclusive content</span></li>
                            </ul>
                        </CardContent>
                        <CardFooter className="pt-6">
                            {userProfile?.data.totalUpvotes === 0 ? (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="w-full">Start Verification Process</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Verification Not Available</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Your upvote count is 0. You need to receive upvotes on your posts to be eligible for verification.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Close</AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <Button onClick={handleVerificationRequest} className="w-full">
                                    Start Verification Process
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
            <motion.div variants={itemVariants}>
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className=" border-b">
                        <CardTitle className="text-2xl font-bold flex items-center text-gray-800">
                            <Star className="mr-2 text-yellow-500" /> Your Verification Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <p className="flex items-center">
                                <ThumbsUp className="mr-2 text-blue-500 flex-shrink-0" />
                                <strong className="mr-2">Total Upvotes:</strong>
                                <span className="px-3 py-1 bg-gray-100 rounded-full">{userProfile?.data.totalUpvotes}</span>
                            </p>
                            <p className="flex items-center">
                                <Shield className="mr-2 text-green-500 flex-shrink-0" />
                                <strong className="mr-2">Verified:</strong>
                                <span className={`px-3 py-1 ${userProfile?.data.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-full`}>
                                    {userProfile?.data.verified ? 'Yes' : 'No'}
                                </span>
                            </p>
                            {userProfile?.data.verificationRequestDate && (
                                <p className="flex items-center">
                                    <Award className="mr-2 text-purple-500 flex-shrink-0" />
                                    <strong className="mr-2">Last Verification Request:</strong>
                                    <span className="px-3 py-1 bg-gray-100 rounded-full">
                                        {new Date(userProfile.data.verificationRequestDate).toLocaleDateString()}
                                    </span>
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default VerifyUser;
