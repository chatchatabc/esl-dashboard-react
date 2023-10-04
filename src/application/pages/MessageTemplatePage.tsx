import { useAppDispatch } from "../stores/hooks";
import { modalUpdate } from "../stores/app/modalSlice";
import MessageTemplateTable from "../components/tables/MessageTemplateTable";
import { useQuery } from "@tanstack/react-query";
import { messageTemplateGetAll } from "../../domain/services/messageTemplateService";
import { useSearchParams } from "react-router-dom";

export function MessageTemplatePage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const size = Number(searchParams.get("size") ?? "10");

  const messageTemplatesQuery = useQuery({
    queryKey: ["messageTemplates", { page, size }],
    queryFn: async () => {
      const res = await messageTemplateGetAll({});
      return res;
    },
  });

  return (
    <section className="p-4">
      {/* First section */}
      <section className="rounded-lg shadow border border-primary shadow-accent bg-white overflow-hidden">
        {/* Header */}
        <header className="p-2 flex items-center">
          <h2 className="text-xl font-medium mr-auto">Message Templates</h2>

          <button
            onClick={() => {
              dispatch(
                modalUpdate({
                  show: true,
                  content: "messageTemplate",
                  title: "Add Message Template",
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
          <MessageTemplateTable data={messageTemplatesQuery.data} />
        </section>
      </section>
    </section>
  );
}

export default MessageTemplatePage;
