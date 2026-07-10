import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CreditCard,
  Wallet,
} from "lucide-react";

import Card from "../../../components/ui/card/Card";

import FeeSummaryCards from "../components/FeeSummaryCards";
import FeeScheduleTable from "../components/FeeScheduleTable";
import PaymentPanel from "../components/PaymentPanel";
import PaymentHistory from "../components/PaymentHistory";
import FeeDetailsModal from "../components/FeeDetailsModal";
import StripePaymentModal from "../../../modules/stripe/StripePaymentModal";

import {
  fetchFees,
  fetchPayments,
  createPaymentIntent,
} from "../../../store/studentThunks";

import {
  setSelectedFee,
} from "../../../store/studentSlice";

function FeesPayments() {
  const dispatch = useDispatch();

  const {
    fees,
    payments,
    selectedFee,
    loading,
    submitting,
  } = useSelector(
    (state) => state.student
  );

  const [
    detailsOpen,
    setDetailsOpen,
  ] = useState(false);
const [clientSecret, setClientSecret] =
  useState("");

const [showStripe, setShowStripe] =
  useState(false);
  /*
  =====================================
  Initial Load
  =====================================
  */

  useEffect(() => {
    dispatch(fetchFees());
    dispatch(fetchPayments());
  }, [dispatch]);

  /*
  =====================================
  View Fee
  =====================================
  */

  const handleViewFee = (
    fee
  ) => {
    dispatch(
      setSelectedFee(fee)
    );

    setDetailsOpen(true);
  };

  /*
  =====================================
  Select Fee To Pay
  =====================================
  */

  const handleSelectFee = (
    fee
  ) => {
    dispatch(
      setSelectedFee(fee)
    );
  };

  /*
  =====================================
  Stripe Payment
  =====================================
  */
const handlePayment = async () => {
  try {
    const response = await dispatch(
      createPaymentIntent({
        fee_id: selectedFee.id,
      })
    ).unwrap();

    console.log("Payment Intent:", response);

    if (!response.client_secret) {
      throw new Error(
        "No client_secret returned from backend."
      );
    }

    setClientSecret(response.client_secret);
    setShowStripe(true);

  } catch (error) {
    console.error(error);

    alert(
      error?.response?.data?.detail ||
      error?.message ||
      "Unable to initialize payment."
    );
  }
};
  /*
  =====================================
  Loading
  =====================================
  */

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
    <div className="space-y-8">

      {/* =====================================
      Header
      ===================================== */}

      <Card className="overflow-hidden">

        <div className="flex flex-col gap-6 bg-gradient-to-r from-student-primary to-student-hover p-8 text-white lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Fees &
              Payments
            </h1>

            <p className="mt-2 text-white/90">
              View your
              tuition fee
              schedule,
              payment
              history and
              securely pay
              outstanding
              fees using
              Stripe.
            </p>

          </div>

          <div className="flex gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">

              <Wallet
                size={34}
              />

            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">

              <CreditCard
                size={34}
              />

            </div>

          </div>

        </div>

      </Card>

      {/* =====================================
      Summary
      ===================================== */}

      <FeeSummaryCards
        fees={fees}
      />

      {/* =====================================
      Table + Payment
      ===================================== */}

      <div className="grid gap-8 xl:grid-cols-3">

        <div className="xl:col-span-2">

          <FeeScheduleTable
            fees={fees}
            onView={
              handleViewFee
            }
            onPay={
              handleSelectFee
            }
          />

        </div>

        <div>

          <PaymentPanel
            selectedFee={
              selectedFee
            }
            loading={
              submitting
            }
            onPay={
              handlePayment
            }
          />

        </div>

      </div>

      {/* =====================================
      Payment History
      ===================================== */}

      <PaymentHistory
        payments={
          payments
        }
        fees={fees}
      />

      {/* =====================================
      Fee Details
      ===================================== */}

      <FeeDetailsModal
        open={
          detailsOpen
        }
        fee={
          selectedFee
        }
        onClose={() =>
          setDetailsOpen(
            false
          )
        }
      />

    </div>
    <StripePaymentModal
  open={showStripe}
  clientSecret={clientSecret}
  onClose={() => {
    setShowStripe(false);
    setClientSecret("");
  }}
  onSuccess={() => {
    setShowStripe(false);
    setClientSecret("");

    dispatch(fetchFees());
    dispatch(fetchPayments());

    alert("Payment Successful");
  }}
/>
</>
  );
}

export default FeesPayments;