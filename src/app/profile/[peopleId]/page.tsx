"use client"

import Loading from '@/components/shared/Loading';
import Profile from '@/components/shared/Profile';
import { useGetUserByIdQuery } from '@/redux/features/user/userApi';
import React from 'react';

const PeopleDetailsPage = ({ params }: { params: { peopleId: string } }) => {
    const { peopleId } = params;
    const { data: userProfile,isLoading,isError } = useGetUserByIdQuery(peopleId || '');

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

export default PeopleDetailsPage;