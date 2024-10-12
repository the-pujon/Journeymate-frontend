/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React,{ useState,useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useGetPostsQuery } from '@/redux/features/post/postApi';
import { useAppSelector } from '@/redux/hook';
import { selectSearchState } from '@/redux/features/search/searchSlice';
import PostCard from '@/components/shared/PostCard';
import Loading from '@/components/shared/Loading';
import PeopleYouMayKnow from '@/components/shared/PeopleYouMayKnow';

const NewsFeed = () => {
  const { searchTerm,category,sortOrder } = useAppSelector(selectSearchState);
  const [displayedPosts,setDisplayedPosts] = useState<any[]>([]);
  const [hasMore,setHasMore] = useState(true);

  const { data: posts,isLoading: postsLoading } = useGetPostsQuery({
    searchTerm,
    category,
    sortOrder
  });

  useEffect(() => {
    if (posts?.data) {
      setDisplayedPosts(posts.data.slice(0,5));
      setHasMore(posts.data.length > 5);
    }
  },[posts]);

  const fetchMoreData = () => {
    if (displayedPosts.length >= (posts?.data?.length || 0)) {
      setHasMore(false);
      return;
    }
    const newPosts = posts?.data.slice(0,displayedPosts.length + 10) || [];
    setDisplayedPosts(newPosts);
  };

  if (postsLoading) return <Loading />;

  return (
    <div className="flex flex-col md:flex-row container mx-auto px-4 py-8">
      {/* Left sidebar - Users list */}
      <div className="w-full md:w-2/5 xl:w-1/3 md:pr-4 mb-8 md:mb-0 hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-6rem)]">
          <h2 className="text-2xl font-bold mb-4">People you may know</h2>
          <PeopleYouMayKnow />
        </div>
      </div>

      {/* Main content - Posts */}
      <div className="w-full md:w-3/4 md:pl-4 mx-auto">
        {searchTerm && (
          <p className="mb-4">Showing results for: &quot;{searchTerm}&quot;</p>
        )}
        <InfiniteScroll
          dataLength={displayedPosts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Loading />}
          endMessage={
            <p className="text-center mt-4">
              <b>End of posts</b>
            </p>
          }
        >
          <div className="space-y-6">
            {displayedPosts.map((post: any) => (
              <PostCard key={post._id} post={post} userProfile={post.author} isMyProfile={false} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default NewsFeed;
