import { ClipboardList, Clock3, Send, Award } from "lucide-react";

const MetricCard = ({ label, value, footer, icon: Icon, colors, share }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-student-border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60">
    <div
      aria-hidden
      className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
      style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
    />

    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1.5 text-3xl font-semibold text-slate-800">{value}</p>
      </div>
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105"
        style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
      >
        <Icon size={20} strokeWidth={2.25} />
      </div>
    </div>

    <div className="relative mt-4 space-y-1.5">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${share}%`, background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }}
        />
      </div>
      <p className="text-sm font-medium text-slate-500">{footer}</p>
    </div>
  </div>
);

function AssignmentStats({ assignments = [] }) {
  const total = assignments.length;
  const pending = assignments.filter((a) => a.status === "Pending").length;
  const submitted = assignments.filter((a) => a.status === "Submitted").length;
  const graded = assignments.filter((a) => a.status === "Graded").length;

  const shareOf = (value) => (total ? Math.round((value / total) * 100) : 0);

  const cards = [
    {
      label: "Total",
      value: total,
      footer: "All assignments",
      icon: ClipboardList,
      colors: ["#818CF8", "#6366F1"],
      share: 100,
    },
    {
      label: "Pending",
      value: pending,
      footer: `${shareOf(pending)}% of total`,
      icon: Clock3,
      colors: ["#FBBF24", "#D97706"],
      share: shareOf(pending),
    },
    {
      label: "Submitted",
      value: submitted,
      footer: `${shareOf(submitted)}% of total`,
      icon: Send,
      colors: ["#38BDF8", "#2563EB"],
      share: shareOf(submitted),
    },
    {
      label: "Graded",
      value: graded,
      footer: `${shareOf(graded)}% of total`,
      icon: Award,
      colors: ["#34D399", "#0D9488"],
      share: shareOf(graded),
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
}

export default AssignmentStats;
