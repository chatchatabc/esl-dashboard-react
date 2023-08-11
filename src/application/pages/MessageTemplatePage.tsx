import DynamicTable from "../components/DynamicTable";
import { messageTemplateGetAll } from "../../domain/services/messageTemplateService";
import { ColumnsType } from "antd/es/table";
import { MessageTemplate } from "../../../../esl-workers/src/domain/models/MessageModel";
import { Button } from "antd";
import { useAppDispatch } from "../redux/hooks";
import { modalUpdate } from "../redux/features/modalSlice";

function MessageTemplatePage() {
  const dispatch = useAppDispatch();

  const statusLabel = {
    1: "Pending",
    2: "Approved",
    3: "Rejected",
  };
  const statusColor = {
    1: "text-yellow-500",
    2: "text-green-500",
    3: "text-red-500",
  };

  const columns: ColumnsType<MessageTemplate> = [
    {
      key: "title",
      dataIndex: "title",
      title: "Title",
    },
    {
      key: "message",
      title: "Message",
      render: (record: MessageTemplate) => {
        return (
          <p>
            【{record.signature}】{record.message}
          </p>
        );
      },
    },
    {
      key: "status",
      title: "Status",
      render: (record: MessageTemplate) => {
        return (
          <p
            className={`${
              statusColor[record.status as keyof typeof statusColor]
            }`}
          >
            {statusLabel[record.status as keyof typeof statusLabel]}
          </p>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: (record: MessageTemplate) => {
        return (
          <div className="flex space-x-2">
            <Button disabled={record.status !== 1} type="link" size="small">
              Verify
            </Button>

            <Button disabled={record.status === 2} type="link" size="small">
              Edit
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <section className="p-4">
      {/* First section */}
      <section className="rounded-lg overflow-hidden shadow border">
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md transition hover:bg-blue-400"
          >
            Add +
          </button>
        </header>

        {/* Table */}
        <section>
          <DynamicTable getData={messageTemplateGetAll} columns={columns} />
        </section>
      </section>
    </section>
  );
}

export default MessageTemplatePage;
