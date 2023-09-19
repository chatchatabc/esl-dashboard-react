import { teacherGet } from "../../domain/services/teacherService";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { utilFormatDateAndTime } from "../../domain/services/utilService";
import TeacherSchedule from "../components/TeacherSchedule";
import TeacherCourseTable from "../components/tables/TeacherCourseTable";
import { useAppDispatch } from "../redux/hooks";
import { modalUpdate } from "../redux/features/modalSlice";
import { useQuery } from "@tanstack/react-query";
import { courseGetAll } from "../../domain/services/courseService";
import React from "react";
import { authGetProfile } from "../../domain/services/authService";

function TeacherProfilePage() {
  const dispatch = useAppDispatch();
  const { username = "" } = useParams();
  const [coursesFilters, setCoursesFilters] = React.useState({
    page: 1,
    size: 10,
  });

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
            <TeacherSchedule teacherId={teacherQuery.data?.id} />
          </section>
        </>
      )}
    </section>
  );
}

export default TeacherProfilePage;
