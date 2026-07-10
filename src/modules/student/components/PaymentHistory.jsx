import { useMemo, useState } from "react";
import {
  Search,
  Download,
  CreditCard,
  Calendar,
  Receipt,
} from "lucide-react";

import Card from "../../../components/ui/card/Card";
import Button from "../../../components/ui/Button/Button";

function PaymentHistory({
  payments = [],
  fees = [],
}) {
  const [search, setSearch] =
    useState("");

  /*
  =====================================
  Merge Payments with Fees
  =====================================
  */

  const paymentHistory =
    useMemo(() => {
      return payments
        .map((payment) => {
          const fee =
            fees.find(
              (item) =>
                item.id ===
                payment.fee
            );

          return {
            ...payment,
            fee,
          };
        })
        .filter((payment) => {
          const month =
            payment.fee
              ? new Date(
                  payment.fee
                    .month
                ).toLocaleDateString(
                  "en-US",
                  {
                    month:
                      "long",
                    year:
                      "numeric",
                  }
                )
              : "";

          return month
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );
        })
        .sort(
          (a, b) =>
            new Date(
              b.payment_date
            ) -
            new Date(
              a.payment_date
            )
        );
    }, [
      payments,
      fees,
      search,
    ]);

  /*
  =====================================
  Download Receipt
  =====================================
  */

  const downloadReceipt =
    (payment) => {
      alert(
        `Downloading receipt for Transaction:\n${payment.transaction_id}`
      );
    };

  return (
    <Card className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold text-student-text">
            Payment History
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            View all your
            successful
            payments.
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
            value={search}
            placeholder="Search month..."
            onChange={(e) =>
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

      {/* Empty */}

      {/* Empty */}

{paymentHistory.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <Receipt
      size={60}
      className="text-student-primary"
    />

    <h3 className="mt-5 text-xl font-semibold">
      No Payments Found
    </h3>

    <p className="mt-2 text-sm text-text-secondary">
      You haven't made any payments yet.
    </p>
  </div>
) : (
  <>
    {/* ===========================
        Mobile Cards
    =========================== */}

    <div className="space-y-4 md:hidden">
      {paymentHistory.map((payment) => (
        <div
          key={payment.id}
          className="rounded-2xl border border-student-border bg-white p-4 shadow-sm"
        >
          {/* Month */}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">

              <Calendar
                size={18}
                className="text-student-primary"
              />

              <span className="font-semibold">
                {payment.fee
                  ? new Date(
                      payment.fee.month
                    ).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )
                  : "-"}
              </span>

            </div>

            <span className="text-lg font-bold text-green-600">
              Rs.
              {Number(
                payment.amount_paid
              ).toLocaleString()}
            </span>
          </div>

          {/* Details */}

          <div className="mt-4 space-y-2 text-sm">

            <div className="flex justify-between">
              <span className="text-text-secondary">
                Method
              </span>

              <div className="flex items-center gap-2 rounded-full bg-student-light px-3 py-1">
                <CreditCard size={14} />

                {payment.payment_method}
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">
                Transaction
              </span>

              <span className="font-mono text-xs break-all text-right">
                {payment.transaction_id}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-secondary">
                Date
              </span>

              <span>
                {new Date(
                  payment.payment_date
                ).toLocaleDateString()}
              </span>
            </div>

          </div>

          {/* Button */}

          <Button
            className="mt-5 w-full"
            variant="outline"
            tone="student"
            leftIcon={<Download size={16} />}
            onClick={() =>
              downloadReceipt(payment)
            }
          >
            Download Receipt
          </Button>
        </div>
      ))}
    </div>

    {/* ===========================
        Desktop Table
    =========================== */}

    <div className="hidden overflow-x-auto md:block">
      <table className="w-full">
        <thead className="bg-student-light">
          <tr>
            <th className="px-4 py-3 text-left">
              Month
            </th>

            <th className="px-4 py-3 text-left">
              Amount
            </th>

            <th className="px-4 py-3 text-left">
              Method
            </th>

            <th className="px-4 py-3 text-left">
              Transaction
            </th>

            <th className="px-4 py-3 text-left">
              Payment Date
            </th>

            <th className="px-4 py-3 text-center">
              Receipt
            </th>
          </tr>
        </thead>

        <tbody>
          {paymentHistory.map((payment) => (
            <tr
              key={payment.id}
              className="border-b transition hover:bg-student-light"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Calendar
                    size={18}
                    className="text-student-primary"
                  />

                  {payment.fee
                    ? new Date(
                        payment.fee.month
                      ).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "-"}
                </div>
              </td>

              <td className="px-4 py-4 font-semibold text-green-600">
                Rs.
                {Number(
                  payment.amount_paid
                ).toLocaleString()}
              </td>

              <td className="px-4 py-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-student-light px-3 py-1">
                  <CreditCard size={16} />
                  {payment.payment_method}
                </div>
              </td>

              <td className="px-4 py-4 font-mono text-xs">
                {payment.transaction_id}
              </td>

              <td className="px-4 py-4">
                {new Date(
                  payment.payment_date
                ).toLocaleDateString()}
              </td>

              <td className="px-4 py-4 text-center">
                <Button
                  size="sm"
                  variant="outline"
                  tone="student"
                  leftIcon={<Download size={16} />}
                  onClick={() =>
                    downloadReceipt(payment)
                  }
                >
                  Receipt
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}
    </Card>
  );
}

export default PaymentHistory;