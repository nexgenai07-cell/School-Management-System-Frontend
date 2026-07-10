// src/modules/shared/complaint/ComplaintList.jsx

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../../../components/ui/Card/Card";

import ComplaintCard from "../components/ComplaintCard";
import ComplaintFilters from "../components/ComplaintFilters";
import ComplaintDetailsModal from "../components/ComplaintDetailsModal";


import { fetchComplaints } from "../../../store/complaint/complaintThunks";

const ComplaintList = ({ role }) => {
  const dispatch = useDispatch();

  const {
    complaints = [],
    loading,
  } = useSelector(
    (state) => state.complaints
  );

  /*
  =====================================================
  Filters
  =====================================================
  */

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    type: "All",
    sort: "newest",
  });

  /*
  =====================================================
  Selected Complaint
  =====================================================
  */

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  /*
  =====================================================
  Fetch Complaints
  =====================================================
  */

  useEffect(() => {
    dispatch(fetchComplaints(role));
  }, [dispatch, role]);

  /*
  =====================================================
  Filter Change
  =====================================================
  */
const handleFilterChange = (field, value) => {
  setFilters((prev) => ({
    ...prev,
    [field]: value,
  }));
};

  /*
  =====================================================
  Filter Complaints
  =====================================================
  */

  const filteredComplaints = useMemo(() => {
    let data = [...complaints];

    // Search

    if (filters.search.trim()) {
      const keyword =
        filters.search.toLowerCase();

      data = data.filter(
        (item) =>
          item.description
            ?.toLowerCase()
            .includes(keyword) ||
          item.complaint_type
            ?.toLowerCase()
            .includes(keyword)
      );
    }

    // Status

    if (filters.status !== "All") {
      data = data.filter(
        (item) =>
          item.status === filters.status
      );
    }

    // Type

    if (filters.type !== "All") {
      data = data.filter(
        (item) =>
          item.complaint_type ===
          filters.type
      );
    }

    // Sort

    data.sort((a, b) => {
      const first = new Date(a.created_at);
      const second = new Date(b.created_at);

      return filters.sort === "newest"
        ? second - first
        : first - second;
    });

    return data;
  }, [complaints, filters]);

  /*
  =====================================================
  Refresh
  =====================================================
  */

  const handleRefresh = () => {
    dispatch(fetchComplaints(role));
  };

  return (
    <>
      <Card hover={false} tone={role}>
        {/* ==========================================
            Header
        ========================================== */}

        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Complaint History
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            View and track your submitted complaints.
          </p>
        </div>

        {/* ==========================================
            Filters
        ========================================== */}

        <ComplaintFilters
          role={role}
          filters={filters}
          onChange={handleFilterChange}
          onRefresh={handleRefresh}
        />

        {/* ==========================================
            Complaint List
        ========================================== */}

        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center">
              Loading complaints...
            </div>
          ) : filteredComplaints.length === 0 ? (
             <div className="py-12 text-center">
              No complaints found. Try adjusting your filters or submit a new complaint.
            </div>
          ) : (
            filteredComplaints.map(
              (complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  role={role}
                  onView={() =>
                    setSelectedComplaint(
                      complaint
                    )
                  }
                />
              )
            )
          )}
        </div>
      </Card>

      {/* ==========================================
          Details Modal
      ========================================== */}

      <ComplaintDetailsModal
        open={Boolean(selectedComplaint)}
        complaint={selectedComplaint}
        role={role}
        onClose={() =>
          setSelectedComplaint(null)
        }
      />
    </>
  );
};

export default ComplaintList;