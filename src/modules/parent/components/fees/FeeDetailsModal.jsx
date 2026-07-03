// src/modules/parent/components/fees/FeeDetailsModal.jsx

import { useEffect } from "react";

import {
  X,
  CalendarDays,
  Wallet,
  CreditCard,
  BadgeDollarSign,
  CheckCircle,
} from "lucide-react";

import Button from "../../../../components/ui/Button/Button";
import Badge from "../../../../components/ui/Badge/Badge";

const DetailRow = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
    <div className="rounded-lg bg-parent-light p-2">
      <Icon
        size={18}
        className="text-parent-primary"
      />
    </div>

    <div>
      <p className="text-xs uppercase tracking-wide text-text-secondary">
        {label}
      </p>

      <p className="mt-1 font-medium text-text-primary">
        {value}
      </p>
    </div>
  </div>
);

const FeeDetailsModal = ({
  open,
  fee,
  onClose,
}) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open || !fee) return null;

  const remaining =
    Number(fee.amount) -
    Number(fee.amount_paid);

  const formatCurrency = (
    amount
  ) =>
    `PKR ${Number(
      amount
    ).toLocaleString()}`;

  const badgeVariant = {
    Paid: "success",
    Partial: "warning",
    Unpaid: "danger",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      {/* Backdrop */}

      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal */}

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">

        {/* Header */}

        <div className="bg-parent-primary px-6 py-5 text-white">

          <div className="flex items-start justify-between">

            <div>

              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                Fee Invoice
              </span>

              <h2 className="mt-3 text-2xl font-bold">
                {new Date(
                  fee.month
                ).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )}
              </h2>

            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-white/20"
            >
              <X size={20} />
            </button>

          </div>

        </div>

        {/* Body */}

        <div className="grid gap-4 p-6 md:grid-cols-2">

          <DetailRow
            icon={Wallet}
            label="Student"
            value={fee.student_name}
          />

          <DetailRow
            icon={CalendarDays}
            label="Due Date"
            value={new Date(
              fee.due_date
            ).toLocaleDateString()}
          />

          <DetailRow
            icon={
              BadgeDollarSign
            }
            label="Original Fee"
            value={formatCurrency(
              fee.original_amount
            )}
          />

          <DetailRow
            icon={CreditCard}
            label="Payable Fee"
            value={formatCurrency(
              fee.amount
            )}
          />

          <DetailRow
            icon={CheckCircle}
            label="Amount Paid"
            value={formatCurrency(
              fee.amount_paid
            )}
          />

          <DetailRow
            icon={Wallet}
            label="Remaining"
            value={formatCurrency(
              remaining
            )}
          />

        </div>

        {/* Footer */}

        <div className="flex items-center justify-between border-t px-6 py-4">

          <Badge
            variant={
              badgeVariant[
                fee.status
              ]
            }
          >
            {fee.status}
          </Badge>

          <Button
            tone="parent"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>

        </div>

      </div>

    </div>
  );
};

export default FeeDetailsModal;