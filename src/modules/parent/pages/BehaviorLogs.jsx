// src/modules/parent/pages/BehaviorLogs.jsx

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { gsap } from "gsap";

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

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const selectorRef = useRef(null);
  const overviewRef = useRef(null);
  const listRef = useRef(null);

  /*
  =====================================================
  Fetch Data
  =====================================================
  */

  useEffect(() => {
    dispatch(fetchParentLinks());
    dispatch(fetchBehaviorLogs());
  }, [dispatch]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
        .fromTo(
          selectorRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.55 },
          "-=0.25"
        )
        .fromTo(
          overviewRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          listRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.35"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* ==========================================
          Header
      ========================================== */}

      <div ref={headerRef}>
        <BehaviorHeader />
      </div>

      {/* ==========================================
          Child Selector
      ========================================== */}

      <div ref={selectorRef}>
        <ChildBehaviorSelector />
      </div>

      {/* ==========================================
          Overview Cards
      ========================================== */}

      <div ref={overviewRef}>
        <BehaviorOverview />
      </div>

      {/* ==========================================
          Behavior Logs
      ========================================== */}

      <div ref={listRef}>
        <BehaviorLogList role="parent" />
      </div>
    </div>
  );
};

export default BehaviorLogs;