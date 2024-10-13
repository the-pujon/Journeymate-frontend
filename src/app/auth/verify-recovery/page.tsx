'use client';

import React,{ Suspense,useEffect,useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter,useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useVerifyRecoveryCodeMutation } from '@/redux/features/auth/authApi';
import { toast } from 'sonner';
import { Loader2,Key } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card,CardContent,CardHeader,CardTitle,CardDescription } from "@/components/ui/card";
import verifyImage from '@/assets/images/signup3.avif';
import { motion } from 'framer-motion';

const verifyRecoverySchema = z.object({
    email: z.string().email('Invalid email address'),
    code: z.string().min(6,'Recovery code must be at least 6 characters'),
});

type VerifyRecoveryFormValues = z.infer<typeof verifyRecoverySchema>;

function VerifyRecovery() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyRecoveryContent />
        </Suspense>
    )
}

const VerifyRecoveryContent: React.FC = () => {
    const searchParams = useSearchParams();
    const [verifyRecoveryCode,{ isLoading }] = useVerifyRecoveryCodeMutation();
    const router = useRouter();
    const [emailChecked,setEmailChecked] = useState(false);

    const { register,handleSubmit,formState: { errors },setValue } = useForm<VerifyRecoveryFormValues>({
        resolver: zodResolver(verifyRecoverySchema),
    });

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            const decodedEmail = decodeURIComponent(emailParam);

            setValue('email',decodedEmail);
            setEmailChecked(true);
        } else {
            console.log('No email found in URL, redirecting...');
            router.push('/auth/request-recovery');
        }
    },[searchParams,router,setValue,emailChecked]);

    const onSubmit = async (data: VerifyRecoveryFormValues) => {
        try {
            await verifyRecoveryCode(data).unwrap();
            toast.success('Recovery code verified successfully.');
            // Encode both email and code and add them to the URL
            const encodedEmail = encodeURIComponent(data.email);
            const encodedCode = encodeURIComponent(data.code);
            router.push(`/auth/reset-password?email=${encodedEmail}&code=${encodedCode}`);
        } catch (error) {
            console.error('Verification error:',error);
            toast.error('Failed to verify recovery code. Please try again.');
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
                        src={verifyImage}
                        alt="Verify recovery code background"
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
                            <CardTitle className="text-xl sm:text-2xl font-semibold">Verify Recovery Code</CardTitle>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <CardDescription>
                                Enter the recovery code sent to your email
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
                                <div>
                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                        Recovery Code
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Key className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <Input
                                            {...register("code")}
                                            id="code"
                                            type="text"
                                            className="pl-10"
                                            placeholder="Enter recovery code"
                                        />
                                    </div>
                                    {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>}
                                </div>

                                <div>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" /> : <Key className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                                        Verify Code
                                    </Button>
                                </div>
                            </form>

                            <div className="text-center">
                                <Link href="/auth/request-recovery" className="font-medium text-primary hover:underline">
                                    Didn&apos;t receive a code? Request again
                                </Link>
                            </div>
                        </motion.div>
                    </CardContent>
                </motion.div>
            </Card>
        </motion.div>
    );
};

export default VerifyRecovery;