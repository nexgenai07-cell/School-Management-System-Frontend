// src/modules/admin/pages/TimetableManagement/index.jsx

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

import { Button } from "../../../../components/ui/Button";
import ConfirmDialog from "../../../../components/global/ConfirmDialog/ConfirmDialog";
import { LoadingSpinner } from "../../../../components/ui/LoadingSpinner";

import StatsCards from "./components/StatsCards";
import ClassSelector from "./components/ClassSelector";
import TimetableGrid from "./components/TimetableGrid";
import TimetableDrawer from "./components/TimetableDrawer";
import TimetableCards from "./components/TimetableCards";
import { FadeIn, StaggerGroup, StaggerItem } from "../../components/animations";
import {
  fetchTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  fetchClasses,
  fetchSubjects,
  fetchRooms,
  fetchTeachersForDropdown,
} from "../../../../store/admin/academicsThunks";

import { useTimetableGrid } from "./hooks/useTimetableGrid";
import { DAYS, TIME_SLOTS, getNextTimeSlot, timesOverlap } from "./utils/helpers";

export default function TimetableManagement() {
  const dispatch = useDispatch();
  const {
    timetable,
    timetableLoading,
    timetableUpdating,
    classes,
    subjects,
    teachers,
    rooms,
  } = useSelector((state) => state.academics);

  // ─── Local States ──────────────────────────────────────────────────────────
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [formData, setFormData] = useState({
    class_section: "",
    day: "",
    subject: "",
    teacher: "",
    room: "",
    start_time: "",
    end_time: "",
  });
  const [drawerError, setDrawerError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ─── Fetch Data on Mount ──────────────────────────────────────────────────
 useEffect(() => {
  dispatch(fetchTimetable());
  dispatch(fetchClasses());
  dispatch(fetchSubjects());
  dispatch(fetchRooms());
  dispatch(fetchTeachersForDropdown());
}, [dispatch]);

  // ─── Set default selected class ──────────────────────────────────────────
  useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0]?.id);
    }
  }, [classes, selectedClass]);
  useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 640);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  // ─── Filter entries by selected class ─────────────────────────────────────
  const classEntries = useMemo(() => {
    if (!selectedClass) return [];
    return timetable.filter((e) => e.class_section === selectedClass);
  }, [timetable, selectedClass]);

  //  Grid data with mapped names (ID → Name)
  const gridData = useTimetableGrid(classEntries, subjects, teachers, rooms);

  // ─── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = classEntries.length;
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
    const todayClasses = classEntries.filter((e) => e.day === today).length;
    const published = [...new Set(classEntries.map((e) => e.class_section))].length;
    return { total, todayClasses, published };
  }, [classEntries]);

  // ─── Dropdown Options ──────────────────────────────────────────────────────
  const classOptions = classes.map((c) => ({
    value: c.id,
    label: `${c.class_name}-${c.section}`,
  }));

const subjectOptions = useMemo(() => {
  if (!selectedClass) return [];
  
  // Sirf selected class ke subjects show karein
  return subjects
    .filter((s) => s.class_section === selectedClass)
    .map((s) => ({
      value: s.id,
      label: s.subject_name,
    }));
}, [subjects, selectedClass]);

  const teacherOptions = teachers.map((t) => ({
    value: t.id,
    label: t.full_name,
  }));

  const roomOptions = rooms.map((r) => ({
    value: r.id,
    label: `${r.name} (${r.location || ""})`,
  }));

  // ─── Conflict Check ────────────────────────────────────────────────────────
  const checkConflicts = (data, excludeId = null) => {
    const conflicts = {
      teacher: false,
      room: false,
      class: false,
      teacherEntry: null,
      roomEntry: null,
      classEntry: null,
    };

    const conflictingEntries = timetable.filter((e) => {
      if (excludeId && e.id === excludeId) return false;
      return (
        e.class_section === data.class_section ||
        e.teacher === data.teacher ||
        e.room === data.room
      );
    });

    for (const entry of conflictingEntries) {
      if (entry.day !== data.day) continue;
      if (!timesOverlap(data.start_time, data.end_time, entry.start_time, entry.end_time)) continue;

      if (entry.class_section === data.class_section) {
        conflicts.class = true;
        conflicts.classEntry = entry;
      }
      if (entry.teacher === data.teacher) {
        conflicts.teacher = true;
        conflicts.teacherEntry = entry;
      }
      if (entry.room === data.room) {
        conflicts.room = true;
        conflicts.roomEntry = entry;
      }
    }

    return conflicts;
  };

  const conflictResult = useMemo(() => {
    if (!formData.class_section || !formData.day || !formData.start_time || !formData.end_time) {
      return null;
    }
    return checkConflicts(formData, editingId);
  }, [formData, editingId]);

  const isFormValid = useMemo(() => {
    if (!formData.class_section || !formData.day || !formData.subject ||
        !formData.teacher || !formData.room || !formData.start_time || !formData.end_time) {
      return false;
    }
    if (!conflictResult) return false;
    return !conflictResult.teacher && !conflictResult.room && !conflictResult.class;
  }, [formData, conflictResult]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleAdd = () => {
    setDrawerMode("add");
    setEditingId(null);
    setFormData({
      class_section: selectedClass || "",
      day: "Mon",
      subject: "",
      teacher: "",
      room: "",
      start_time: "08:00",
      end_time: "09:00",
    });
    setDrawerError("");
    setIsDrawerOpen(true);
  };

  const handleEdit = (entry) => {
    setDrawerMode("edit");
    setEditingId(entry.id);
    setFormData({
      class_section: entry.class_section,
      day: entry.day,
      subject: entry.subject,
      teacher: entry.teacher,
      room: entry.room,
      start_time: entry.start_time,
      end_time: entry.end_time,
    });
    setDrawerError("");
    setIsDrawerOpen(true);
  };

  const handleDelete = (entry) => {
    setDeleteTarget(entry);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await dispatch(deleteTimetable(deleteTarget.id)).unwrap();
        setIsDeleteDialogOpen(false);
        setDeleteTarget(null);
      } catch (error) {
        alert(error.message || "Failed to delete timetable entry");
      }
    }
  };

  const handleSave = async () => {
    setDrawerError("");

    const payload = {
      class_section: Number(formData.class_section),
      day: formData.day,
      subject: Number(formData.subject),
      teacher: Number(formData.teacher),
      room: Number(formData.room),
      start_time: formData.start_time,
      end_time: formData.end_time,
    };

    try {
      if (drawerMode === "add") {
        await dispatch(createTimetable(payload)).unwrap();
      } else {
        await dispatch(updateTimetable({ id: editingId, ...payload })).unwrap();
      }
      setIsDrawerOpen(false);
    } catch (error) {
      setDrawerError(error.message || "Failed to save timetable entry");
    }
  };

  const handleSlotAdd = (day, time) => {
    setDrawerMode("add");
    setEditingId(null);
    setFormData({
      class_section: selectedClass || "",
      day: day,
      subject: "",
      teacher: "",
      room: "",
      start_time: time,
      end_time: getNextTimeSlot(time),
    });
    setDrawerError("");
    setIsDrawerOpen(true);
  };

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (timetableLoading || !classes.length) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 flex flex-col gap-5 min-h-screen bg-[var(--color-surface-dim)]">
      <FadeIn y={10} duration={0.5}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Timetable Management</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
            Create and manage weekly class schedules while preventing scheduling conflicts.
          </p>
        </div>
        <Button
          variant="primary"
          tone="admin"
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={handleAdd}
        >
          Add Timetable
        </Button>
      </div>
      </FadeIn>
      <StatsCards stats={stats} />
       <FadeIn y={10} delay={0.1}>
      <ClassSelector
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        classOptions={classOptions}
      />
       </FadeIn>
       <FadeIn y={15} delay={0.2}>
      <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden p-4">
      {isMobile ? (
        //  Mobile: Card View — all days entries
        <TimetableCards 
          entries={classEntries}   // All entries for selected class
          onEdit={handleEdit}
          onAdd={handleSlotAdd}
          selectedClass={selectedClass}
          DAYS={DAYS}
        />
      ) : (
        // Desktop: Grid View
        <TimetableGrid
          gridData={gridData}
          onAddSlot={handleSlotAdd}
          onEditSlot={handleEdit}
        />
      )}
    </div>
     </FadeIn>
      <TimetableDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setDrawerError("");
        }}
        drawerMode={drawerMode}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        isFormValid={isFormValid}
        conflictResult={conflictResult}
        drawerError={drawerError}
        classOptions={classOptions}
        subjectOptions={subjectOptions}
        teacherOptions={teacherOptions}
        roomOptions={roomOptions}
        updating={timetableUpdating}
        subjects={subjects}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Timetable Entry"
        message="This action cannot be undone. Are you sure you want to delete this entry?"
        variant="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}