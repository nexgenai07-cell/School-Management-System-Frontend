// src/modules/parent/components/fees/PaymentHistory.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  Receipt,
  ArrowRight,
} from "lucide-react";

import Card from "../../../../components/ui/Card/Card";
import Button from "../../../../components/ui/Button/Button";
import Badge from "../../../../components/ui/Badge/Badge";

const PaymentHistory = () => {
  const {
    payments = [],
    parentLinks = [],
    selectedChild,
  } = useSelector(
    (state) => state.parent
  );

  /*
  =====================================================
  Current Child
  =====================================================
  */

  const currentChild = useMemo(() => {
    return (
      parentLinks.find(
        (child) =>
          child.student === selectedChild
      ) || parentLinks[0]
    );
  }, [parentLinks, selectedChild]);

  /*
  =====================================================
  Child Payments
  =====================================================
  */

  const childPayments = useMemo(() => {
    if (!currentChild) return [];

    return payments
      .filter(
        (payment) =>
          payment.student_name ===
          currentChild.student_name
      )
      .sort(
        (a, b) =>
          new Date(b.payment_date) -
          new Date(a.payment_date)
      )
      .slice(0, 5);
  }, [payments, currentChild]);

  /*
  =====================================================
  Badge Variant
  =====================================================
  */

  const getVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success";

      case "Pending":
        return "warning";

      case "Failed":
        return "danger";

      default:
        return "neutral";
    }
  };

  const formatCurrency = (amount) =>
    `PKR ${Number(amount).toLocaleString()}`;

  return (
    <Card hover={false}>
      {/* Header */}

      <div className="mb-6 flex items-center justify-between z-0">

        <div>

          <h2 className="text-xl font-semibold text-text-primary">
            Payment History
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Recent fee payments.
          </p>

        </div>

        <Button
          variant="ghost"
          tone="parent"
          size="sm"
          rightIcon={<ArrowRight size={16} />}
        >
          View All
        </Button>

      </div>

      {/* Empty */}

      {childPayments.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center">

          <Receipt
            size={40}
            className="text-slate-400"
          />

          <p className="mt-4 font-medium">
            No Payments Found
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            Payment history will appear here.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {childPayments.map(
            (payment) => (
              <div
                key={payment.id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between"
              >

                <div>

                  <h4 className="font-semibold text-text-primary">
                    {formatCurrency(
                      payment.amount
                    )}
                  </h4>

                  <p className="mt-1 text-sm text-text-secondary">
                    {new Date(
                      payment.payment_date
                    ).toLocaleDateString()}
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    {payment.payment_method}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Transaction ID:
                    {" "}
                    {
                      payment.transaction_id
                    }
                  </p>

                </div>

                <Badge
                  variant={getVariant(
                    payment.status
                  )}
                >
                  {payment.status}
                </Badge>

              </div>
            )
          )}

        </div>
      )}
    </Card>
  );
};

export default PaymentHistory;