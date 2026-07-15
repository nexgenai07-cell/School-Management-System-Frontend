// src/modules/parent/components/fees/PaymentSummary.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  Receipt,
  CheckCircle,
  AlertTriangle,
  Clock3,
} from "lucide-react";

import Card from "../../../../components/ui/Card/Card";

const SummaryItem = ({
  icon: Icon,
  label,
  value,
  color,
}) => (
  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">

    <div className="flex items-center gap-3">

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
      >
        <Icon size={18} />
      </div>

      <span className="font-medium text-text-primary">
        {label}
      </span>

    </div>

    <span className="text-xl font-bold text-text-primary">
      {value}
    </span>

  </div>
);

const PaymentSummary = () => {
  const {
    fees = [],
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
  Child Fees
  =====================================================
  */

  const childFees = useMemo(() => {
    if (!currentChild) return [];

    return fees.filter(
      (fee) =>
        fee.student_name ===
        currentChild.student_name
    );
  }, [fees, currentChild]);

  /*
  =====================================================
  Summary
  =====================================================
  */

  const summary = useMemo(() => {
    return {
      invoices: childFees.length,

      paid: childFees.filter(
        (fee) => fee.status === "Paid"
      ).length,

      pending: childFees.filter(
        (fee) =>
          fee.status === "Pending"
      ).length,

      overdue: childFees.filter(
        (fee) =>
          fee.status === "Overdue"
      ).length,
    };
  }, [childFees]);

  return (
    <Card
      hover={false}
      className="h-full"
    >
      <div className="mb-6">

        <h2 className="text-xl font-semibold text-text-primary">
          Payment Summary
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Overview of fee invoices.
        </p>

      </div>

      <div className="space-y-4">

        <SummaryItem
          icon={Receipt}
          label="Invoices"
          value={summary.invoices}
          color="bg-blue-100 text-blue-600"
        />

        <SummaryItem
          icon={CheckCircle}
          label="Paid"
          value={summary.paid}
          color="bg-green-100 text-green-600"
        />

        <SummaryItem
          icon={Clock3}
          label="Pending"
          value={summary.pending}
          color="bg-yellow-100 text-yellow-600"
        />

        <SummaryItem
          icon={AlertTriangle}
          label="Overdue"
          value={summary.overdue}
          color="bg-red-100 text-red-600"
        />

      </div>

    </Card>
  );
};

export default PaymentSummary;