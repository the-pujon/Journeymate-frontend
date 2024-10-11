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
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
            await requestVerification({ userId }).unwrap();
            toast.success('Verification request submitted successfully');
        } catch (error) {
            toast.error('Failed to submit verification request');
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>;
    }

    return (
        <motion.div
            className="container mx-auto px-4 py-8 max-w-6xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <h1 className="text-4xl font-bold mb-8 text-center">User Verification</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center">
                                <Shield className="mr-2" /> Free User
                            </CardTitle>
                            <CardDescription>Current features</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                <li className="flex items-center"><CheckCircle className="mr-2 text-green-600" /> Basic profile</li>
                                <li className="flex items-center"><CheckCircle className="mr-2 text-green-600" /> Create posts</li>
                                <li className="flex items-center text-gray-500"><X className="mr-2 text-red-600" /> Verified badge</li>
                                <li className="flex items-center text-gray-500"><X className="mr-2 text-red-600" /> Premium features</li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center">
                                <Award className="mr-2" /> Verified User
                            </CardTitle>
                            <CardDescription>Premium features</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                <li className="flex items-center"><CheckCircle className="mr-2 text-green-600" /> All free features</li>
                                <li className="flex items-center"><CheckCircle className="mr-2 text-green-600" /> Verified badge</li>
                                <li className="flex items-center"><CheckCircle className="mr-2 text-green-600" /> Priority support</li>
                                <li className="flex items-center"><CheckCircle className="mr-2 text-green-600" /> Exclusive content</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
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
            <motion.div variants={itemVariants} className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold flex items-center">
                            <Star className="mr-2" /> Your Verification Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <p className="flex items-center">
                                <ThumbsUp className="mr-2" />
                                <strong>Total Upvotes:</strong>
                                <span className="ml-2 px-3 py-1 bg-gray-100 rounded-full">{userProfile?.data.totalUpvotes}</span>
                            </p>
                            <p className="flex items-center">
                                <Shield className="mr-2" />
                                <strong>Verified:</strong>
                                <span className={`ml-2 px-3 py-1 ${userProfile?.data.verified ? 'bg-green-100' : 'bg-red-100'} rounded-full`}>
                                    {userProfile?.data.verified ? 'Yes' : 'No'}
                                </span>
                            </p>
                            {userProfile?.data.verificationRequestDate && (
                                <p className="flex items-center">
                                    <Award className="mr-2" />
                                    <strong>Last Verification Request:</strong>
                                    <span className="ml-2 px-3 py-1 bg-gray-100 rounded-full">
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