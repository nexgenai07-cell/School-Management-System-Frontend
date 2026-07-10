import Settings from "../../common_pages/pages/Settings";
import useForceLightMode from '../../../utils/useForceLightMode';
const TeacherSettings = () => {
  useForceLightMode();
  return <Settings role="teacher" />;
};

export default TeacherSettings;