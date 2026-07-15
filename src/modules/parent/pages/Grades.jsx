import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { gsap } from "gsap";

import {
  fetchGrades,
  fetchParentLinks,
} from "../../../store/parentThunks";

import ChildGradeSelector from "../components/grades/ChildGradeSelector";
import TermSelector from "../components/grades/TermSelector";
import GradeOverview from "../components/grades/GradeOverview";
import GradeChart from "../components/grades/GradeChart";
import SubjectPerformanceTable from "../components/grades/SubjectPerformanceTable";


const Grades = () => {
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const selectorRef = useRef(null);
  const chartRef = useRef(null);
  const overviewRef = useRef(null);
  const performanceRef = useRef(null);

  useEffect(() => {
    dispatch(fetchParentLinks());
    dispatch(fetchGrades());
  }, [dispatch]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45 },
          "-=0.25"
        )
        .fromTo(
          selectorRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.55 },
          "-=0.2"
        )
        .fromTo(
          chartRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          overviewRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          performanceRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.35"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">

      {/* =====================================================
          Page Header
      ===================================================== */}

      <div>
        <h1 ref={titleRef} className="text-3xl font-bold text-text-primary">
          Academic Grades
        </h1>

        <p ref={subtitleRef} className="mt-2 text-text-secondary">
          View your child's academic performance, exam
          results and subject-wise grades.
        </p>
      </div>

      {/* =====================================================
          Selectors
      ===================================================== */}

      <div ref={selectorRef} className="grid grid-cols-1 gap-6 lg:grid-cols-1">

        <ChildGradeSelector />

      </div>

      {/* =====================================================
          Overview Cards
      ===================================================== */}

      <div ref={chartRef}>
        <GradeChart />
      </div>

      <div ref={overviewRef}>
        <GradeOverview />
      </div>

      {/* =====================================================
          Performance Chart
      ===================================================== */}

      <div ref={performanceRef} className="xl:col-span-8">
        <TermSelector />
        <SubjectPerformanceTable />
      </div>

      {/* =====================================================
          Main Content
      ===================================================== */}



    </div>
  );
};

export default Grades;