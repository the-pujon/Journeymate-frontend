/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React,{ useMemo,useState } from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import { useGetUsersQuery } from '@/redux/features/user/userApi';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { Input } from "@/components/ui/input";
import Loading from '@/components/shared/Loading';
import UserCard from '@/components/shared/UserCard';
import { useDebounce } from '@/hooks/useDebounce';

const PeoplePage = () => {
    const [searchTerm,setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm,500);
    const currentUser = useAppSelector(selectCurrentUser);
    const { data: users,isLoading: usersLoading } = useGetUsersQuery({ searchTerm: debouncedSearchTerm });

    // Helper function to check if the current user is following a given user
    const isCurrentUserFollowing = (user: any,currentUser: any): boolean => {
        return user.followers.some(
            (follower: any) => follower.user._id === currentUser._id
        );
    };

    // Filter out the current user and prepare user data
    const usersWithoutCurrentUser = useMemo(() => {
        if (!users?.data || !currentUser) return [];

        return users.data
            .filter((user: any) => user.user._id !== currentUser._id)
            .map((user: any) => ({
                ...user,
                isFollowing: isCurrentUserFollowing(user,currentUser)
            }));
    },[users,currentUser]);


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    if (usersLoading) return <Loading />;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 py-8"
        >
            <motion.h1
                initial={{ y: -20,opacity: 0 }}
                animate={{ y: 0,opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-6"
            >
                People
            </motion.h1>
            <motion.div
                initial={{ y: -10,opacity: 0 }}
                animate={{ y: 0,opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="mb-6"
                />
            </motion.div>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <AnimatePresence>
                    {usersWithoutCurrentUser.map((user: any) => (
                        <motion.div
                            key={user._id}
                            initial={{ opacity: 0,y: 20 }}
                            animate={{ opacity: 1,y: 0 }}
                            exit={{ opacity: 0,y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <UserCard
                                user={user}
                                isFollowing={user.isFollowing} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
            {usersWithoutCurrentUser.length === 0 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-gray-500 mt-6"
                >
                    No users found
                </motion.p>
            )}
        </motion.div>
    );
};

export default PeoplePage;
