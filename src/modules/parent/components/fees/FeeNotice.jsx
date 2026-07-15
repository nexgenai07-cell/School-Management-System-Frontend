// src/modules/parent/components/fees/FeeNotice.jsx

import {
  Info,
  Clock3,
} from "lucide-react";

import Card from "../../../../components/ui/Card/Card";

const FeeNotice = () => {
  return (
    <Card hover={false}>
      <div className="flex items-start gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-parent-light">
          <Info
            size={22}
            className="text-parent-primary"
          />
        </div>

        <div className="flex-1">

          <h3 className="text-lg font-semibold text-text-primary">
            Payment Reminder
          </h3>

          <p className="mt-2 leading-7 text-text-secondary">
            Please ensure that all outstanding fee invoices are paid before
            their due dates. Late payments may result in additional charges
            according to the school's fee policy.
          </p>

          <div className="mt-5 flex items-center gap-2 rounded-lg border border-parent-border bg-parent-light/30 px-4 py-3">

            <Clock3
              size={18}
              className="text-parent-primary"
            />

            <span className="text-sm font-medium text-text-primary">
              Payments are processed securely through Stripe.
            </span>

          </div>

        </div>

      </div>
    </Card>
  );
};

export default FeeNotice;