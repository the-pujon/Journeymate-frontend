import { baseApi } from "@/redux/api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query({
      query: ({ searchTerm = "" }) => {
        return {
          url: `/users?searchQuery=${searchTerm}`,
          method: "GET",
        };
      },
      providesTags: ["Users"],
    }),

    // Get user by ID
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),

    // Update user profile
    updateUserProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        "Users",
        "Posts",
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
        { type: "Users", id: userId },
        { type: "Users", id: followId },
        "Users",
        "Posts",
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
        { type: "Users", id: userId },
        { type: "Users", id: unfollowId },
        "Users",
        "Posts",
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
        { type: "Users", id: userId },
        "Users",
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
