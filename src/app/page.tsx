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
import { withAuth } from '@/components/auth/withAuth';

const NewsFeed = () => {
  const { searchTerm,category,sortOrder } = useAppSelector(selectSearchState);
  const [page,setPage] = useState(1);


  const { data: postsData,isLoading: postsLoading,isFetching,error } = useGetPostsQuery({
    searchTerm,
    category,
    sortOrder: sortOrder || undefined,
    page,
    limit: 10,
  });



  useEffect(() => {
    setPage(1);
  },[searchTerm,category,sortOrder]);

  useEffect(() => {
  },[postsData,postsLoading,isFetching,error]);

  const fetchMoreData = () => {
    if (!isFetching && postsData?.data?.hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (postsLoading && page === 1) return <Loading />;

  if (error) {
    console.error("Error fetching posts:",error);
    return <div>Error: {JSON.stringify(error)}</div>;
  }

  const posts = postsData?.data?.posts || [];
  const hasMore = postsData?.data?.hasMore || false;



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
        {posts.length === 0 && !postsLoading && (
          <p>No posts found.</p>
        )}
        {posts.length > 0 && (
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<Loading />}
            endMessage={
              <p className="text-center mt-4">
                <b>End of posts</b>
              </p>
            }
            key={`${searchTerm}-${category}-${sortOrder}`}
          >
            <div className="space-y-6">
              {posts.map((post: any,index: number) => (
                <PostCard key={post._id || index} post={post} userProfile={post.author} isMyProfile={false} />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default withAuth(NewsFeed,['user','admin']);
