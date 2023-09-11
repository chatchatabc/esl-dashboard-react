import { useAppDispatch } from "../redux/hooks";
import { modalUpdate } from "../redux/features/modalSlice";
import { userGetAll } from "../../domain/services/userService";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import UserTable from "../components/tables/UserTable";
import { QueryClient } from "@tanstack/react-query";
import { CommonContent } from "../../../../esl-workers/src/domain/models/CommonModel";
import { User } from "../../domain/models/UserModel";

export default function UserPage() {
  const dispatch = useAppDispatch();
  const data = useLoaderData() as CommonContent<User>;

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
          <UserTable data={data} />
        </section>
      </section>
    </section>
  );
}

export async function userLoader(
  { request }: LoaderFunctionArgs,
  queryClient: QueryClient
) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");
  const size = Number(url.searchParams.get("size") ?? "10");

  let data = queryClient.getQueryData(["users", { page, size }]);

  if (!data) {
    data = await queryClient.fetchQuery({
      queryKey: ["users", { page, size }],
      queryFn: async () => {
        return await userGetAll({
          page,
          size,
        });
      },
    });
  }

  return data;
}
