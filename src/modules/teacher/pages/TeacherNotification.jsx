import Notification from "../../common_pages/pages/Notification";
import useForceLightMode from '../../../utils/useForceLightMode';
const TeacherNotification = () => {
  useForceLightMode();
  return <Notification role="teacher" />;
};

export default TeacherNotification;