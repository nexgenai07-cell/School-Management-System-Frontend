// src/modules/shared/complaint/Complaint.jsx

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchComplaints } from "../../../store/complaint/complaintThunks";

import ComplaintHeader from "../components/ComplaintHeader";
import ComplaintStats from "../components/ComplaintStats";
import ComplaintForm from "../components/ComplaintForm";
import ComplaintList from "../components/ComplaintList";

const Complaint = ( {role }) => {
    console.log("Complaint component role:", role);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchComplaints(role));
  }, [dispatch, role]);

  return (
    <div className="mx-auto max-w-full space-y-6">
      {/* Header */}

      <ComplaintHeader role={role}/>

      {/* Stats */}

      <ComplaintStats role={role}/>

      {/* Main Content */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left */}

        <div className="xl:col-span-4">
          <ComplaintForm role={role} />
        </div>

        {/* Right */}

        <div className="xl:col-span-8">
          <ComplaintList role={role} />
        </div>
      </div>
    </div>
  );
};

export default Complaint;