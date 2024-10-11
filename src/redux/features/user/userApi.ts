import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Update user profile
    updateUserProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "User", id },
        "Users",
      ],
    }),

    // Follow user
    followUser: builder.mutation({
      query: (data) => ({
        url: "/users/follow",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { userId, followId }) => [
        { type: "User", id: userId },
        { type: "User", id: followId },
        "Users",
      ],
    }),

    // Unfollow user
    unfollowUser: builder.mutation({
      query: (data) => ({
        url: "/users/unfollow",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { userId, unfollowId }) => [
        { type: "User", id: userId },
        { type: "User", id: unfollowId },
        "Users",
      ],
    }),

    // Request verification
    requestVerification: builder.mutation({
      query: (data) => ({
        url: "/users/request-verification",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserProfileMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useRequestVerificationMutation,
} = userApi;
