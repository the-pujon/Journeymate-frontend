'use client'

import React,{ useMemo,useState } from 'react';
import { useGetUsersQuery,useFollowUserMutation,useUnfollowUserMutation } from '@/redux/features/user/userApi';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { Button } from "@/components/ui/button";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Loading from '@/components/shared/Loading';
import UserCard from '@/components/shared/UserCard';
import { useDebounce } from '@/hooks/useDebounce';

const PeoplePage = () => {
    const [searchTerm,setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm,500);
    const currentUser = useAppSelector(selectCurrentUser);
    const { data: users,isLoading: usersLoading } = useGetUsersQuery({ searchTerm: debouncedSearchTerm });
    const [followUser] = useFollowUserMutation();
    const [unfollowUser] = useUnfollowUserMutation();

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

    const handleFollowUnfollow = async (userId: string,isFollowing: boolean) => {
        if (currentUser?._id) {
            if (isFollowing) {
                await unfollowUser({ unfollowId: userId });
            } else {
                await followUser({ followingId: userId });
            }
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    if (usersLoading) return <Loading />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">People</h1>
            <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={handleSearch}
                className="mb-6"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {usersWithoutCurrentUser.map((user: any) => (
                    <div key={user._id}>
                        <UserCard user={user} isFollowing={user.isFollowing} />
                    </div>
                ))}
            </div>
            {usersWithoutCurrentUser.length === 0 && (
                <p className="text-center text-gray-500 mt-6">No users found</p>
            )}
        </div>
    );
};

export default PeoplePage;
