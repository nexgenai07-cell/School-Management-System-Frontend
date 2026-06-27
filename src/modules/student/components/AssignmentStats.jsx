import StatCard from "../../../components/composite/Statcard/Statcard";

function AssignmentStats({
  assignments = [],
}) {
  const total =
    assignments.length;

  const pending =
    assignments.filter(
      (a) =>
        a.status ===
        "Pending"
    ).length;

  const submitted =
    assignments.filter(
      (a) =>
        a.status ===
        "Submitted"
    ).length;

  const graded =
    assignments.filter(
      (a) =>
        a.status ===
        "Graded"
    ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total"
        value={total}
        tone="student"
      />

      <StatCard
        label="Pending"
        value={pending}
        tone="student"
        footerColor="warning"
      />

      <StatCard
        label="Submitted"
        value={submitted}
        tone="student"
      />

      <StatCard
        label="Graded"
        value={graded}
        tone="student"
        footerColor="success"
      />
    </div>
  );
}

export default AssignmentStats;