import { useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  fetchGrades,
  fetchParentLinks,
} from "../../../store/parentThunks";

import ChildGradeSelector from "../components/grades/ChildGradeSelector";
import TermSelector from "../components/grades/TermSelector";
import GradeOverview from "../components/grades/GradeOverview";
import SubjectPerformanceTable from "../components/grades/SubjectPerformanceTable";
import GradeSummary from "../components/grades/GradeSummary";

const Grades = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchParentLinks());
    dispatch(fetchGrades());
  }, [dispatch]);

  return (
    <div className="space-y-8">

      {/* =====================================================
          Page Header
      ===================================================== */}

      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Academic Grades
        </h1>

        <p className="mt-2 text-text-secondary">
          View your child's academic performance, exam
          results and subject-wise grades.
        </p>
      </div>

      {/* =====================================================
          Selectors
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <ChildGradeSelector />

        <TermSelector />

      </div>

      {/* =====================================================
          Overview Cards
      ===================================================== */}

      <GradeOverview />

      {/* =====================================================
          Main Content
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

        {/* Left */}

        <div className="xl:col-span-8">
          <SubjectPerformanceTable />
        </div>

        {/* Right */}

        <div className="xl:col-span-4">
          <GradeSummary />
        </div>

      </div>

    </div>
  );
};

export default Grades;