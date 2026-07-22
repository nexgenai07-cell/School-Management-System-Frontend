// src/modules/teacher/pages/TimetableManagement/index.jsx

import { Fragment } from 'react';
import PageHeader from '../../../../components/global/pageheader/pageheader';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { useMediaQuery } from '../../../../utils/useMediaQuery';
import { useTimetableData } from './hooks/useTimetableData';

import TimetableStats from './components/TimetableStats';
import TimetableGrid from './components/TimetableGrid';
import TimetableMobileList from './components/TimetableMobileList';
import TimetableInsights from './components/TimetableInsights';

// ─── Animation Components ──────────────────────────────────────────────
import { FadeIn } from '../../../admin/components/animations';

export default function TimetableManagement() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { loading, error, stats, gridData, allScheduleItems, upNext, progressPercent, todayEntries } = useTimetableData();

  if (loading) return <LoadingSpinner size="lg" />;
  if (error) return <div className="p-10 text-center text-red-500">Error loading timetable: {error}</div>;

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-screen bg-[var(--color-surface-dim)]">
      <FadeIn y={10} duration={0.5}>
        <PageHeader
          title="My Timetable"
          subtitle="View your weekly academic schedule."
          breadcrumbs={["Teacher", "Timetable"]}
          tone="teacher"
          titleClassName="text-[var(--color-teacher-primary)]"
        />
      </FadeIn>

      <FadeIn y={15} delay={0.1}>
        <TimetableStats stats={stats} />
      </FadeIn>

      <FadeIn y={15} delay={0.2}>
        <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
          {/* Desktop */}
          <div className="hidden lg:block">
            <TimetableGrid gridData={gridData} />
          </div>
          {/* Mobile */}
          <div className="block lg:hidden">
            <TimetableMobileList allScheduleItems={allScheduleItems} />
          </div>
        </div>
      </FadeIn>

      <FadeIn y={10} delay={0.3}>
        <TimetableInsights
          upNext={upNext}
          progressPercent={progressPercent}
          todayCount={todayEntries.length}
        />
      </FadeIn>

      {/* Keep the subtle animations (unchanged) */}
      <style>{`
        .shadow-soft { box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
        .animate-pulse-subtle { animation: pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(1.01); }
        }
      `}</style>
    </div>
  );
}