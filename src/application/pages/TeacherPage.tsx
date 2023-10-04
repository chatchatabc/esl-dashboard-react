import { useSearchParams } from "react-router-dom";
import TeacherTable from "../components/tables/TeacherTable";
import { modalUpdate } from "../stores/app/modalSlice";
import { useAppDispatch } from "../stores/hooks";
import { useQuery } from "@tanstack/react-query";
import { teacherGetAll } from "../../domain/services/teacherService";
import { userGetProfile } from "../../domain/services/userService";

export function TeacherPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const size = Number(searchParams.get("size") ?? "10");

  const userQuery = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      const data = await userGetProfile();
      return data;
    },
  });

  const teacherQuery = useQuery({
    queryKey: ["teachers", { page, size }],
    queryFn: async () => {
      const data = await teacherGetAll({
        page,
        size,
      });

      return data;
    },
  });

  return (
    <section className="p-4">
      {/* First section */}
      <section className="rounded-lg shadow border border-primary shadow-accent bg-white overflow-hidden">
        <header className="p-2 flex items-center">
          <h2 className="text-xl font-medium mr-auto my-2">Teachers</h2>
          {userQuery.data?.roleId === 1 && (
            <button
              onClick={() => {
                dispatch(
                  modalUpdate({
                    show: true,
                    title: "Add Teacher",
                    content: "teacher",
                  })
                );
              }}
              className="px-4 py-2 bg-primary text-white rounded-md transition hover:opacity-80"
            >
              Add +
            </button>
          )}
        </header>

        <section>
          <TeacherTable
            loading={teacherQuery.isLoading}
            data={teacherQuery.data}
          />
        </section>
      </section>
    </section>
  );
}

export default TeacherPage;
