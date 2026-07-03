// src/modules/parent/pages/BehaviorLogs.jsx

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  fetchParentLinks,
  fetchBehaviorLogs,
} from "../../../store/parentThunks";

import BehaviorHeader from "../components/behavior/BehaviorHeader";
import ChildBehaviorSelector from "../components/behavior/ChildBehaviorSelector";
import BehaviorOverview from "../components/behavior/BehaviorOverview";
import BehaviorLogList from "../components/behavior/BehaviorLogList";

const BehaviorLogs = () => {
  const dispatch = useDispatch();

  /*
  =====================================================
  Fetch Data
  =====================================================
  */

  useEffect(() => {
    dispatch(fetchParentLinks());
    dispatch(fetchBehaviorLogs());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* ==========================================
          Header
      ========================================== */}

      <BehaviorHeader />

      {/* ==========================================
          Child Selector
      ========================================== */}

      <ChildBehaviorSelector />

      {/* ==========================================
          Overview Cards
      ========================================== */}

      <BehaviorOverview />

      {/* ==========================================
          Behavior Logs
      ========================================== */}

      <BehaviorLogList role="parent" />
    </div>
  );
};

export default BehaviorLogs;