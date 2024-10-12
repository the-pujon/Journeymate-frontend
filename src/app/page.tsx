'use client'

import React,{ useEffect } from 'react';
import { useGetPostsQuery } from '@/redux/features/post/postApi';
import { useGetUsersQuery,useFollowUserMutation } from '@/redux/features/user/userApi';
import { useAppSelector,useAppDispatch } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { selectSearchState,clearSearch } from '@/redux/features/search/searchSlice';
import PostCard from '@/components/shared/PostCard';
import { Button } from "@/components/ui/button";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import Loading from '@/components/shared/Loading';

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

  useEffect(() => {
    return () => {
      dispatch(clearSearch());
    };
  },[dispatch]);

  const handleFollowUser = async (followId: string) => {
    if (currentUser?._id) {
      await followUser({ userId: currentUser._id,followId });
    }
  };

  if (postsLoading || usersLoading) return <Loading />;

  return (
    <div className="flex container mx-auto px-4 py-8">
      {/* Left sidebar - Users list */}
      <div className="w-1/4 pr-4 sticky top-24 self-start overflow-y-auto max-h-[100vh]">
        <h2 className="text-2xl font-bold mb-4">People to Follow</h2>
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
          {users?.data?.map((user: any) => (
            <div key={user._id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>{user.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.user?.name}</p>
                  <p className="text-sm text-gray-500">{user.user?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFollowUser(user._id)}
              >
                Follow
              </Button>
            </div>
          ))}
        </div>

      </div>

      {/* Main content - Posts */}
      <div className="w-3/4 pl-4">
        {searchTerm && (
          <p className="mb-4">Showing results for: &quot;{searchTerm}&quot;</p>
        )}
        <div className="space-y-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
          {posts?.data?.map((post: any) => (
            <PostCard key={post._id} post={post} userProfile={post.author} isMyProfile={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
