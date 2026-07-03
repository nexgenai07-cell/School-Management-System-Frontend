const paymentService = {
  /*
  =====================================================
  CREATE PAYMENT INTENT
  POST /payments/create-intent
  =====================================================
  */

  createPaymentIntent: async ({ fee_id }) => {
    /*
    -----------------------------------------------------
    MOCK RESPONSE
    Replace with API later
    -----------------------------------------------------

    const response = await api.post(
      "/payments/create-intent",
      {
        fee_id,
      }
    );

    return response.data;

    -----------------------------------------------------
    */

    return {
      success: true,

      fee_id,

      payment_intent: "pi_mock_123456789",

      client_secret:
        "pi_mock_secret_123456789",

      amount: 25000,

      currency: "PKR",

      status: "requires_payment_method",
    };
  },
};

export default paymentService;