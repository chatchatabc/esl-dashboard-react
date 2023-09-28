import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../stores/hooks";
import { modalUpdate } from "../stores/app/modalSlice";
import NotFoundPage from "./NotFoundPage";
import { studentGetByUser } from "../../domain/services/studentService";

function StudentProfilePage() {
  const { username = "" } = useParams();
  const dispatch = useAppDispatch();

  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ["students", { username }],
    queryFn: async () => {
      const data = await studentGetByUser({ username });
      return data;
    },
  });

  if (studentLoading) {
    return (
      <div className="flex-1 py-24">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return <NotFoundPage />;
  }

  return (
    <section className="p-4 space-y-4">
      {/* Profile Information */}
      <section className="border rounded-lg shadow">
        <header className="p-2 flex items-center border-b">
          <h2 className="text-xl font-medium mr-auto">Profile Information</h2>

          <button
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "student",
                  data: student,
                  title: "Edit Student",
                })
              );
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400"
          >
            Edit
          </button>
        </header>

        <section className="p-2 flex flex-wrap gap-y-2">
          {/* Username */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Student Nickname</h3>
            </header>

            <section>
              <p>{student.alias}</p>
            </section>
          </section>

          {/* First name */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">First name</h3>
            </header>

            <section>
              <p>{student.user.firstName ?? "NULL"}</p>
            </section>
          </section>

          {/* Last Name */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Last name</h3>
            </header>

            <section>
              <p>{student.user.lastName ?? "NULL"}</p>
            </section>
          </section>

          {/* Phone */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Phone</h3>
            </header>

            <section>
              <p>{student.user.phone ?? "NULL"}</p>
            </section>
          </section>

          {/* Credit */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Credits</h3>
            </header>

            <section>
              <p>{student.user.credits}点</p>
            </section>
          </section>

          {/* Role */}
          <section className="w-1/4">
            <header>
              <h3 className="text-xs font-bold">Roles</h3>
            </header>

            <section>
              <p>{student.user.role?.name}</p>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
}

export default StudentProfilePage;
