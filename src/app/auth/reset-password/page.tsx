import ResetPassword from '@/components/auth/ResetPassword';
import Loading from '@/components/shared/Loading';
import React,{ Suspense } from 'react';

const ResetPasswordPage = () => {
    return (
        <Suspense fallback={<Loading />}>
            <ResetPassword />
        </Suspense>
    );
};

export default ResetPasswordPage;