import Complaint from "../../common_pages/pages/Complaint";
import useForceLightMode from '../../../utils/useForceLightMode';
const TeacherComplaint = () => {
  useForceLightMode();
  return <Complaint role="teacher" />;
};

export default TeacherComplaint;