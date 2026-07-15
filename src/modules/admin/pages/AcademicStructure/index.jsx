import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Book, DoorOpen, Users } from "lucide-react";

import { PageHeader } from "../../../../components/global/pageheader";
import StatsDonut from "./components/StatsDonut";
import RecentActivity from "./components/RecentActivity";
import ClassesTab from "./components/ClassesTab";
import SubjectsTab from "./components/SubjectsTab";
import RoomsTab from "./components/RoomsTab";

import {
  fetchClasses,
  fetchSubjects,
  fetchRooms,
  fetchTeachersForDropdown,
} from "../../../../store/admin/academicsThunks";

const TABS = [
  { id: "classes", label: "Classes & Sections", icon: Grid, color: "admin", component: ClassesTab },
  { id: "subjects", label: "Subjects", icon: Book, color: "teacher", component: SubjectsTab },
  { id: "rooms", label: "Rooms", icon: DoorOpen, color: "student", component: RoomsTab },
];

export default function AcademicStructure() {
  const dispatch = useDispatch();
  const { classes, subjects, rooms ,teachers } = useSelector((state) => state.academics);
  const [activeTab, setActiveTab] = useState("classes");

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchSubjects());
    dispatch(fetchRooms());
    dispatch(fetchTeachersForDropdown());
  }, [dispatch]);

  const stats = useMemo(
    () => ({
      classes: classes.length,
      subjects: subjects.length,
      rooms: rooms.length,
      assigned: subjects.filter((s) => s.assigned_teacher !== null).length,
      unassigned: subjects.filter((s) => s.assigned_teacher === null).length,
    }),
    [classes, subjects, rooms]
  );

  const statsData = [
    { label: "Classes", value: stats.classes },
    { label: "Subjects", value: stats.subjects },
    { label: "Rooms", value: stats.rooms },
    { label: "Assigned", value: stats.assigned },
    { label: "Unassigned", value: stats.unassigned },
  ];

  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component;

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-screen bg-[var(--color-surface-dim)]">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Academic Structure</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
          Configure and manage your school's foundational academic hierarchy
        </p>
      </div>

      {/* Stats + Recent Activity */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <StatsDonut data={statsData} />
          </div>
          <div className="border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
            <RecentActivity teachers={teachers}/>
          </div>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200 px-2 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count =
              tab.id === "classes"
                ? classes.length
                : tab.id === "subjects"
                ? subjects.length
                : tab.id === "rooms"
                ? rooms.length
                : subjects.filter((s) => s.assigned_teacher !== null).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? `border-[var(--color-${tab.color}-primary)] text-[var(--color-${tab.color}-primary)]`
                    : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                <Icon size={16} className={isActive ? `text-[var(--color-${tab.color}-primary)]` : ""} />
                {tab.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? `bg-[var(--color-${tab.color}-light)] text-[var(--color-${tab.color}-primary)]`
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}