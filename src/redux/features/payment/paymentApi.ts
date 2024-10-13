import { baseApi } from "@/redux/api/baseApi";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payment/create-payment",
        method: "POST",
        body: paymentData,
      }),
    }),
    getPayments: builder.query({
      query: () => ({
        url: "/payment",
        method: "GET",
      }),
    }),
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `/payment/${id}`,
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
