import { useMemo, useState } from "react";
import {
  Eye,
  CreditCard,
  Search,
} from "lucide-react";

import Button from "../../../components/ui/Button/Button";
import Card from "../../../components/ui/card/Card";

const FILTERS = [
  "All",
  "Paid",
  "Partial",
  "Pending",
];

function FeeScheduleTable({
  fees = [],
  onView,
  onPay,
}) {
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const filteredFees =
    useMemo(() => {
      return fees.filter(
        (fee) => {
          const matchesStatus =
            statusFilter ===
              "All" ||
            fee.status ===
              statusFilter;

          const month =
            new Date(
              fee.month
            ).toLocaleDateString(
              "en-US",
              {
                month:
                  "long",
                year: "numeric",
              }
            );

          const matchesSearch =
            month
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (
            matchesStatus &&
            matchesSearch
          );
        }
      );
    }, [
      fees,
      statusFilter,
      search,
    ]);

  const getStatusBadge =
    (status) => {
      switch (
        status
      ) {
        case "Paid":
          return "bg-green-100 text-green-700";

        case "Partial":
          return "bg-yellow-100 text-yellow-700";

        default:
          return "bg-red-100 text-red-700";
      }
    };

  return (
    <Card className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-student-text">
            Fee
            Schedule
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            View your
            monthly fee
            records.
          </p>
        </div>

        {/* Search */}

        <div className="relative w-full max-w-xs">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />

          <input
            type="text"
            placeholder="Search month..."
            value={
              search
            }
            onChange={(
              e
            ) =>
              setSearch(
                e.target
                  .value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-student-border
              py-2
              pl-10
              pr-4
              outline-none
              transition
              focus:border-student-primary
            "
          />
        </div>
      </div>

      {/* Filters */}

      <div className="flex flex-wrap gap-3">
        {FILTERS.map(
          (
            filter
          ) => (
            <Button
              key={
                filter
              }
              size="sm"
              tone="student"
              variant={
                statusFilter ===
                filter
                  ? "primary"
                  : "outline"
              }
              onClick={() =>
                setStatusFilter(
                  filter
                )
              }
            >
              {filter}
            </Button>
          )
        )}
      </div>

      {/* Table */}
{/* ============================
    Desktop Table
============================ */}
<div className="hidden lg:block overflow-x-auto">
  <table className="min-w-full">
    <thead className="bg-student-light">
      <tr className="text-left">
        <th className="px-4 py-3">Month</th>
        <th className="px-4 py-3">Original</th>
        <th className="px-4 py-3">Payable</th>
        <th className="px-4 py-3">Paid</th>
        <th className="px-4 py-3">Remaining</th>
        <th className="px-4 py-3">Due Date</th>
        <th className="px-4 py-3">Status</th>
        <th className="px-4 py-3 text-center">
          Actions
        </th>
      </tr>
    </thead>

    <tbody>
      {filteredFees.map((fee) => {
        const remaining =
          Number(fee.amount) -
          Number(fee.amount_paid);

        return (
          <tr
            key={fee.id}
            className="border-b transition hover:bg-student-light"
          >
            <td className="px-4 py-4">
              {new Date(fee.month).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  year: "numeric",
                }
              )}
            </td>

            <td className="px-4 py-4">
              Rs. {fee.original_amount}
            </td>

            <td className="px-4 py-4">
              Rs. {fee.amount}
            </td>

            <td className="px-4 py-4">
              Rs. {fee.amount_paid}
            </td>

            <td className="px-4 py-4 font-semibold text-red-600">
              Rs. {remaining}
            </td>

            <td className="px-4 py-4">
              {new Date(
                fee.due_date
              ).toLocaleDateString()}
            </td>

            <td className="px-4 py-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(
                  fee.status
                )}`}
              >
                {fee.status}
              </span>
            </td>

            <td className="px-4 py-4">
              <div className="flex justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  tone="student"
                  leftIcon={<Eye size={16} />}
                  onClick={() => onView?.(fee)}
                >
                  View
                </Button>

                {fee.status !== "Paid" && (
                  <Button
                    size="sm"
                    tone="student"
                    leftIcon={
                      <CreditCard size={16} />
                    }
                    onClick={() => onPay?.(fee)}
                  >
                    Pay
                  </Button>
                )}
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

{/* ============================
    Mobile Cards
============================ */}
<div className="space-y-4 lg:hidden">
  {filteredFees.length === 0 ? (
    <Card className="p-6 text-center text-text-secondary">
      No fee records found.
    </Card>
  ) : (
    filteredFees.map((fee) => {
      const remaining =
        Number(fee.amount) -
        Number(fee.amount_paid);

      return (
        <Card key={fee.id}>
          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-student-text">
                {new Date(fee.month).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )}
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(
                  fee.status
                )}`}
              >
                {fee.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">

              <div>
                <p className="text-text-secondary">
                  Original
                </p>
                <p className="font-medium">
                  Rs. {fee.original_amount}
                </p>
              </div>

              <div>
                <p className="text-text-secondary">
                  Payable
                </p>
                <p className="font-medium">
                  Rs. {fee.amount}
                </p>
              </div>

              <div>
                <p className="text-text-secondary">
                  Paid
                </p>
                <p className="font-medium">
                  Rs. {fee.amount_paid}
                </p>
              </div>

              <div>
                <p className="text-text-secondary">
                  Remaining
                </p>
                <p className="font-semibold text-red-600">
                  Rs. {remaining}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-text-secondary">
                  Due Date
                </p>
                <p className="font-medium">
                  {new Date(
                    fee.due_date
                  ).toLocaleDateString()}
                </p>
              </div>

            </div>

            <div className="flex gap-3">

              <Button
                fullWidth
                variant="outline"
                tone="student"
                leftIcon={<Eye size={16} />}
                onClick={() => onView?.(fee)}
              >
                View
              </Button>

              {fee.status !== "Paid" && (
                <Button
                  fullWidth
                  tone="student"
                  leftIcon={
                    <CreditCard size={16} />
                  }
                  onClick={() => onPay?.(fee)}
                >
                  Pay
                </Button>
              )}

            </div>

          </div>
        </Card>
      );
    })
  )}
</div>
    </Card>
  );
}

export default FeeScheduleTable;