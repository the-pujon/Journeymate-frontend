import { baseApi } from "@/redux/api/baseApi";

const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create post
    createPost: builder.mutation({
      query: (data) => ({
        url: "/post/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),

    // Get all posts
    getPosts: builder.query({
      query: (params) => ({
        url: "/post",
        method: "GET",
        params,
      }),
      providesTags: ["Posts"],
    }),

    // Get posts by user ID
    getPostsByUserId: builder.query({
      query: (userId) => ({
        url: `/post/user/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "UserPosts", id: userId },
        "Posts",
      ],
    }),

    // Get post by ID
    getPostById: builder.query({
      query: (id) => ({
        url: `/post/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    // Update post
    updatePost: builder.mutation({
      query: ({ id, data }) => ({
        url: `/post/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Post", id },
        "Posts",
      ],
    }),

    // Delete post
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/post/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Post", id }, "Posts"],
    }),

    // Upvote post
    upvotePost: builder.mutation({
      query: (id) => ({
        url: `/post/${id}/upvote`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Post", id }, "Posts"],
    }),

    // Downvote post
    downvotePost: builder.mutation({
      query: (id) => ({
        url: `/post/${id}/downvote`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Post", id }, "Posts"],
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
} = postApi;
