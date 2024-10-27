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
import { Github,Loader2,Mail,Lock,User,ShieldCheck } from 'lucide-react';
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
    const [signin,{ isLoading }] = useSigninMutation();
    const router = useRouter();
    const dispatch = useAppDispatch();

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

    const userCredentials = {
        email: "user@gmail.com",
        password: "12345678"
    };

    const adminCredentials = {
        email: "web@programming-hero.com",
        password: "12345678"
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center p-4 bg-background"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Card className="w-full max-w-screen-xl flex flex-col sm:flex-row overflow-hidden shadow-lg">
                <div className="flex-1 hidden sm:block relative h-64 sm:h-auto">
                    <Image
                        src={signinImage}
                        alt="Sign in background"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <motion.div
                    className="w-full sm:w-1/2 lg:w-2/5 p-6 sm:p-10"
                    variants={itemVariants}
                >
                    <CardHeader className="text-center">
                        <motion.div className="mb-4" variants={itemVariants}>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary">JourneyMate</h1>
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
                            className="mt-6 sm:mt-8 space-y-6"
                            variants={itemVariants}
                        >
                            {/* Credentials Display */}
                            <div className="bg-muted p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-2 text-center text-foreground">Demo Credentials</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-card p-4 rounded-md">
                                        <div className="flex items-center mb-2">
                                            <User className="w-5 h-5 text-primary mr-2" />
                                            <h4 className="font-medium text-foreground">User</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground"><span className="font-medium">Email:</span> {userCredentials.email}</p>
                                        <p className="text-sm text-muted-foreground"><span className="font-medium">Password:</span> {userCredentials.password}</p>
                                    </div>
                                    <div className="bg-card p-4 rounded-md">
                                        <div className="flex items-center mb-2">
                                            <ShieldCheck className="w-5 h-5 text-primary mr-2" />
                                            <h4 className="font-medium text-foreground">Admin</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground"><span className="font-medium">Email:</span> {adminCredentials.email}</p>
                                        <p className="text-sm text-muted-foreground"><span className="font-medium">Password:</span> {adminCredentials.password}</p>
                                    </div>
                                </div>
                            </div>

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
                                    <div className="w-full border-t border-muted" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                        Email address
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                        </div>
                                        <Input
                                            {...register("email")}
                                            id="email"
                                            type="email"
                                            className="pl-10"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                        Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                                        </div>
                                        <Input
                                            {...register("password")}
                                            id="password"
                                            type="password"
                                            className="pl-10"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Mail className="w-5 h-5 mr-2" />}
                                        Sign in
                                    </Button>
                                </div>
                                <div className="text-sm text-center">
                                    <Link href="/auth/signup" className="font-medium text-primary hover:underline text-center">
                                        Don&apos;t have an account? Sign up
                                    </Link>
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
