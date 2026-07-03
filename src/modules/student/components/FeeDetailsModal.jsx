import {
  Calendar,
  CheckCircle,
  Clock,
  Wallet,
  BadgeDollarSign,
  X,
} from "lucide-react";

import Modal from "../../../components/ui/model/Model";
import Button from "../../../components/ui/Button/Button";
import Badge from "../../../components/ui/Badge/Badge";

function FeeDetailsModal({
  open,
  onClose,
  fee,
}) {
  if (!fee) return null;

  const remaining =
    Number(fee.amount) -
    Number(fee.amount_paid);

  const statusVariant = {
    Paid: "success",
    Partial: "warning",
    Pending: "danger",
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Fee Details"
    >
      <div className="space-y-6">

        {/* Header */}

        <div className="flex items-center justify-between rounded-xl bg-student-light p-5">

          <div>
            <h2 className="text-xl font-bold text-student-text">
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

            <p className="mt-1 text-sm text-text-secondary">
              Monthly Tuition Fee
            </p>
          </div>

          <Badge
            variant={
              statusVariant[
                fee.status
              ]
            }
          >
            {fee.status}
          </Badge>

        </div>

        {/* Amounts */}

        <div className="grid gap-4 md:grid-cols-2">

          <div className="rounded-xl border border-student-border p-4">
            <div className="flex items-center gap-2">
              <Wallet
                size={18}
                className="text-student-primary"
              />

              <span className="font-medium">
                Original Fee
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold">
              Rs.
              {Number(
                fee.original_amount
              ).toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border border-student-border p-4">
            <div className="flex items-center gap-2">
              <BadgeDollarSign
                size={18}
                className="text-student-primary"
              />

              <span className="font-medium">
                Payable Fee
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold text-student-text">
              Rs.
              {Number(
                fee.amount
              ).toLocaleString()}
            </p>
          </div>

        </div>

        {/* Payment */}

        <div className="grid gap-4 md:grid-cols-2">

          <div className="rounded-xl border border-green-200 bg-green-50 p-4">

            <div className="flex items-center gap-2">

              <CheckCircle
                size={18}
                className="text-green-600"
              />

              <span className="font-medium">
                Paid
              </span>

            </div>

            <p className="mt-3 text-2xl font-bold text-green-700">
              Rs.
              {Number(
                fee.amount_paid
              ).toLocaleString()}
            </p>

          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-4">

            <div className="flex items-center gap-2">

              <Clock
                size={18}
                className="text-red-600"
              />

              <span className="font-medium">
                Remaining
              </span>

            </div>

            <p className="mt-3 text-2xl font-bold text-red-600">
              Rs.
              {remaining.toLocaleString()}
            </p>

          </div>

        </div>

        {/* Dates */}

        <div className="grid gap-4 md:grid-cols-2">

          <div className="rounded-xl bg-student-light p-4">

            <div className="flex items-center gap-2">

              <Calendar
                size={18}
                className="text-student-primary"
              />

              <span className="font-medium">
                Due Date
              </span>

            </div>

            <p className="mt-3 font-semibold">
              {new Date(
                fee.due_date
              ).toLocaleDateString()}
            </p>

          </div>

          <div className="rounded-xl bg-student-light p-4">

            <div className="flex items-center gap-2">

              <Calendar
                size={18}
                className="text-student-primary"
              />

              <span className="font-medium">
                Paid Date
              </span>

            </div>

            <p className="mt-3 font-semibold">
              {fee.paid_date
                ? new Date(
                    fee.paid_date
                  ).toLocaleDateString()
                : "-"}
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3">

          <Button
            variant="outline"
            tone="student"
            leftIcon={<X size={16} />}
            onClick={onClose}
          >
            Close
          </Button>

        </div>

      </div>
    </Modal>
  );
}

export default FeeDetailsModal;