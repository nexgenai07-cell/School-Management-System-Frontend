import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import {
  ShieldCheck,
  Lock,
  CreditCard,
} from "lucide-react";

import Button from "../../components/ui/Button/Button";

function CheckoutForm({
  amount,
  onSuccess,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!stripe || !elements)
      return;

    setLoading(true);
    setError("");

    const {
      error,
      paymentIntent,
    } =
      await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (
      paymentIntent?.status ===
      "succeeded"
    ) {
      onSuccess?.(paymentIntent);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Header */}

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
            <CreditCard size={22} />
          </div>

          <div>

            <h3 className="text-lg font-semibold text-slate-800">
              Stripe Secure Checkout
            </h3>

            <p className="text-sm text-slate-500">
              Your payment is encrypted and protected.
            </p>

          </div>

        </div>

      </div>

      {/* Amount */}

      {amount && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">

          <p className="text-sm text-slate-500">
            Amount to Pay
          </p>

          <h2 className="mt-1 text-3xl font-bold text-green-700">
            PKR{" "}
            {Number(amount).toLocaleString()}
          </h2>

        </div>
      )}

      {/* Stripe Card */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <PaymentElement />
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">

          <p className="text-sm font-medium text-red-600">
            {error}
          </p>

        </div>
      )}

      {/* Security */}

      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

        <ShieldCheck
          className="text-green-600"
          size={22}
        />

        <div>

          <p className="font-medium text-slate-700">
            Secure Payment
          </p>

          <p className="text-sm text-slate-500">
            Your card information is never stored on our servers.
          </p>

        </div>

      </div>

      {/* Button */}

      <Button
        type="submit"
        fullWidth
        loading={loading}
        disabled={!stripe || loading}
        leftIcon={<Lock size={18} />}
        className="h-12"
      >
        {loading
          ? "Processing Payment..."
          : "Pay Securely"}
      </Button>

    </form>
  );
}

export default CheckoutForm;