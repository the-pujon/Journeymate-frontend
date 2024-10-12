/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React,{ useEffect,useMemo } from 'react';
import { useGetPostsQuery } from '@/redux/features/post/postApi';
import { useGetUsersQuery,useFollowUserMutation,useUnfollowUserMutation } from '@/redux/features/user/userApi';
import { useAppSelector,useAppDispatch } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { selectSearchState,clearSearch } from '@/redux/features/search/searchSlice';
import PostCard from '@/components/shared/PostCard';
import { Button } from "@/components/ui/button";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import Loading from '@/components/shared/Loading';
import Link from 'next/link';
//import { TUser, TCurrentUser } from '@/types'; // Assume we have these types defined

const NewsFeed = () => {
  const currentUser = useAppSelector(selectCurrentUser);
  const { searchTerm,category,sortOrder } = useAppSelector(selectSearchState);
  const dispatch = useAppDispatch();

  const { data: posts,isLoading: postsLoading } = useGetPostsQuery({
    searchTerm,
    category,
    sortOrder
  });
  const { data: users,isLoading: usersLoading } = useGetUsersQuery({ searchTerm: '' });
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

  useEffect(() => {
    return () => {
      dispatch(clearSearch());
    };
  },[dispatch]);

  const handleFollowUnfollow = async (userId: string,isFollowing: boolean) => {
    if (currentUser?._id) {
      if (isFollowing) {
        await unfollowUser({ unfollowId: userId });
      } else {
        await followUser({ followingId: userId });
      }
    }
  };


  if (postsLoading || usersLoading) return <Loading />;

  return (
    <div className="flex container mx-auto px-4 py-8">
      {/* Left sidebar - Users list */}
      <div className="w-1/4 pr-4 sticky top-24 self-start overflow-y-auto max-h-[100vh]">
        <h2 className="text-2xl font-bold mb-4">People to Follow</h2>
        <div className="space-y-4">
          {usersWithoutCurrentUser?.slice(0,5)?.map((user: any) => (
            <div key={user._id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>{user?.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.user?.name}</p>
                  <p className="text-sm text-gray-500">{user.user?.email}</p>
                </div>
              </div>
              <Button
                variant={user.isFollowing ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleFollowUnfollow(user?.user?._id,user.isFollowing)}
              >
                {user.isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
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
      </div>

      {/* Main content - Posts */}
      <div className="w-3/4 pl-4">
        {searchTerm && (
          <p className="mb-4">Showing results for: &quot;{searchTerm}&quot;</p>
        )}
        <div className="space-y-6">
          {posts?.data?.map((post: any) => (
            <PostCard key={post._id} post={post} userProfile={post.author} isMyProfile={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
