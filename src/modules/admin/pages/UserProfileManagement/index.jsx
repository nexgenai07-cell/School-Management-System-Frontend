import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageHeader } from "../../../../components/global/pageHeader";

import StudentTab from "./components/StudentTab";
import TeacherTab from "./components/TeacherTab";
import ParentTab from "./components/ParentTab";
import ProfileStats from "./components/ProfileStats";

const TABS = ["Students", "Teachers", "Parents"];

export default function UserProfileManagement() {
  const [activeTab, setActiveTab] = useState("Students");
  const { students, teachers, parents } = useSelector((state) => state.admin);

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7 min-h-screen bg-[var(--color-surface-dim)]">
      
      {/* ── Page Header ── */}
      <PageHeader
        title="User Profile Management"
        subtitle="Manage students, teachers, and parent accounts"
        breadcrumbs={[ "Admin", "User Profiles"]}
      />

      {/* ── Stats ── */}
      <ProfileStats students={students} teachers={teachers} parents={parents} />

      {/* ── Tabs ── */}
      <div className="flex gap-2 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-[var(--color-admin-primary)] text-[var(--color-admin-primary)]"
                : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "Students" && <StudentTab />}
      {activeTab === "Teachers" && <TeacherTab />}
      {activeTab === "Parents" && <ParentTab />}
    </div>
  );
}