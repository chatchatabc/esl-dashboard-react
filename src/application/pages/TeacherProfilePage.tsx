import { teacherGet } from "../../domain/services/teacherService";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { utilFormatDateAndTime } from "../../domain/services/utilService";
import { useAppDispatch } from "../stores/hooks";
import { modalUpdate } from "../stores/app/modalSlice";
import { useQuery } from "@tanstack/react-query";
import { courseGetAll } from "../../domain/services/courseService";
import React from "react";
import { authGetProfile } from "../../domain/services/authService";
import TeacherScheduleList from "../components/teachers/TeacherScheduleList";
import { scheduleGetAll } from "../../domain/services/scheduleService";
import { Schedule } from "../../../../esl-backend-workers/src/domain/models/ScheduleModel";
import { Booking } from "../../../../esl-backend-workers/src/domain/models/BookingModel";
import { bookingGetAll } from "../../domain/services/bookingService";

const TeacherSchedule = React.lazy(
  () => import("../components/teachers/TeacherSchedule")
);
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

  const userQuery = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      const data = await authGetProfile();
      return data;
    },
  });
  const teacherQuery = useQuery({
    queryKey: ["teachers", { username }],
    queryFn: async () => {
      const data = await teacherGet({ userUsername: username });
      return data;
    },
  });
  const coursesQuery = useQuery({
    queryKey: [
      "courses",
      { ...coursesFilters, teacherId: teacherQuery.data?.id },
    ],
    queryFn: async () => {
      const teacherId = teacherQuery.data?.id;
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
  const bookingsQuery = useQuery({
    queryKey: [
      "bookings",
      {
        teacherId: teacherQuery.data?.id,
        page: 1,
        size: 10000,
        status: [1, 2, 3, 5],
        start: calendarDate.getTime(),
        end: calendarDate.getTime() + 7 * 24 * 60 * 60 * 1000,
      },
    ],
    queryFn: async () => {
      const data = await bookingGetAll({
        teacherId: teacherQuery.data?.id,
        page: 1,
        size: 10000,
        status: [1, 2, 3, 5],
        start: calendarDate.getTime(),
        end: calendarDate.getTime() + 7 * 24 * 60 * 60 * 1000,
      });
      return data?.content ?? ([] as Booking[]);
    },
  });
  const schedulesQuery = useQuery({
    queryKey: [
      "schedules",
      {
        teacherId: teacherQuery.data?.id,
        page: 1,
        size: 10000,
      },
    ],
    queryFn: async () => {
      const data = await scheduleGetAll({
        teacherId: teacherQuery.data?.id,
        page: 1,
        size: 10000,
      });
      return data?.content ?? ([] as Schedule[]);
    },
  });

  // Update calendar date on first load
  React.useEffect(() => {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() - now.getUTCDay());
    setCalendarDate(now);
  }, []);

  if (teacherQuery.isLoading) {
    return (
      <div className="flex-1 py-24">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!teacherQuery.data) {
    return (
      <div className="flex-1 py-24">
        <NotFoundPage />
      </div>
    );
  }

  return (
    <section className="p-4 space-y-4">
      {/* Teacher Information */}
      <section className="border shadow rounded-lg">
        <header className="p-2 border-b-2 flex items-center">
          <h2 className="text-xl font-medium mr-auto">Teacher's Profile</h2>

          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400">
            Edit
          </button>
        </header>

        <section className="flex flex-wrap">
          {/* Alias */}
          <section className="p-2 w-1/4">
            <header>
              <h3 className="text-xs font-bold">Alias</h3>
            </header>

            <section>
              <p>{teacherQuery.data.alias}</p>
            </section>
          </section>

          {/* Username */}
          <section className="p-2 w-1/4">
            <header>
              <h3 className="text-xs font-bold">Username</h3>
            </header>

            <section>
              <p>{teacherQuery.data.user!.username}</p>
            </section>
          </section>

          {/* Created At */}
          <section className="p-2 w-1/4">
            <header>
              <h3 className="text-xs font-bold">Teacher since</h3>
            </header>

            <section>
              <p>
                {utilFormatDateAndTime(
                  "en-US",
                  new Date(teacherQuery.data.createdAt)
                )}
              </p>
            </section>
          </section>
        </section>
      </section>

      {/* Teacher Courses */}
      {userQuery.data?.roleId !== 2 && (
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
                      data: { teacherId: teacherQuery.data?.id },
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
                data={coursesQuery.data}
                pagination={{
                  onChange: (page, size) => {
                    setCoursesFilters({ page, size });
                  },
                }}
              />
            </section>
          </section>

          {/* Teacher Schedule */}
          <section className="border shadow rounded-lg">
            <TeacherSchedule
              bookings={bookingsQuery.data ?? []}
              schedules={schedulesQuery.data ?? []}
              loading={bookingsQuery.isLoading || schedulesQuery.isLoading}
              calendarDate={calendarDate}
              setCalendarDate={setCalendarDate}
              teacherId={teacherQuery.data.id}
            />
          </section>
        </>
      )}

      {userQuery.data?.roleId === 2 && (
        <section className="border overflow-hidden shadow rounded-lg">
          <header className="p-2 flex items-center">
            <h2 className="text-xl my-1.5 font-medium mr-auto">
              Teacher's Schedule List
            </h2>
          </header>

          <section>
            <TeacherScheduleList
              schedules={schedulesQuery.data}
              bookings={bookingsQuery.data}
              calendarDate={calendarDate}
            />
          </section>
        </section>
      )}
    </section>
  );
}

export default TeacherProfilePage;
