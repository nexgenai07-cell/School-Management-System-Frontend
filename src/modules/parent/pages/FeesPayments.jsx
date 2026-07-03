// src/modules/parent/pages/FeesPayments.jsx

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import PageHeader from "../../../components/global/PageHeader/PageHeader";

import ChildFeeSelector from "../components/fees/ChildFeeSelector";
import FeeOverview from "../components/fees/FeeOverview";
import MonthlyFeeTable from "../components/fees/MonthlyFeeTable";
import PaymentCard from "../components/fees/PaymentCard";
import PaymentHistory from "../components/fees/PaymentHistory";
import FeeNotice from "../components/fees/FeeNotice";

import {
  fetchParentLinks,
  fetchFees,
  fetchPayments,
} from "../../../store/parentThunks";

const FeesPayments = () => {
  const dispatch = useDispatch();

  /*
  =====================================================
  Fetch Data
  =====================================================
  */

  useEffect(() => {
    dispatch(fetchParentLinks());
    dispatch(fetchFees());
    dispatch(fetchPayments());
  }, [dispatch]);

  return (
    <div className="space-y-8">

      {/* ==========================================
          Header
      ========================================== */}

      <PageHeader
        title="Fees & Payments"
        subtitle="View fee invoices, payment history and manage outstanding payments."
        breadcrumbs={[
          "Parent",
          "Fees & Payments",
        ]}
      />

      {/* ==========================================
          Child Selector
      ========================================== */}

      <ChildFeeSelector />

      {/* ==========================================
          Overview Cards
      ========================================== */}

      <FeeOverview />

      {/* ==========================================
          Fee Table + Payment Card
      ========================================== */}

      <div className="grid gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">
          <MonthlyFeeTable />
        </div>

        <PaymentCard />

      </div>

      {/* ==========================================
          Payment History
      ========================================== */}

      <PaymentHistory />

      {/* ==========================================
          Fee Notice
      ========================================== */}

      <FeeNotice />

    </div>
  );
};

export default FeesPayments;