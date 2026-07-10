// src/modules/parent/components/fees/FeeOverview.jsx

import { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  Wallet,
  CircleDollarSign,
  AlertTriangle,
  Receipt,
} from "lucide-react";

import StatCard from "../../../../components/composite/StatCard/StatCard";

const FeeOverview = () => {
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
  Selected Child Fees
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
  Fee Statistics
  =====================================================
  */

  const stats = useMemo(() => {
    const totalFee = childFees.reduce(
      (sum, fee) =>
        sum +
        Number(fee.original_amount),
      0
    );

    const payableFee =
      childFees.reduce(
        (sum, fee) =>
          sum +
          Number(fee.amount),
        0
      );

    const paidAmount =
      childFees.reduce(
        (sum, fee) =>
          sum +
          Number(
            fee.amount_paid || 0
          ),
        0
      );

    const remaining =
      payableFee - paidAmount;

    return {
      totalFee,
      paidAmount,
      remaining,
      invoices:
        childFees.length,
    };
  }, [childFees]);

  /*
  =====================================================
  Currency
  =====================================================
  */

  const formatCurrency = (
    amount
  ) =>
    `PKR ${amount.toLocaleString()}`;

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      <StatCard
        label="Total Fee"
        value={formatCurrency(
          stats.totalFee
        )}
        icon={<Wallet size={22} />}
        tone="parent"
        footerText="Academic Year"
        footerColor="primary"
      />

      <StatCard
        label="Total Paid"
        value={formatCurrency(
          stats.paidAmount
        )}
        icon={
          <CircleDollarSign
            size={22}
          />
        }
        tone="parent"
        footerText="Amount Paid"
        footerColor="success"
      />

      <StatCard
        label="Remaining Due"
        value={formatCurrency(
          stats.remaining
        )}
        icon={
          <AlertTriangle
            size={22}
          />
        }
        tone="parent"
        footerText="Pending Payment"
        footerColor={
          stats.remaining > 0
            ? "warning"
            : "success"
        }
      />

      <StatCard
        label="Invoices"
        value={stats.invoices}
        icon={
          <Receipt size={22} />
        }
        tone="parent"
        footerText="Monthly Bills"
        footerColor="info"
      />

    </div>
  );
};

export default FeeOverview;