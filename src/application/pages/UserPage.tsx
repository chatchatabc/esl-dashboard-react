import { useAppDispatch } from "../redux/hooks";
import { modalUpdate } from "../redux/features/modalSlice";
import { userGetAll } from "../../domain/services/userService";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserTable from "../components/tables/UserTable";
import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import { teacherGetAll } from "../../domain/services/teacherService";

export function UserPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const size = Number(searchParams.get("size") ?? "10");
  const teacherId = searchParams.get("teacherId")
    ? Number(searchParams.get("teacherId"))
    : undefined;

  const usersQuery = useQuery({
    queryKey: ["users", { page, size, teacherId }],
    queryFn: async () => {
      const data = await userGetAll({
        page,
        size,
        teacherId,
      });

      return data;
    },
  });

  const teachersQuery = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const data = await teacherGetAll({ page: 1, size: 100 });
      return data;
    },
  });

  return (
    <section className="p-4">
      {/* First section */}
      <section className="rounded-lg shadow border">
        {/* Header */}
        <header className="p-2 flex items-center">
          <h2 className="text-xl font-medium mr-auto">Users</h2>

          <button
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "user",
                  title: "Add Message",
                })
              );
            }}
            className="px-4 py-1 bg-blue-500 text-white rounded-md transition hover:bg-blue-400"
          >
            Add +
          </button>
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
            options={teachersQuery.data?.content.map((teacher) => {
              return {
                label: teacher.alias,
                value: teacher.id,
              };
            })}
            defaultValue={teacherId}
            allowClear
          />
        </section>

        {/* Table */}
        <section>
          <UserTable loading={usersQuery.isLoading} data={usersQuery.data} />
        </section>
      </section>
    </section>
  );
}

export default UserPage;
