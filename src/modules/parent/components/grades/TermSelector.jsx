import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../../../components/ui/Card/Card";
import Select from "../../../../components/ui/Select/Select";

import { setSelectedTerm } from "../../../../store/parentSlice";

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
    const terms = [
      ...new Set(
        grades.map((item) => item.exam_type)
      ),
    ];

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

    <Select
      tone="parent"
      size="lg"
      value={selectedTerm}
      options={options}
      onChange={handleChange}
    />

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