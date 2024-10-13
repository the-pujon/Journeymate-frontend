'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

import { useGetUserByIdQuery } from '@/redux/features/user/userApi';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import Loading from '@/components/shared/Loading';
import Profile from '@/components/shared/Profile';
import { withAuth } from '@/components/auth/withAuth';

const MyProfile = () => {
    const currentUser = useAppSelector(selectCurrentUser)
    const userId = currentUser?._id

    const { data: userProfile,isLoading,isError } = useGetUserByIdQuery(userId || '');

    if (isLoading) {
        return <Loading />;
    }

    if (isError || !userProfile) {
        return <div>Error loading profile</div>;
    }

    return (
        <Profile userProfile={userProfile} />
    );
};


export default withAuth(MyProfile,['user','admin']);