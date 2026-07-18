// src/modules/admin/pages/UserProfileManagement/index.jsx

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageHeader } from "../../../../components/global/pageHeader";

import StudentTab from "./components/StudentTab";
import TeacherTab from "./components/TeacherTab";
import ParentTab from "./components/ParentTab";
import ProfileStats from "./components/ProfileStats";
import UserProfileModal from './components/UserProfileModal';

const TABS = ["Students", "Teachers", "Parents"];

export default function UserProfileManagement() {
  const [activeTab, setActiveTab] = useState("Students");
  const { students, teachers, parents, classes } = useSelector((state) => state.admin);

  const [modalState, setModalState] = useState({
    isOpen: false,
    user: null,
    role: 'student', // will be set dynamically
  });

  const handleRowClick = (user) => {
    // Determine role from active tab
    let role = 'student';
    if (activeTab === 'Teachers') role = 'teacher';
    else if (activeTab === 'Parents') role = 'parent';
    // else 'student'

    setModalState({
      isOpen: true,
      user,
      role,
    });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, user: null, role: 'student' });
  };

  const classOptions = classes.map((c) => ({
    value: c.id,
    label: `${c.class_name}-${c.section}`,
  }));

  return (
    <div className="p-6 md:p-8 flex flex-col gap-7 min-h-screen bg-[var(--color-surface-dim)]">
      <PageHeader
        title="User Profile Management"
        subtitle="Manage students, teachers, and parent accounts"
        breadcrumbs={["Admin", "User Profiles"]}
      />

      <ProfileStats students={students} teachers={teachers} parents={parents} />

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

      {activeTab === "Students" && <StudentTab onRowClick={handleRowClick} />}
      {activeTab === "Teachers" && <TeacherTab onRowClick={handleRowClick} />}
      {activeTab === "Parents" && <ParentTab onRowClick={handleRowClick} />}

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