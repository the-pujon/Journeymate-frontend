import { baseApi } from "@/redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //for signup
    signup: builder.mutation({
      query: (data) => {
        return {
          url: "/auth/signup",
          method: "POST",
          body: data,
        };
      },
    }),

    //for signin
    signin: builder.mutation({
      query: (data) => {
        return {
          url: "/auth/login",
          method: "POST",
          body: data,
        };
      },
    }),

    // for request password recovery
    requestPasswordRecovery: builder.mutation({
      query: (data) => ({
        url: "/auth/request-password-recovery",
        method: "POST",
        body: data,
      }),
    }),

    // for verify recovery code
    verifyRecoveryCode: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-recovery-code",
        method: "POST",
        body: data,
      }),
    }),

    // for reset password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // for change password
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useRequestPasswordRecoveryMutation,
  useVerifyRecoveryCodeMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
