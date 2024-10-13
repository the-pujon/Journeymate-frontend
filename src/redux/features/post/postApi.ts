/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create post
    createPost: builder.mutation({
      query: (data) => ({
        url: "/posts/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts", "Users"],
    }),

    // Get all posts
    getPosts: builder.query({
      query: ({ searchTerm, category, sortOrder, page, limit }) => ({
        url: "/posts",
        params: {
          searchTerm,
          category: category === "all" ? undefined : category,
          sortOrder,
          page,
          limit,
        },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        return {
          searchTerm: queryArgs.searchTerm,
          category: queryArgs.category,
          sortOrder: queryArgs.sortOrder,
        };
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg?.page === 1) {
          // If it's the first page, replace the entire cache
          return newItems;
        } else {
          // For subsequent pages, append new items
          return {
            ...newItems,
            data: {
              ...newItems.data,
              posts: [
                ...(currentCache.data?.posts || []),
                ...(newItems.data?.posts || []),
              ],
            },
          };
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.searchTerm !== previousArg?.searchTerm ||
          currentArg?.category !== previousArg?.category ||
          currentArg?.sortOrder !== previousArg?.sortOrder
        );
      },
      providesTags: ["Posts"],
    }),

    // Get posts by user ID
    getPostsByUserId: builder.query({
      query: (userId) => ({
        url: `/posts/user/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "Posts", id: userId },
        "Users",
      ],
    }),

    // Get post by ID
    getPostById: builder.query({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "Posts", id },
        { type: "Post", id },
        "Comments",
      ],
    }),

    // Update post
    updatePost: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/posts/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Posts", id },
        "Posts",
        "Users",
      ],
    }),

    // Delete post
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Posts", id },
        "Posts",
        "Users",
      ],
    }),

    // Upvote post
    upvotePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}/upvote`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Posts", id },
        "Posts",
        "Users",
        "Vote",
      ],
    }),

    // Downvote post
    downvotePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}/downvote`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Posts", id },
        "Posts",
        "Users",
        "Vote",
      ],
    }),

    getAllPosts: builder.query({
      query: () => ({
        url: "/posts/allPosts/all",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useUpvotePostMutation,
  useDownvotePostMutation,
  useGetAllPostsQuery,
} = postApi;
