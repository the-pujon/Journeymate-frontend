'use client';

import React,{ useEffect } from 'react';
import Image from 'next/image';
import { useRouter,useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useResetPasswordMutation } from '@/redux/features/auth/authApi';
import { toast } from 'sonner';
import { Loader2,Lock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card,CardContent,CardHeader,CardTitle,CardDescription } from "@/components/ui/card";
import resetPasswordImage from '@/assets/images/signup3.avif'; // Make sure to have this image
import { motion } from 'framer-motion';

const resetPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
    code: z.string().min(6,'Verification code must be at least 6 characters'),
    newPassword: z.string().min(6,'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword,{
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
    const [resetPassword,{ isLoading }] = useResetPasswordMutation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { register,handleSubmit,formState: { errors },setValue } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const codeParam = searchParams.get('code');
        if (emailParam && codeParam) {
            const decodedEmail = decodeURIComponent(emailParam);
            setValue('email',decodedEmail);
            setValue('code',codeParam);
        } else {

            router.push('/auth/request-recovery');
        }
    },[searchParams,router,setValue]);

    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword,...resetData } = data;
            await resetPassword(resetData).unwrap();
            toast.success('Password reset successful!');
            router.push('/auth/signin');
        } catch (error) {
            console.error(error);
            toast.error('Password reset failed. Please try again.');
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
                        src={resetPasswordImage}
                        alt="Reset password background"
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
                                Enter your new password
                            </CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
                            variants={itemVariants}
                        >
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                                <input type="hidden" {...register("email")} />
                                <input type="hidden" {...register("code")} />
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <Input
                                            {...register("newPassword")}
                                            id="newPassword"
                                            type="password"
                                            className="pl-10"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <Input
                                            {...register("confirmPassword")}
                                            id="confirmPassword"
                                            type="password"
                                            className="pl-10"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" /> : <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                                        Reset Password
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </CardContent>
                </motion.div>
            </Card>
        </motion.div>
    );
};

export default ResetPassword;