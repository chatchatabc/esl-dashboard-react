import { useSearchParams } from "react-router-dom";
import TeacherTable from "../components/tables/TeacherTable";
import { modalUpdate } from "../redux/features/modalSlice";
import { useAppDispatch } from "../redux/hooks";
import { useQuery } from "@tanstack/react-query";
import { teacherGetAll } from "../../domain/services/teacherService";

function TeacherPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const size = Number(searchParams.get("size") ?? "10");

  const teacherQuery = useQuery({
    queryKey: ["users", { page, size }],
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
      <section className="border rounded-lg shadow">
        <header className="p-2 flex items-center">
          <h2 className="text-xl font-medium mr-auto">Teachers</h2>
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
          >
            Add +
          </button>
        </header>

        <section>
          <TeacherTable data={teacherQuery.data} />
        </section>
      </section>
    </section>
  );
}

export default TeacherPage;
