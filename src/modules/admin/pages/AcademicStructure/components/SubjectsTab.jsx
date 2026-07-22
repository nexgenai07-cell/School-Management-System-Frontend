import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash2, Plus, AlertCircle } from "lucide-react";

import { Button } from "../../../../../components/ui/Button";
import { Badge } from "../../../../../components/ui/Badge";
import { Select } from "../../../../../components/ui/Select";
import Drawer from "../../../components/Drawer";
import ConfirmDialog from "../../../../../components/global/ConfirmDialog/ConfirmDialog";
import ResponsiveTable from "../../../components/ResponsiveTable";
import Pagination from "../../../../../components/ui/Pagination/Pagination";
import { usePagination } from "../../UserProfileManagement/hooks/usePagination";
import SubjectFilters from "./SubjectFilters";
import { LoadingSpinner } from "../../../../../components/ui/LoadingSpinner";

import {
  fetchSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  fetchClasses,
  fetchTeachersForDropdown,
} from "../../../../../store/admin/academicsThunks";

const ITEMS_PER_PAGE = 10;

export default function SubjectsTab() {
  const dispatch = useDispatch();
  const { subjects, classes, teachers, loading, updating } = useSelector((state) => state.academics);

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filterAssignment, setFilterAssignment] = useState("all");
  const [drawerMode, setDrawerMode] = useState("add");
  const [formData, setFormData] = useState({
    subject_name: "",
    class_section_id: "",
    assigned_teacher_id: null,
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  //  Local error state for drawer
  const [drawerError, setDrawerError] = useState("");

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchClasses());
    dispatch(fetchTeachersForDropdown());
  }, [dispatch]);

  const classOptions = useMemo(() => {
    return classes.map((c) => ({
      value: c.id,
      label: `${c.class_name}-${c.section}`,
    }));
  }, [classes]);

  const subjectOptions = useMemo(() => {
    const unique = [...new Set(subjects.map((s) => s.subject_name))];
    return unique.map((name) => ({ value: name, label: name }));
  }, [subjects]);

  // ─── Filtered Data ─────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = subjects;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.subject_name?.toLowerCase().includes(q) ||
          s.class_name?.toLowerCase().includes(q)
      );
    }

    if (filterClass !== "all") {
      list = list.filter((s) => s.class_section === Number(filterClass));
    }

    if (filterSubject !== "all") {
      list = list.filter((s) => s.subject_name === filterSubject);
    }

    // 🔥 NEW: Filter by Assignment Status
    if (filterAssignment === "assigned") {
      list = list.filter((s) => s.assigned_teacher !== null);
    } else if (filterAssignment === "unassigned") {
      list = list.filter((s) => s.assigned_teacher === null);
    }

    return list;
  }, [subjects, filterClass, filterSubject, filterAssignment]);

  const { currentPage, totalPages, paginatedData, goToPage, resetPage, totalItems } =
    usePagination(filtered, ITEMS_PER_PAGE);

  useEffect(() => resetPage(), [search, filterClass, filterSubject]);

  const handleAdd = () => {
    setSelectedItem(null);
    setDrawerMode("add");
    setFormData({ subject_name: "", class_section_id: "", assigned_teacher_id: null });
    setDrawerError(""); //  Clear error on open
    setIsDrawerOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setDrawerMode("edit");
    setFormData({ ...item });
    setDrawerError(""); //  Clear error on open
    setIsDrawerOpen(true);
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await dispatch(deleteSubject(deleteTarget.id)).unwrap();
        setIsDeleteDialogOpen(false);
        setDeleteTarget(null);
      } catch (error) {
        alert(error.message || "Failed to delete subject");
      }
    }
  };

  const handleSave = async () => {
    setDrawerError(""); // Clear previous error

    const payload = {
      subject_name: formData.subject_name,
      class_section: formData.class_section_id,
      assigned_teacher: formData.assigned_teacher_id || null,
    };

    try {
      if (drawerMode === "add") {
        await dispatch(createSubject(payload)).unwrap();
      } else {
        await dispatch(updateSubject({ id: formData.id, ...payload })).unwrap();
      }
      setIsDrawerOpen(false);
      setFormData({ subject_name: "", class_section_id: "", assigned_teacher_id: null });
    } catch (error) {
      //  Set local error to show in drawer
      setDrawerError(error.message || "Failed to save subject");
    }
  };

  const getClassDisplay = (id) => {
    const cls = classes.find((c) => c.id === id);
    return cls ? `${cls.class_name}-${cls.section}` : id || "—";
  };

  const getTeacherName = (id) => {
    const teacher = teachers.find((t) => t.id === id);
    return teacher ? teacher.full_name : id || "—";
  };

  const columns = [
    {
      key: "subject_name",
      label: "Subject Name",
      highlight:true,
      render: (row) => <span className="font-medium">{row.subject_name}</span>,
      mobile: { role: "title" },
    },
    {
      key: "class",
      label: "Class & Section",
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {getClassDisplay(row.class_section)}
        </span>
      ),
      mobile: { role: "detail", label: "Class" },
    },
    {
      key: "teacher",
      label: "Assigned Teacher",
      render: (row) =>
        row.assigned_teacher ? (
          <Badge tone="teacher" className="text-[10px]">
            {getTeacherName(row.assigned_teacher)}
          </Badge>
        ) : (
          <Badge color="neutral" className="text-[10px]">
            Unassigned
          </Badge>
        ),
      mobile: { role: "badge" },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex justify-start gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 rounded-lg text-[var(--color-admin-primary)] bg-[var(--color-admin-light)] hover:bg-[var(--color-admin-primary)] hover:text-white transition-colors"
            title="Edit"
          >
            <Edit size={15} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1.5 rounded-lg text-[var(--color-danger)] bg-[var(--color-danger-bg)] hover:bg-[var(--color-danger)] hover:text-white transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
      mobile: { role: "hidden" },
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border border-gray-100 min-h-[200px] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* ─── Controls + Filters ───────────────────────────────────────────── */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
        <div className="flex-1 min-w-[200px]">
          <SubjectFilters
            filterClass={filterClass}
            setFilterClass={setFilterClass}
            filterSubject={filterSubject}
            setFilterSubject={setFilterSubject}
            filterAssignment={filterAssignment}
            setFilterAssignment={setFilterAssignment}
            classOptions={classOptions}
            subjectOptions={subjectOptions}
            
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" tone="admin" size="sm" leftIcon={<Plus size={14} />} onClick={handleAdd}>
            Add Subject
          </Button>
        </div>
      </div>

      {/* ─── Table ────────────────────────────────────────────────────────── */}
      <div className=" pb-2">
        <ResponsiveTable
          columns={columns}
          data={paginatedData}
          animateRows={true}
          keyField="id"
          emptyMessage="No subjects found"
          mobileActions={(row) => (
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleEdit(row)}
                className="px-3 py-1.5 text-sm font-medium text-[var(--color-admin-primary)] bg-[var(--color-admin-light)] rounded-lg hover:bg-[var(--color-admin-light)]/70 transition-colors flex items-center gap-1.5"
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(row)}
                className="px-3 py-1.5 text-sm font-medium text-[var(--color-danger)] bg-[var(--color-danger-bg)] rounded-lg hover:bg-[var(--color-danger-bg)]/70 transition-colors flex items-center gap-1.5"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      {/* ─── Drawer ────────────────────────────────────────────────────────── */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setDrawerError(""); // 🔥 Clear error on close
        }}
        title={drawerMode === "add" ? "Add New Subject" : "Edit Subject"}
        width="max-w-[380px]"
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              tone="admin"
              fullWidth
              onClick={() => {
                setIsDrawerOpen(false);
                setDrawerError("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              tone="admin"
              fullWidth
              onClick={handleSave}
              disabled={updating}
            >
              {drawerMode === "add" ? "Add" : "Save"}
            </Button>
          </div>
        }
      >
        {/* 🔥 Error Banner inside Drawer */}
        {drawerError && (
          <div className="mb-4 p-3 bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] rounded-lg flex items-start gap-2 text-sm text-[var(--color-danger-text)]">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{drawerError}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Subject Name <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              value={formData.subject_name || ""}
              onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
              placeholder="e.g., Mathematics"
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--color-admin-primary)] focus:border-[var(--color-admin-primary)] transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Class & Section <span className="text-[var(--color-danger)]">*</span>
            </label>
            <Select
              value={formData.class_section_id || ""}
              onChange={(val) => setFormData({ ...formData, class_section_id: val || null })}
              options={classes.map((c) => ({
                value: c.id,
                label: `${c.class_name}-${c.section}`,
              }))}
              tone="admin"
              size="md"
              placeholder="Select class"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Assigned Teacher <span className="text-[var(--color-text-muted)] text-[10px] font-normal">(Optional)</span>
            </label>
            <Select
              value={formData.assigned_teacher_id || ""}
              onChange={(val) => setFormData({ ...formData, assigned_teacher_id: val || null })}
              options={[
                { value: "", label: "Unassigned" },
                ...teachers.map((t) => ({ value: t.id, label: t.full_name })),
              ]}
              tone="admin"
              size="md"
              placeholder="Select teacher"
            />
          </div>
        </div>
      </Drawer>

      {/* ─── Confirm Dialog ────────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Subject?"
        message="This action cannot be undone. Are you sure you want to delete this subject?"
        variant="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
}