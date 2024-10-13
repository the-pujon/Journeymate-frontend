'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRequestPasswordRecoveryMutation } from '@/redux/features/auth/authApi';
import { toast } from 'sonner';
import { Loader2,Mail } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card,CardContent,CardHeader,CardTitle,CardDescription } from "@/components/ui/card";
import recoveryImage from '@/assets/images/signup3.avif'; // Make sure to have this image
import { motion } from 'framer-motion';

const requestRecoverySchema = z.object({
    email: z.string().email('Invalid email address'),
});

type RequestRecoveryFormValues = z.infer<typeof requestRecoverySchema>;

const RequestRecovery: React.FC = () => {
    const [requestPasswordRecovery,{ isLoading }] = useRequestPasswordRecoveryMutation();
    const router = useRouter();

    const { register,handleSubmit,formState: { errors } } = useForm<RequestRecoveryFormValues>({
        resolver: zodResolver(requestRecoverySchema),
    });

    const onSubmit = async (data: RequestRecoveryFormValues) => {
        try {
            await requestPasswordRecovery(data).unwrap();
            toast.success('Recovery email sent. Please check your inbox.');

            const encodedEmail = encodeURIComponent(data.email);
            router.push(`/auth/verify-recovery?email=${encodedEmail}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to send recovery email. Please try again.');
        }
    };

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
        hidden: { opacity: 0,y: 20 },
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

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Card className="w-full max-w-screen-xl flex flex-col sm:flex-row overflow-hidden">
                <div className="flex-1 hidden sm:block relative h-64 sm:h-auto">
                    <Image
                        src={recoveryImage}
                        alt="Password recovery background"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <motion.div
                    className="w-full sm:w-1/2 lg:w-2/5 p-0 sm:p-8"
                    variants={itemVariants}
                >
                    <CardHeader className="text-center">
                        <motion.div className="mb-4" variants={itemVariants}>
                            <h1 className="text-3xl sm:text-4xl font-extrabold">JourneyMate</h1>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <CardTitle className="text-xl sm:text-2xl font-semibold">Reset your password</CardTitle>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <CardDescription>
                                Enter your email address and we&apos;ll send you a recovery link
                            </CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
                            variants={itemVariants}
                        >
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <Input
                                            {...register("email")}
                                            id="email"
                                            type="email"
                                            className="pl-10"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" /> : <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                                        Send Recovery Email
                                    </Button>
                                </div>
                            </form>

                            <div className="text-center">
                                <Link href="/auth/signin" className="font-medium text-primary hover:underline">
                                    Back to Sign In
                                </Link>
                            </div>
                        </motion.div>
                    </CardContent>
                </motion.div>
            </Card>
        </motion.div>
    );
};

export default RequestRecovery;