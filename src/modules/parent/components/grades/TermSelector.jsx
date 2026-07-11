import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../../../components/ui/Card/Card";
import Select from "../../../../components/ui/Select/Select";

import { setSelectedTerm } from "../../../../store/parentSlice";

/*
=====================================================
Standard exam types — always shown, even if the child
has no grades of that type yet, so the filter stays
consistent with the rest of the app (report card,
grade chart, etc).
=====================================================
*/

const STANDARD_TERMS = ["Mid-Term", "Final", "Quiz", "Assignment"];

const TermSelector = () => {
  const dispatch = useDispatch();

  const {
    grades,
    selectedTerm,
  } = useSelector((state) => state.parent);

  /*
  =====================================================
  Build Term Options
  =====================================================
  */

  const options = useMemo(() => {
    const termsInData = [
      ...new Set(
        grades.map((item) => item.exam_type)
      ),
    ];

    // Start with the standard terms (always present), then append any
    // extra exam types found in the data that aren't already covered.
    const extraTerms = termsInData.filter(
      (term) => !STANDARD_TERMS.includes(term)
    );

    const terms = [...STANDARD_TERMS, ...extraTerms];

    return [
      {
        value: "All",
        label: "All Exams",
      },
      ...terms.map((term) => ({
        value: term,
        label: term,
      })),
    ];
  }, [grades]);

  /*
  =====================================================
  Change
  =====================================================
  */

const handleChange = (value) => {
  dispatch(setSelectedTerm(value));
};

  return (
 <Card hover={false}>
  <div className="space-y-5">

    {/* Header */}

    <div>
      <h3 className="text-lg font-semibold text-text-primary">
        Select Examination
      </h3>

      <p className="mt-1 text-sm text-text-secondary">
        Choose an examination to view your child's academic performance and subject-wise results.
      </p>
    </div>

    {/* Select */}
<div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
  {options.map((option) => (
    <button
      key={option.value}
      onClick={() => handleChange(option.value)}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
        selectedTerm === option.value
          ? "bg-parent-primary text-white"
          : "border border-parent-primary/20 bg-white text-text-secondary hover:bg-parent-primary/10"
      }`}
    >
      {option.label}
    </button>
  ))}
</div>

    {/* Tag Line */}

    <div className="rounded-xl border border-parent-primary/20 bg-parent-primary/5 p-4">
      <p className="text-sm leading-6 text-text-secondary">
        📚 Exam results help you monitor your child's progress over time.
        Switch between examinations to compare performance and identify
        strengths or areas that may need additional attention.
      </p>
    </div>

  </div>
</Card>
  );
};

export default TermSelector;
