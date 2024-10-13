'use client'

import React from 'react';
import { useForm,SubmitHandler } from 'react-hook-form';
import { useChangePasswordMutation } from '@/redux/features/auth/authApi';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { Loader2,Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { withAuth } from '@/components/auth/withAuth';

interface ChangePasswordFormInputs {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const ChangePassword = () => {
    const [changePassword,{ isLoading }] = useChangePasswordMutation();
    const { register,handleSubmit,reset,formState: { errors },watch } = useForm<ChangePasswordFormInputs>();

    const onSubmit: SubmitHandler<ChangePasswordFormInputs> = async (data) => {
        if (data.newPassword !== data.confirmNewPassword) {
            toast.error("New passwords don't match");
            return;
        }

        try {
            await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            }).unwrap();
            toast.success('Password changed successfully');
            reset();
        } catch (error) {
            toast.error('Failed to change password');
            console.error("error",error)
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

    return (
        <motion.div
            className="container mx-auto px-0 sm:px-4 py-8 max-w-md"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <motion.div variants={itemVariants}>
                        <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
                        <CardDescription>Update your account password</CardDescription>
                    </motion.div>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        {['currentPassword','newPassword','confirmNewPassword'].map((field,index) => (
                            <motion.div
                                key={field}
                                className="space-y-2"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                            >
                                <label htmlFor={field} className="block text-sm font-medium text-gray-700 flex items-center">
                                    <Lock className="w-4 h-4 mr-2" /> {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g,' $1')}
                                </label>
                                <Input
                                    id={field}
                                    type="password"
                                    {...register(field as keyof ChangePasswordFormInputs,{
                                        required: `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g,' $1')} is required`,
                                        ...(field === 'newPassword' && {
                                            minLength: { value: 6,message: 'Password must be at least 6 characters long' }
                                        }),
                                        ...(field === 'confirmNewPassword' && {
                                            validate: (val: string) => watch('newPassword') === val || "Passwords do not match"
                                        })
                                    })}
                                    className="w-full"
                                />
                                {errors[field as keyof ChangePasswordFormInputs] && (
                                    <p className="text-red-500 text-xs mt-1">{errors[field as keyof ChangePasswordFormInputs]?.message}</p>
                                )}
                            </motion.div>
                        ))}
                    </CardContent>
                    <CardFooter>
                        <motion.div
                            className="w-full"
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.3 }}
                        >
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="animate-spin mr-2" />Changing Password...
                                    </div>
                                ) : 'Change Password'}
                            </Button>
                        </motion.div>
                    </CardFooter>
                </form>
            </Card>
        </motion.div>
    );
};

export default withAuth(ChangePassword,['user','admin']);