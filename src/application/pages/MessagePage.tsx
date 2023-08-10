import { messageGetAll } from "../../domain/services/messageService";
import DynamicTable from "../components/DynamicTable";

function MessagePage() {
  return (
    <section className="p-4">
      {/* First section */}
      <section className="rounded-lg overflow-hidden shadow border">
        {/* Header */}
        <header className="p-2 flex items-center">
          <h2 className="text-xl font-medium mr-auto">Messages</h2>

          <button className="px-4 py-2 bg-blue-500 text-white rounded-md transition hover:bg-blue-400">
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
