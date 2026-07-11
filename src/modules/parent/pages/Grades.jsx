import { useEffect } from "react";
import { useDispatch } from "react-redux";

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">

        <ChildGradeSelector />

       

      </div>

      {/* =====================================================
          Overview Cards
      ===================================================== */}
 <GradeChart />
      <GradeOverview />

      {/* =====================================================
          Performance Chart
      ===================================================== */}
<div className="xl:col-span-8">
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
