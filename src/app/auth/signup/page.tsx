'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSignupMutation } from '@/redux/features/auth/authApi';
import { toast } from 'sonner';
import { Github,Loader2,Mail,User,Lock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card,CardContent,CardHeader,CardTitle,CardDescription } from "@/components/ui/card";
import Google from '@/assets/icons/Google';
import signupImage from '@/assets/images/signup3.avif';

const signUpSchema = z.object({
    name: z.string().min(2,'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6,'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword,{
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp: React.FC = () => {
    const [signup,{ isLoading,error }] = useSignupMutation();
    const router = useRouter();

    console.log(process.env.NEXT_PUBLIC_SERVER_URL)

    console.log(error)

    const { register,handleSubmit,formState: { errors } } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormValues) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword,...signupData } = data;
            await signup(signupData).unwrap();

            toast.success('Sign up successful!');
            router.push('/auth/login');
        } catch (error) {
            console.error(error)
            toast.error('Sign up failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-screen-xl flex flex-col sm:flex-row overflow-hidden">
                <div className="flex-1 hidden sm:block relative h-64 sm:h-auto">
                    <Image
                        //src="https://images.unsplash.com/photo-1502920514313-52581002a659?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        src={signupImage}
                        alt="Sign up background"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className="w-full sm:w-1/2 lg:w-2/5 p-0 sm:p-8">
                    <CardHeader className="text-center">
                        <div className="mb-4">
                            <h1 className="text-3xl sm:text-4xl font-extrabold">JourneyMate</h1>
                        </div>
                        <CardTitle className="text-xl sm:text-2xl font-semibold">Create your account</CardTitle>
                        <CardDescription>
                            Or{' '}
                            <Link href="/auth/login" className="font-medium text-primary hover:underline">
                                sign in to your account
                            </Link>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {/* Handle GitHub signup */ }}
                            >
                                <Github className="w-5 h-5 mr-2" />
                                Sign up with GitHub
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {/* Handle GitHub signup */ }}
                            >
                                <Google />
                                <span className="ml-2">Sign up with Google</span>
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
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Name
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <Input
                                            {...register("name")}
                                            id="name"
                                            type="text"
                                            className="pl-10"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                                </div>

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

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
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
                                        {isLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" /> : <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                                        Sign up
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </div>
    );
};

export default SignUp;