import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "var(--color-admin-primary)",
  "var(--color-teacher-primary)",
  "var(--color-student-primary)",
  "var(--color-parent-primary)",
  "var(--color-danger)",
];

export default function StatsDonut({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-8">
      <div className="relative shrink-0">
        <ResponsiveContainer width={110} height={110}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={48}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              formatter={(value) => [`${value}`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-[var(--color-text-primary)]">{total}</span>
          <span className="text-[8px] text-[var(--color-text-muted)] uppercase tracking-wider">Total</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
            <div className="flex items-center justify-between min-w-[150px]">
              <span className="text-sm text-[var(--color-text-secondary)]">{item.label}</span>
              <span className="font-bold text-[var(--color-text-primary)]">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}