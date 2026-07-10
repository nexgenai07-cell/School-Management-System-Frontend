import api from "./api";


const paymentService = {
  /*
  =====================================================
  CREATE PAYMENT INTENT
  POST /payments/create-intent
  =====================================================
  */
createPaymentIntent: async (paymentData) => {
  console.log("Sending:", paymentData);

  const { data } = await api.post(
    "/finance/stripe/create-payment-intent",
    paymentData
  );

  console.log("Response:", data);

  return data;
},
};

export default paymentService;