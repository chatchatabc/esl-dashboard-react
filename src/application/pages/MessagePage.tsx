import { messageGetAll } from "../../domain/services/messageService";
import DynamicTable from "../components/DynamicTable";
import { modalUpdate } from "../redux/features/modalSlice";
import { useAppDispatch } from "../redux/hooks";
import { Message } from "../../../../esl-workers/src/domain/models/MessageModel";
import { ColumnsType } from "antd/es/table";
import { utilFormatDateAndTime } from "../../domain/services/utilService";

function MessagePage() {
  const dispatch = useAppDispatch();
  const statusLabel = {
    1: "Active",
    2: "Sent",
    3: "Failed",
  };
  const statusColor = {
    1: "text-blue-500",
    2: "text-green-500",
    3: "text-red-500",
  };

  const columns: ColumnsType<Message> = [
    {
      key: "message",
      title: "Message Template",
      render: (record: Message) => {
        let message = record.messageTemplate?.message;
        const templateValues = JSON.parse(
          record.templateValues ?? "{}"
        ) as Record<string, any>;

        Object.keys(templateValues).forEach((key) => {
          const value = templateValues[key];
          message = message?.replace(`#${key}#`, value);
        });

        return <p>{message}</p>;
      },
    },
    {
      key: "user",
      title: "User",
      render: (record: Message) => {
        if (record.user) {
          return (
            <p>
              {record.user.firstName} {record.user.lastName} ({record.phone})
            </p>
          );
        }
        return <p>{record.phone}</p>;
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
    {
      key: "status",
      title: "Status",
      render: (record: Message) => {
        const label = statusLabel[record.status as keyof typeof statusLabel];
        const color = statusColor[record.status as keyof typeof statusColor];
        return <p className={color}>{label}</p>;
      },
    },
    {
      key: "action",
      title: "Actions",
      render: (_: Message) => {
        return <div>Edit</div>;
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
