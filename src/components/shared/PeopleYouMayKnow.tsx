/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react';
import { useGetUsersQuery } from '@/redux/features/user/userApi';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import UserCard from '@/components/shared/UserCard';
import Loading from '@/components/shared/Loading';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const PeopleYouMayKnow = () => {
    const currentUser = useAppSelector(selectCurrentUser);
    const { data: users,isLoading } = useGetUsersQuery({ searchTerm: '' });

    const usersWithoutCurrentUser = React.useMemo(() => {
        if (!users?.data || !currentUser) return [];

        return users.data
            .filter((user: any) => user.user._id !== currentUser._id)
            .map((user: any) => ({
                ...user,
                isFollowing: user.followers.some(
                    (follower: any) => follower.user._id === currentUser._id
                )
            }));
    },[users,currentUser]);

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {usersWithoutCurrentUser?.slice(0,5)?.map((user: any) => (
                <div key={user._id}>
                    <UserCard user={user} isFollowing={user.isFollowing} />
                </div>
            ))}
            {usersWithoutCurrentUser?.length === 0 && (
                <p className="text-center text-gray-500">No users found</p>
            )}
            {usersWithoutCurrentUser?.length >= 5 && (
                <p className="text-center text-gray-500">Only showing 5 users</p>
            )}
            {usersWithoutCurrentUser?.length > 5 && usersWithoutCurrentUser?.length !== 0 && (
                <Button variant="secondary" className="w-full" asChild>
                    <Link href="/people">
                        <p className="text-center">View all</p>
                    </Link>
                </Button>
            )}
        </div>
    );
};

export default PeopleYouMayKnow;
