'use client'

import React,{ useState } from 'react';
import { useGetPostsQuery } from '@/redux/features/post/postApi';
import { useGetUsersQuery,useFollowUserMutation } from '@/redux/features/user/userApi';
import { useAppSelector } from '@/redux/hook';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import PostCard from '@/components/shared/PostCard';
import { Button } from "@/components/ui/button";
import { Avatar,AvatarFallback,AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select";
import { useDebounce } from '@/hooks/useDebounce';
import Loading from '@/components/shared/Loading';

const NewsFeed = () => {
  const [searchTerm,setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm,300);
  const [category,setCategory] = useState('all');
  const [sortOrder,setSortOrder] = useState('desc');

  const currentUser = useAppSelector(selectCurrentUser);
  const { data: posts,isLoading: postsLoading } = useGetPostsQuery({
    searchTerm: debouncedSearchTerm,
    category,
    sortOrder
  });
  const { data: users,isLoading: usersLoading } = useGetUsersQuery({ searchTerm: '' });
  const [followUser] = useFollowUserMutation();

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
        <div className="mb-6 flex items-center space-x-4">
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              {/* Add more categories as needed */}
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
