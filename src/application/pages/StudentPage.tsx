import { useNavigate, useSearchParams } from "react-router-dom";
import { modalUpdate } from "../stores/app/modalSlice";
import { useAppDispatch } from "../stores/hooks";
import { useQuery } from "@tanstack/react-query";
import { studentGetAll } from "../../domain/services/studentService";
import StudentTable from "../components/tables/StudentTable";
import { userGetProfile } from "../../domain/services/userService";
import { Select } from "antd";
import { teacherGetAll } from "../../domain/services/teacherService";

export function StudentPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const size = Number(searchParams.get("size") ?? "10");
  const teacherId = searchParams.get("teacherId")
    ? Number(searchParams.get("teacherId"))
    : undefined;

  const userQuery = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      const data = await userGetProfile();
      return data;
    },
  });

  const studentsQuery = useQuery({
    queryKey: ["students", { page, size, teacherId }],
    queryFn: async () => {
      const data = await studentGetAll({
        page,
        size,
        teacherId,
      });
      return data;
    },
  });

  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers", "content"],
    queryFn: async () => {
      const data = await teacherGetAll({ page: 1, size: 10000 });
      return data?.content;
    },
  });

  return (
    <section className="p-4">
      {/* First section */}
      <section className="rounded-lg shadow border border-primary shadow-accent bg-white overflow-hidden">
        <header className="p-2 flex items-center">
          <h2 className="text-xl font-medium mr-auto my-2">Students</h2>
          {userQuery.data?.roleId === 1 && (
            <button
              onClick={() => {
                dispatch(
                  modalUpdate({
                    show: true,
                    title: "Add Student",
                    content: "student",
                  })
                );
              }}
              className="px-4 py-2 bg-primary text-white rounded-md transition hover:opacity-80"
            >
              Add +
            </button>
          )}
        </header>

        <section className="border-t flex p-4 gap-2 flex-wrap">
          <Select
            className="w-56"
            placeholder="Teachers"
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              if (e) {
                params.set("teacherId", e.toString());
              } else {
                params.delete("teacherId");
              }
              navigate(`?${params.toString()}`);
            }}
            options={teachers?.map((teacher) => {
              return {
                label: teacher.alias,
                value: teacher.id,
              };
            })}
            defaultValue={teacherId}
            loading={teachersLoading}
            allowClear
          />
        </section>

        <section>
          <StudentTable
            loading={studentsQuery.isLoading}
            data={studentsQuery.data}
          />
        </section>
      </section>
    </section>
  );
}

export default StudentPage;
