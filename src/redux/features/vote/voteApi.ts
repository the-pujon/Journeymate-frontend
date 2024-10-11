import { baseApi } from "@/redux/api/baseApi";

const voteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get vote for a specific post
    getVote: builder.query({
      query: (postId) => ({
        url: `/votes/${postId}`,
        method: "GET",
      }),
      providesTags: (result, error, postId) => [{ type: "Vote", id: postId }],
    }),
  }),
});

export const { useGetVoteQuery } = voteApi;
