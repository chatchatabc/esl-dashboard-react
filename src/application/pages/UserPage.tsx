import { useAppDispatch } from "../redux/hooks";
import { modalUpdate } from "../redux/features/modalSlice";
import { userGetAll } from "../../domain/services/userService";
import { useSearchParams } from "react-router-dom";
import UserTable from "../components/tables/UserTable";
import { useQuery } from "@tanstack/react-query";

export default function UserPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const size = Number(searchParams.get("size") ?? "10");

  const userQuery = useQuery({
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md transition hover:bg-blue-400"
          >
            Add +
          </button>
        </header>

        {/* Table */}
        <section>
          <UserTable loading={userQuery.isLoading} data={userQuery.data} />
        </section>
      </section>
    </section>
  );
}
