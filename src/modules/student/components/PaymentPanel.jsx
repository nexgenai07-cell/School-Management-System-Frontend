import {
  CreditCard,
  Wallet,
  CalendarDays,
  BadgeDollarSign,
} from "lucide-react";

import Card from "../../../components/ui/card/Card";
import Button from "../../../components/ui/Button/Button";

function PaymentPanel({
  selectedFee,
  loading = false,
  onPay,
}) {
  if (!selectedFee) {
    return (
      <Card className="flex h-full items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-student-light">
            <Wallet
              size={34}
              className="text-student-primary"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-student-text">
              No Fee Selected
            </h3>

            <p className="mt-2 text-sm text-text-secondary">
              Select an unpaid fee from the
              table to continue with payment.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const remaining =
    Number(selectedFee.amount) -
    Number(selectedFee.amount_paid);

  const isPaid =
    selectedFee.status === "Paid";

  return (
    <Card className="sticky top-6 overflow-hidden">
      {/* Header */}

      <div className="border-b border-student-border bg-student-light p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-student-primary text-white">
            <CreditCard size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-student-text">
              Secure Payment
            </h2>

            <p className="text-sm text-text-secondary">
              Powered by Stripe
            </p>
          </div>
        </div>
      </div>

      {/* Content */}

      <div className="space-y-5 p-6">
        {/* Month */}

        <div className="flex items-center justify-between rounded-xl bg-student-light p-4">
          <div className="flex items-center gap-3">
            <CalendarDays
              size={20}
              className="text-student-primary"
            />

            <span className="font-medium">
              Fee Month
            </span>
          </div>

          <span className="font-semibold text-student-text">
            {new Date(
              selectedFee.month
            ).toLocaleDateString(
              "en-US",
              {
                month: "long",
                year: "numeric",
              }
            )}
          </span>
        </div>

        {/* Payable */}

        <div className="flex items-center justify-between rounded-xl bg-student-light p-4">
          <div className="flex items-center gap-3">
            <BadgeDollarSign
              size={20}
              className="text-student-primary"
            />

            <span className="font-medium">
              Payable Fee
            </span>
          </div>

          <span className="font-bold text-student-text">
            Rs.
            {Number(
              selectedFee.amount
            ).toLocaleString()}
          </span>
        </div>

        {/* Paid */}

        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4">
          <span className="font-medium">
            Paid
          </span>

          <span className="font-semibold text-green-700">
            Rs.
            {Number(
              selectedFee.amount_paid
            ).toLocaleString()}
          </span>
        </div>

        {/* Remaining */}

        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4">
          <span className="font-medium">
            Remaining
          </span>

          <span className="font-bold text-red-600">
            Rs.
            {remaining.toLocaleString()}
          </span>
        </div>

        {/* Due Date */}

        <div className="rounded-xl border border-student-border p-4">
          <p className="text-sm text-text-secondary">
            Due Date
          </p>

          <p className="mt-1 font-semibold text-student-text">
            {new Date(
              selectedFee.due_date
            ).toLocaleDateString()}
          </p>
        </div>

        {/* Payment Gateway */}

        <div className="rounded-xl border border-student-border p-4">
          <p className="mb-3 text-sm font-medium text-text-secondary">
            Payment Gateway
          </p>

          <div className="flex items-center justify-between rounded-xl border border-student-primary bg-student-light px-4 py-3">
            <div className="flex items-center gap-3">
              <CreditCard
                size={20}
                className="text-student-primary"
              />

              <span className="font-semibold text-student-text">
                Stripe
              </span>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Secure
            </span>
          </div>
        </div>

        {/* Button */}

        <Button
          fullWidth
          tone="student"
          loading={loading}
          disabled={
            isPaid ||
            remaining <= 0
          }
          leftIcon={
            <CreditCard size={18} />
          }
          onClick={() =>
            onPay?.(
              selectedFee.id
            )
          }
        >
          {isPaid
            ? "Already Paid"
            : `Pay Rs. ${remaining.toLocaleString()}`}
        </Button>

        {/* Note */}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs leading-6 text-blue-700">
            Your payment will be
            processed securely through
            Stripe. After successful
            payment your fee status will
            automatically update.
          </p>
        </div>
      </div>
    </Card>
  );
}

export default PaymentPanel;