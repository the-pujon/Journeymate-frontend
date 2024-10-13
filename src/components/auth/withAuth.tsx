/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser,useCurrentToken } from '@/redux/features/auth/authSlice';
import Loading from '@/components/shared/Loading';
import { toast } from 'sonner';
export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>,allowedRoles?: string[]) {
    return function AuthenticatedComponent(props: P) {
        const router = useRouter();
        const currentUser = useAppSelector(selectCurrentUser);
        const token = useAppSelector(useCurrentToken);

        useEffect(() => {
            if (!token) {
                router.push('/auth/signin');
            } else if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role || '')) {
                toast.error('You are not authorized to access this page');
                router.push('/auth/signin');
            }
        },[currentUser,token,router]);

        if (!token) {
            return <Loading />;
        }

        if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role || '')) {
            return <Loading />;
        }

        return <WrappedComponent {...props} />;
    };
}