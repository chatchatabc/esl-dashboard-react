import { useSearchParams } from "react-router-dom";
import { modalUpdate } from "../stores/app/modalSlice";
import { useAppDispatch } from "../stores/hooks";
import { useQuery } from "@tanstack/react-query";
import { studentGetAll } from "../../domain/services/studentService";
import StudentTable from "../components/tables/StudentTable";
import { userGetProfile } from "../../domain/services/userService";

export function StudentPage() {
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

  const studentsQuery = useQuery({
    queryKey: ["students", { page, size }],
    queryFn: async () => {
      const data = await studentGetAll({
        page,
        size,
      });

      return data;
    },
  });

  return (
    <section className="p-4">
      {/* First section */}
      <section className="border rounded-lg shadow">
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
            >
              Add +
            </button>
          )}
        </header>

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
