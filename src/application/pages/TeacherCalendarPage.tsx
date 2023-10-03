import { useQuery } from "@tanstack/react-query";
import TeacherCalendar from "../components/teachers/TeacherCalendar";
import { userGetProfile } from "../../domain/services/userService";
import { teacherGet } from "../../domain/services/teacherService";

function TeacherCalendarPage() {
  const { data: user } = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      const res = await userGetProfile();
      return res;
    },
  });
  const { data: teacher } = useQuery({
    queryKey: ["teachers", { userUsername: user?.username }],
    queryFn: async () => {
      if (!user) return null;
      const res = await teacherGet({ userUsername: user?.username });
      return res;
    },
    enabled: !!user,
  });

  return (
    <div className="p-4">
      <TeacherCalendar teacherId={teacher?.id ?? 0} />
    </div>
  );
}

export default TeacherCalendarPage;
