'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSigninMutation } from '@/redux/features/auth/authApi';
import { toast } from 'sonner';
import { Github,Loader2,Mail,Lock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card,CardContent,CardHeader,CardTitle,CardDescription } from "@/components/ui/card";
import Google from '@/assets/icons/Google';
import signinImage from '@/assets/images/signup3.avif';
import { useAppDispatch } from '@/redux/hook';
import { setUser } from '@/redux/features/auth/authSlice';
import { motion } from 'framer-motion';

const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6,'Password must be at least 6 characters'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn: React.FC = () => {
    const [signin,{ isLoading,error }] = useSigninMutation();
    const router = useRouter();
    const dispatch = useAppDispatch();

    console.log(process.env.NEXT_PUBLIC_SERVER_URL);
    console.log(error);

    const { register,handleSubmit,formState: { errors } } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInFormValues) => {
        try {
            const res = await signin(data).unwrap();
            dispatch(setUser({ user: res.data,token: res.token }));
            toast.success('Sign in successful!');
            router.push('/');
        } catch (error) {
            console.error(error);
            toast.error('Sign in failed. Please try again.');
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
                        src={signinImage}
                        alt="Sign in background"
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
                            <CardTitle className="text-xl sm:text-2xl font-semibold">Sign in to your account</CardTitle>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <CardDescription>
                                Or{' '}
                                <Link href="/auth/signup" className="font-medium text-primary hover:underline">
                                    create a new account
                                </Link>
                            </CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
                            variants={itemVariants}
                        >
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {/* Handle GitHub signin */ }}
                            >
                                <Github className="w-5 h-5 mr-2" />
                                Sign in with GitHub
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {/* Handle Google signin */ }}
                            >
                                <Google />
                                <span className="ml-2">Sign in with Google</span>
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-background text-gray-500">Or continue with</span>
                                </div>
                            </div>

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
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <Input
                                            {...register("password")}
                                            id="password"
                                            type="password"
                                            className="pl-10"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <Link href="/auth/request-recovery" className="font-medium text-primary hover:underline">
                                            Forgot your password?
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" /> : <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                                        Sign in
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

export default SignIn;