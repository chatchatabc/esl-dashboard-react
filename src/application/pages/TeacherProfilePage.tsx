import React from "react";
import { teacherGetByUser } from "../../domain/services/teacherService";
import { userGetByUsername } from "../../domain/services/userService";
import { useParams } from "react-router-dom";
import { User } from "../../../../esl-workers/src/domain/models/UserModel";
import { Teacher } from "../../../../esl-workers/src/domain/models/TeacherModel";
import NotFoundPage from "./NotFoundPage";
import { utilFormatDateAndTime } from "../../domain/services/utilService";
import TeacherSchedule from "../components/TeacherSchedule";

function TeacherProfilePage() {
  const { username = "" } = useParams();

  const [loading, setLoading] = React.useState(true);
  const [teacher, setTeacher] = React.useState<Teacher | null>(null);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    if (loading) {
      (async () => {
        const resUser = await userGetByUsername({ username });
        setUser(resUser);
        if (resUser) {
          const resTeacher = await teacherGetByUser({ userId: resUser.id });
          setTeacher(resTeacher);
        }

        setLoading(false);
      })();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex-1 py-24">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!user || !teacher) {
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
          <h2 className="text-xl font-medium mr-auto">Teachers Profile</h2>

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
              <p>{teacher.alias}</p>
            </section>
          </section>

          {/* Username */}
          <section className="p-2 w-1/4">
            <header>
              <h3 className="text-xs font-bold">Username</h3>
            </header>

            <section>
              <p>{user.username}</p>
            </section>
          </section>

          {/* Price */}
          <section className="p-2 w-1/4">
            <header>
              <h3 className="text-xs font-bold">Price</h3>
            </header>

            <section>
              <p>{teacher.price}</p>
            </section>
          </section>

          {/* Created At */}
          <section className="p-2 w-1/4">
            <header>
              <h3 className="text-xs font-bold">Teacher since</h3>
            </header>

            <section>
              <p>
                {utilFormatDateAndTime("en-US", new Date(teacher.createdAt))}
              </p>
            </section>
          </section>
        </section>
      </section>

      {/* Teacher Schedule */}
      <section className="border shadow rounded-lg">
        <TeacherSchedule teacherId={teacher.id} />
      </section>
    </section>
  );
}

export default TeacherProfilePage;
