import { baseApi } from "@/redux/api/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payments/create-payment",
        method: "POST",
        body: paymentData,
      }),
    }),
    getPayments: builder.query({
      query: () => ({
        url: "/payments",
        method: "GET",
      }),
    }),
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `/payments/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetPaymentsQuery,
  useDeletePaymentMutation,
} = paymentApi;

export default paymentApi;
