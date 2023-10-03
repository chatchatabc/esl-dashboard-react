import { teacherGet } from "../../domain/services/teacherService";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { useAppDispatch } from "../stores/hooks";
import { modalUpdate } from "../stores/app/modalSlice";
import { useQuery } from "@tanstack/react-query";
import { courseGetAll } from "../../domain/services/courseService";
import React from "react";
import TeacherScheduleList from "../components/teachers/TeacherScheduleList";
import { scheduleGetAll } from "../../domain/services/scheduleService";
import { Schedule } from "../../../../esl-backend-workers/src/domain/models/ScheduleModel";
import { Booking } from "../../../../esl-backend-workers/src/domain/models/BookingModel";
import { bookingGetAll } from "../../domain/services/bookingService";
import { userGetProfile } from "../../domain/services/userService";
import TeacherCalendar from "../components/teachers/TeacherCalendar";

const TeacherCourseTable = React.lazy(
  () => import("../components/tables/TeacherCourseTable")
);

export function TeacherProfilePage() {
  const dispatch = useAppDispatch();
  const { username = "" } = useParams();
  const [coursesFilters, setCoursesFilters] = React.useState({
    page: 1,
    size: 10,
  });
  const [calendarDate, setCalendarDate] = React.useState(new Date(0));

  const { data: user } = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      const data = await userGetProfile();
      return data;
    },
  });
  const { data: teacher, isLoading: teacherLoading } = useQuery({
    queryKey: ["teachers", { username }],
    queryFn: async () => {
      const data = await teacherGet({ userUsername: username });
      return data;
    },
  });
  const { data: courses } = useQuery({
    queryKey: ["courses", { ...coursesFilters, teacherId: teacher?.id }],
    queryFn: async () => {
      const teacherId = teacher?.id;
      if (!teacherId) {
        return null;
      }

      const data = await courseGetAll({
        ...coursesFilters,
        teacherId,
      });
      return data;
    },
  });
  const { data: bookings } = useQuery({
    queryKey: [
      "bookings",
      "calendar",
      {
        teacherId: teacher?.id,
        start: calendarDate.getTime() - 6 * 1000 * 60 * 60 * 24,
        end: calendarDate.getTime() + 37 * 1000 * 60 * 60 * 24,
      },
    ],
    queryFn: async () => {
      const data = await bookingGetAll({
        teacherId: teacher?.id,
        page: 1,
        size: 10000,
        status: [1, 2, 3, 5],
        start: calendarDate.getTime() - 6 * 1000 * 60 * 60 * 24,
        end: calendarDate.getTime() + 37 * 1000 * 60 * 60 * 24,
      });
      return data?.content ?? ([] as Booking[]);
    },
  });
  const { data: schedules } = useQuery({
    queryKey: ["schedules", "content", { teacherId: teacher?.id }],
    queryFn: async () => {
      const data = await scheduleGetAll({
        teacherId: teacher?.id,
        page: 1,
        size: 10000,
      });
      return data?.content ?? ([] as Schedule[]);
    },
    enabled: !!teacher?.id,
  });

  // Update calendar date on first load
  React.useEffect(() => {
    const now = new Date();
    now.setUTCFullYear(now.getUTCFullYear(), now.getUTCMonth(), 1);
    setCalendarDate(now);
  }, []);

  if (teacherLoading) {
    return (
      <div className="flex-1 py-24">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex-1 py-24">
        <NotFoundPage />
      </div>
    );
  }

  return (
    <section className="p-4 space-y-4">
      {/* Teacher's Profile Information */}
      <section className="border rounded-lg shadow">
        <header className="p-2 flex items-center border-b">
          <h2 className="text-xl font-medium mr-auto">Teacher's Profile</h2>

          <button
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "user",
                  data: teacher?.user,
                  title: "Edit profile",
                })
              );
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
          >
            Edit
          </button>
        </header>

        <section className="p-2 flex flex-wrap gap-y-2">
          {/* Nickname */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Nickname</h3>
            </header>

            <section>
              <p>{teacher?.user.alias}</p>
            </section>
          </section>

          {/* First name */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">First name</h3>
            </header>

            <section>
              <p>{teacher?.user.firstName ?? "NULL"}</p>
            </section>
          </section>

          {/* Last Name */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Last name</h3>
            </header>

            <section>
              <p>{teacher?.user.lastName ?? "NULL"}</p>
            </section>
          </section>

          {/* Phone */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Phone</h3>
            </header>

            <section>
              <p>{teacher?.user.phone ?? "NULL"}</p>
            </section>
          </section>

          {/* Role */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Roles</h3>
            </header>

            <section>
              <p>{teacher?.user.role?.name}</p>
            </section>
          </section>
        </section>
      </section>

      {/* Teacher Courses */}
      {user?.roleId !== 2 && (
        <>
          <section className="border shadow rounded-lg">
            <header className="p-2 border-b-2 flex items-center">
              <h2 className="text-xl font-medium mr-auto">Teacher's Courses</h2>

              <button
                onClick={() => {
                  dispatch(
                    modalUpdate({
                      show: true,
                      content: "course",
                      title: "Add Course",
                      data: { teacherId: teacher.id },
                    })
                  );
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
              >
                Add +
              </button>
            </header>
            <section>
              <TeacherCourseTable
                data={courses}
                pagination={{
                  onChange: (page, size) => {
                    setCoursesFilters({ page, size });
                  },
                }}
              />
            </section>
          </section>

          <TeacherCalendar teacherId={teacher.id} />
        </>
      )}

      {user?.roleId === 2 && (
        <section className="border overflow-hidden shadow rounded-lg">
          <header className="p-2 flex items-center">
            <h2 className="text-xl my-1.5 font-medium mr-auto">
              Teacher's Schedule List
            </h2>
          </header>

          <section>
            <TeacherScheduleList
              schedules={schedules ?? []}
              bookings={bookings ?? []}
              calendarDate={calendarDate}
            />
          </section>
        </section>
      )}
    </section>
  );
}

export default TeacherProfilePage;
