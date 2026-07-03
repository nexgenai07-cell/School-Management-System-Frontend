// src/modules/parent/components/fees/MonthlyFeeTable.jsx

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Eye,
  CreditCard,
  Receipt,
  Calendar,
} from "lucide-react";

import Card from "../../../../components/ui/Card/Card";
import Button from "../../../../components/ui/Button/Button";
import Badge from "../../../../components/ui/Badge/Badge";

import FeeDetailsModal from "./FeeDetailsModal";

import { setSelectedFee } from "../../../../store/parentSlice";

const MonthlyFeeTable = () => {
  const dispatch = useDispatch();

  const {
    fees = [],
    parentLinks = [],
    selectedChild,
    selectedFee,
  } = useSelector((state) => state.parent);

  /*
  =====================================================
  Current Child
  =====================================================
  */

  const currentChild = useMemo(() => {
    return (
      parentLinks.find(
        (child) => child.student === selectedChild
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
      (fee) => fee.student_name === currentChild.student_name
    );
  }, [fees, currentChild]);

  /*
  =====================================================
  View Modal
  =====================================================
  */

  const [viewFee, setViewFee] = useState(null);

  /*
  =====================================================
  Helpers
  =====================================================
  */

  const formatCurrency = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  const remainingAmount = (fee) =>
    Number(fee.amount) - Number(fee.amount_paid || 0);

  const getStatusVariant = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Partial":
        return "warning";
      case "Pending":
        return "danger";
      default:
        return "secondary";
    }
  };

  const formatMonth = (month) =>
    new Date(month).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  /*
  =====================================================
  Select Fee For Payment
  =====================================================
  */

  const handleSelectFee = (fee) => {
    dispatch(setSelectedFee(fee));
  };

  return (
    <>
      <Card hover={false}>
        {/* ==========================================
            Header
        ========================================== */}

        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
            Monthly Fee Statement
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            View fee invoices and payment status.
          </p>
        </div>

        {/* ==========================================
            Empty State
        ========================================== */}

        {childFees.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-parent-border py-12 text-center">
            <Receipt size={28} className="text-text-secondary/50" />
            <p className="text-sm font-medium text-text-primary">
              No fee records yet
            </p>
            <p className="text-xs text-text-secondary">
              Fee invoices will show up here once they're issued.
            </p>
          </div>
        )}

        {/* ==========================================
            Desktop / Tablet Table (md and up)
        ========================================== */}

        {childFees.length > 0 && (
          <div className="hidden md:block overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-parent-light/40 border-b border-parent-border">
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Month
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Original
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Payable
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Paid
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Remaining
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Due Date
                  </th>
                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Status
                  </th>
                  <th className="p-4 text-center text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {childFees.map((fee) => (
                  <tr
                    key={fee.id}
                    className={`border-b border-slate-200 transition-colors ${
                      selectedFee?.id === fee.id
                        ? "bg-parent-light/30"
                        : "hover:bg-parent-light/20"
                    }`}
                  >
                    <td className="p-4 font-medium text-text-primary whitespace-nowrap">
                      {formatMonth(fee.month)}
                    </td>

                    <td className="p-4 text-text-secondary whitespace-nowrap">
                      {formatCurrency(fee.original_amount)}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {formatCurrency(fee.amount)}
                    </td>

                    <td className="p-4 text-green-600 font-medium whitespace-nowrap">
                      {formatCurrency(fee.amount_paid)}
                    </td>

                    <td className="p-4 font-semibold text-red-600 whitespace-nowrap">
                      {formatCurrency(remainingAmount(fee))}
                    </td>

                    <td className="p-4 text-text-secondary whitespace-nowrap">
                      {formatDate(fee.due_date)}
                    </td>

                    <td className="p-4">
                      <Badge variant={getStatusVariant(fee.status)}>
                        {fee.status}
                      </Badge>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          tone="parent"
                          leftIcon={<Eye size={16} />}
                          onClick={() => setViewFee(fee)}
                        >
                          View
                        </Button>

                        {fee.status !== "Paid" && (
                          <Button
                            size="sm"
                            tone="parent"
                            leftIcon={<CreditCard size={16} />}
                            onClick={() => handleSelectFee(fee)}
                          >
                            Pay
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ==========================================
            Mobile Card List (below md)
        ========================================== */}

        {childFees.length > 0 && (
          <div className="md:hidden flex flex-col gap-3">
            {childFees.map((fee) => (
              <div
                key={fee.id}
                className={`rounded-xl border p-4 transition-colors ${
                  selectedFee?.id === fee.id
                    ? "border-parent-border bg-parent-light/30"
                    : "border-slate-200 bg-white"
                }`}
              >
                {/* Top row: month + status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text-primary leading-tight">
                      {formatMonth(fee.month)}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
                      <Calendar size={12} />
                      Due {formatDate(fee.due_date)}
                    </p>
                  </div>

                  <Badge variant={getStatusVariant(fee.status)}>
                    {fee.status}
                  </Badge>
                </div>

                {/* Amount grid */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-parent-light/30 p-3 text-center">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-text-secondary">
                      Payable
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-text-primary">
                      {formatCurrency(fee.amount)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-text-secondary">
                      Paid
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-green-600">
                      {formatCurrency(fee.amount_paid)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-text-secondary">
                      Remaining
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-red-600">
                      {formatCurrency(remainingAmount(fee))}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    tone="parent"
                    className="flex-1"
                    leftIcon={<Eye size={16} />}
                    onClick={() => setViewFee(fee)}
                  >
                    View
                  </Button>

                  {fee.status !== "Paid" && (
                    <Button
                      size="sm"
                      tone="parent"
                      className="flex-1"
                      leftIcon={<CreditCard size={16} />}
                      onClick={() => handleSelectFee(fee)}
                    >
                      Pay
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ==========================================
          Fee Details Modal
      ========================================== */}

      <FeeDetailsModal
        open={Boolean(viewFee)}
        fee={viewFee}
        onClose={() => setViewFee(null)}
      />
    </>
  );
};

export default MonthlyFeeTable;
