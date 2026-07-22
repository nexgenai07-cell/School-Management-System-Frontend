// src/modules/admin/pages/UserProfileManagement/index.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageHeader } from "../../../../components/global/pageHeader";

import StudentTab from "./components/StudentTab";
import TeacherTab from "./components/TeacherTab";
import ParentTab from "./components/ParentTab";
import ProfileStats from "./components/ProfileStats";
import UserProfileModal from './components/UserProfileModal';

// ─── Animation imports ──────────────────────────────────────────────
import { FadeIn, StaggerGroup, StaggerItem } from "../../components/animations";

const TABS = ["Students", "Teachers", "Parents"];

export default function UserProfileManagement() {
  const [activeTab, setActiveTab] = useState("Students");
  const { students, teachers, parents, classes } = useSelector((state) => state.admin);

  const [modalState, setModalState] = useState({
    isOpen: false,
    user: null,
    role: 'student',
  });

  const handleRowClick = (user) => {
    let role = 'student';
    if (activeTab === 'Teachers') role = 'teacher';
    else if (activeTab === 'Parents') role = 'parent';
    setModalState({ isOpen: true, user, role });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, user: null, role: 'student' });
  };

  const classOptions = classes.map((c) => ({
    value: c.id,
    label: `${c.class_name}-${c.section}`,
  }));

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7 min-h-screen bg-gradient-to-br from-[var(--color-surface-dim)] via-[var(--color-surface-dim)] to-[var(--color-admin-light)]">

      {/* ─── Page Header ────────────────────────────────────────────── */}
      <FadeIn y={16}>
        <PageHeader
          title="User Profile Management"
          subtitle="Manage students, teachers, and parent accounts"
          breadcrumbs={["Admin", "User Profiles"]}
        />
      </FadeIn>

      {/* ─── Stats ──────────────────────────────────────────────────── */}
      <FadeIn delay={0.1}>
        <ProfileStats students={students} teachers={teachers} parents={parents} />
      </FadeIn>

      {/* ─── Tabs ───────────────────────────────────────────────────── */}
      <FadeIn delay={0.2}>
        <div className="flex gap-1 border-b border-gray-200 overflow-x-auto scrollbar-hide py-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-5 py-2 text-sm font-medium rounded-full transition-all duration-200
                  border ${isActive ? 'border-[var(--color-admin-primary)] bg-[var(--color-admin-primary)] text-white shadow-md shadow-[var(--color-admin-primary)]/30' : 'border-gray-300 bg-white text-[var(--color-text-secondary)] hover:bg-gray-50 hover:border-gray-400'}
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </FadeIn>

      {/* ─── Tab Content ───────────────────────────────────────────── */}
      <FadeIn delay={0.3}>
        {activeTab === "Students" && <StudentTab onRowClick={handleRowClick} />}
        {activeTab === "Teachers" && <TeacherTab onRowClick={handleRowClick} />}
        {activeTab === "Parents" && <ParentTab onRowClick={handleRowClick} />}
      </FadeIn>

      {/* ─── Profile Modal ────────────────────────────────────────── */}
      <UserProfileModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        user={modalState.user}
        role={modalState.role}
        classOptions={classOptions}
      />
    </div>
  );
}