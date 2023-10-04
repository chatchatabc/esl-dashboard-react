import { useAppDispatch } from "../stores/hooks";
import { modalUpdate } from "../stores/app/modalSlice";
import { userGetAll } from "../../domain/services/userService";
import { useSearchParams } from "react-router-dom";
import UserTable from "../components/tables/UserTable";
import { useQuery } from "@tanstack/react-query";

export function UserPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const size = Number(searchParams.get("size") ?? "10");

  const usersQuery = useQuery({
    queryKey: ["users", { page, size }],
    queryFn: async () => {
      const data = await userGetAll({
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
        {/* Header */}
        <header className="p-2 flex items-center">
          <h2 className="text-xl font-bold mr-auto">Users</h2>

          <button
            data-user-add-button
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "user",
                  title: "Add user",
                })
              );
            }}
            className="px-4 py-2 bg-primary text-white rounded-md transition hover:opacity-80"
          >
            Add +
          </button>
        </header>

        {/* Table */}
        <section>
          <UserTable loading={usersQuery.isLoading} data={usersQuery.data} />
        </section>
      </section>
    </section>
  );
}

export default UserPage;
