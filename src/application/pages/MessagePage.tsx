import { modalUpdate } from "../redux/features/modalSlice";
import { useAppDispatch } from "../redux/hooks";
import MessageTable from "../components/tables/MessageTable";
import { useQuery } from "@tanstack/react-query";
import { messageGetAll } from "../../domain/services/messageService";
import { useSearchParams } from "react-router-dom";

function MessagePage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const size = Number(searchParams.get("size") ?? "10");

  const messagesQuery = useQuery({
    queryKey: ["messages", { page, size }],
    queryFn: async () => {
      const data = await messageGetAll({ page, size });
      return data;
    },
  });

  return (
    <section className="p-4">
      {/* First section */}
      <section className="rounded-lg overflow-hidden shadow border">
        {/* Header */}
        <header className="p-2 flex items-center">
          <h2 className="text-xl font-medium mr-auto">Messages</h2>

          <button
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "message",
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
          <MessageTable
            loading={messagesQuery.isLoading}
            data={messagesQuery.data}
          />
        </section>
      </section>
    </section>
  );
}

export default MessagePage;
