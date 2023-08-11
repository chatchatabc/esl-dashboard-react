import { messageGetAll } from "../../domain/services/messageService";
import DynamicTable from "../components/DynamicTable";
import { modalUpdate } from "../redux/features/modalSlice";
import { useAppDispatch } from "../redux/hooks";
import { Message } from "../../../../esl-workers/src/domain/models/MessageModel";
import { ColumnsType } from "antd/es/table";
import { utilFormatDateAndTime } from "../../domain/services/utilService";

function MessagePage() {
  const dispatch = useAppDispatch();

  const columns: ColumnsType<Message> = [
    {
      key: "message",
      dataIndex: "message",
      title: "Message",
    },
    {
      key: "receiver",
      title: "Receiver",
      render: (record: Message) => {
        return (
          <p>
            {record.receiver?.firstName} {record.receiver?.lastName} |{" "}
            {record.receiver?.phone}
          </p>
        );
      },
    },
    {
      key: "sender",
      title: "Sender",
      render: (record: Message) => {
        return (
          <p>
            {record.sender?.firstName} {record.sender?.lastName}
          </p>
        );
      },
    },
    {
      key: "sendAt",
      title: "Send at",
      render: (record: Message) => {
        const date = new Date(record.sendAt ?? 0);
        return <p>{utilFormatDateAndTime("en-US", date)}</p>;
      },
    },
  ];

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
          <DynamicTable columns={columns} getData={messageGetAll} />
        </section>
      </section>
    </section>
  );
}

export default MessagePage;
