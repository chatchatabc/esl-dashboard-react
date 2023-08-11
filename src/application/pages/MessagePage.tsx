import { messageGetAll } from "../../domain/services/messageService";
import DynamicTable from "../components/DynamicTable";
import { modalUpdate } from "../redux/features/modalSlice";
import { useAppDispatch } from "../redux/hooks";

function MessagePage() {
  const dispatch = useAppDispatch();

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
          <DynamicTable getData={messageGetAll} />
        </section>
      </section>
    </section>
  );
}

export default MessagePage;
