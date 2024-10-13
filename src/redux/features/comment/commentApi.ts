import { baseApi } from "@/redux/api/baseApi";

const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create comment
    createComment: builder.mutation({
      query: (data) => ({
        url: "/comments/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comments", id: postId },
      ],
    }),

    // Get comments by post ID
    getCommentsByPostId: builder.query({
      query: (postId) => ({
        url: `/comments/post/${postId}`,
        method: "GET",
      }),
      providesTags: (result, error, postId) => [
        { type: "Comments", id: postId },
      ],
    }),

    // Edit comment
    editComment: builder.mutation({
      query: ({ commentId, data }) => ({
        url: `/comments/${commentId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { commentId, postId }) => [
        { type: "Comment", id: commentId },
        { type: "Comments", id: postId },
      ],
    }),

    // Delete comment
    deleteComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { commentId, postId }) => [
        { type: "Comment", id: commentId },
        { type: "Comments", id: postId },
      ],
    }),

    // Vote comment
    voteComment: builder.mutation({
      query: ({ commentId, voteType }) => ({
        url: `/comments/${commentId}/vote`,
        method: "POST",
        body: { voteType },
      }),
      invalidatesTags: (result, error, { commentId, postId }) => [
        { type: "Comment", id: commentId },
        { type: "Comments", id: postId },
      ],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentsByPostIdQuery,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useVoteCommentMutation,
} = commentApi;
