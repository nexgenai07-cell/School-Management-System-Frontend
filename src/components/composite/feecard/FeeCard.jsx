import Card from "../../ui/Card/Card";
import {
  CalendarDays,
  Wallet,
  CircleDollarSign,
  CheckCircle2,
} from "lucide-react";

/*
======================================================
Reusable Fee Card Component

Purpose:
- Displays student fee information in a card format.
- Shows fee amount, payment status, due date,
  paid amount, and remaining balance.
- Provides a "Pay Now" button for unpaid fees.
- Displays a success message for completed payments.

Props:
- month          : Fee month or billing period
- originalAmount : Original fee before discounts
- amount         : Final payable amount
- amountPaid     : Amount already paid
- dueDate        : Payment due date
- paidDate       : Date payment was completed
- status         : Paid | Partial | Unpaid
- onPay          : Function executed when user clicks Pay Now
- bgColor        : Custom background classes
- className      : Additional custom classes

Examples:

1. Unpaid Fee
------------------------------------------------------
<FeeCard
  month="June 2026"
  originalAmount={5000}
  amount={4500}
  amountPaid={0}
  dueDate="30 June 2026"
  status="Unpaid"
  onPay={handlePayment}
/>

------------------------------------------------------

2. Partial Payment
------------------------------------------------------
<FeeCard
  month="May 2026"
  originalAmount={5000}
  amount={5000}
  amountPaid={3000}
  dueDate="31 May 2026"
  status="Partial"
  onPay={handlePayment}
/>

------------------------------------------------------

3. Paid Fee
------------------------------------------------------
<FeeCard
  month="April 2026"
  originalAmount={5000}
  amount={5000}
  amountPaid={5000}
  dueDate="30 April 2026"
  paidDate="25 April 2026"
  status="Paid"
/>

Features:
- Payment status badges
- Remaining amount calculation
- Due date and paid date display
- Payment action button
- Responsive card design
======================================================
*/

function FeeCard({
  month,
  originalAmount,
  amount,
  amountPaid = 0,
  dueDate,
  paidDate,
  status = "Unpaid",
  onPay,
  bgColor,
  className = "",
}) {
  /*
  ======================================================
  Calculate remaining balance
  ======================================================
  */
  const remaining =
    amount - amountPaid;

  /*
  ======================================================
  Status badge styles
  ======================================================
  */
  const statusStyles = {
    Paid:
      "bg-success-bg text-success-text",
    Partial:
      "bg-warning-bg text-warning-text",
    Unpaid:
      "bg-danger-bg text-danger-text",
  };

  return (
    <Card
      hover
      bgColor={bgColor}
      className={`
        bg-gradient-to-br
        from-white
        via-slate-50
        to-blue-50
        ${className}
      `}
    >
      {/* ==================================================
          Card Header
          Displays month, fee amount,
          and payment status
      ================================================== */}
      <div className="flex items-start justify-between">
        <div>
          {/* Fee Month */}
          <p className="text-sm text-text-secondary">
            {month}
          </p>

          {/* Final Payable Amount */}
          <h3 className="mt-2 text-3xl font-bold text-text-primary">
            Rs. {amount}
          </h3>
        </div>

        {/* Payment Status Badge */}
        <div
          className={`
            rounded-full
            px-4
            py-2
            text-sm
            font-medium
            ${statusStyles[status]}
          `}
        >
          {status}
        </div>
      </div>

      {/* ==================================================
          Fee Details Section
      ================================================== */}
      <div className="mt-6 space-y-4">
        {/* Original Fee */}
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">
            Original Fee
          </span>

          <span className="font-semibold">
            Rs. {originalAmount}
          </span>
        </div>

        {/* Amount Paid */}
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">
            Paid
          </span>

          <span className="font-semibold text-success">
            Rs. {amountPaid}
          </span>
        </div>

        {/* Remaining Balance */}
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">
            Remaining
          </span>

          <span className="font-semibold text-danger">
            Rs. {remaining}
          </span>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-3 text-text-secondary">
          <CalendarDays size={18} />

          <span>
            Due: {dueDate}
          </span>
        </div>

        {/* Payment Date */}
        {paidDate && (
          <div className="flex items-center gap-3 text-text-secondary">
            <CheckCircle2 size={18} />

            <span>
              Paid: {paidDate}
            </span>
          </div>
        )}
      </div>

      {/* ==================================================
          Payment Action
          Shown only if there is remaining balance
      ================================================== */}
      {remaining > 0 && (
        <button
          onClick={onPay}
          className="
            mt-6
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-button
            bg-gradient-to-r
            from-brand-primary
            to-parent-primary
            px-4
            py-3
            font-medium
            text-white
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-lg
          "
        >
          <Wallet size={18} />
          Pay Now
        </button>
      )}

      {/* ==================================================
          Payment Completed State
      ================================================== */}
      {status === "Paid" && (
        <div
          className="
            mt-6
            flex
            items-center
            justify-center
            gap-2
            rounded-button
            bg-success-bg
            px-4
            py-3
            font-medium
            text-success-text
          "
        >
          <CircleDollarSign
            size={18}
          />
          Payment Completed
        </div>
      )}
    </Card>
  );
}

export default FeeCard;