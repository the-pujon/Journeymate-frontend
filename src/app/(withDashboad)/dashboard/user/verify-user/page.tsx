'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetUserByIdQuery } from '@/redux/features/user/userApi';
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle,X,Shield,Award,Star,ThumbsUp } from 'lucide-react';
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
import { withAuth } from '@/components/auth/withAuth';

const VerifyUser = () => {
    const currentUser = useAppSelector(selectCurrentUser);
    const userId = currentUser?._id;
    const { data: userProfile,isLoading } = useGetUserByIdQuery(userId);

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

        try {

            const payload = new URLSearchParams({
                store_id: 'aamarpaytest',
                signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
                cus_name: 'Customer Name',
                cus_email: 'example@gmail.com',
                cus_phone: '01870******',
                amount: '10',
                currency: 'BDT',
                tran_id: Date.now().toString(),
                desc: `User Verification Payment`,
                success_url: `${process.env.NEXT_PUBLIC_SERVER_URL as string}/payment/success`,
                fail_url: `${process.env.NEXT_PUBLIC_SERVER_URL as string}/payment/failure`,
                cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL as string}/`,
                type: 'json'
            })

            const response = await fetch('https://sandbox.aamarpay.com/index.php',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: payload
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            if (result.payment_url) {
                window.location.href = result.payment_url
            } else {
                throw new Error('No payment URL received')
            }
        } catch (error) {
            console.error('Payment initiation failed:',error)
        } finally {
            //setIsLoading(false)
        }
    }


    if (isLoading) {
        return <Loading />;
    }

    const verificationFee = 50;

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
                            <div className="mt-6 p-4 bg-blue-50 rounded-md">
                                <p className=" font-semibold">Verification Fee: ${verificationFee}</p>
                            </div>
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
                                <Button disabled={isLoading || userProfile?.data.verified} onClick={handleVerificationRequest} className="w-full">
                                    {
                                        userProfile?.data.verified ? 'Verified' : 'Start Verification Process'
                                    }
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

export default withAuth(VerifyUser,['user','admin']);
