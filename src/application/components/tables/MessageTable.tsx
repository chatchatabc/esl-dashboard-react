import { useAppDispatch } from "../../stores/hooks";
import { Table, TableProps } from "antd";
import { CommonContent } from "../../../../../esl-workers/src/domain/models/CommonModel";
import { Message } from "../../../../../esl-workers/src/domain/models/MessageModel";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { utilFormatDateAndTime } from "../../../domain/services/utilService";
import { modalUpdate } from "../../stores/app/modalSlice";

type Props = TableProps<any> & {
  data?: CommonContent<Message>;
};

function MessageTable({ data, ...props }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const statusLabel = {
    0: "Inactive",
    1: "Active",
    2: "Sent",
    3: "Failed",
  };
  const statusColor = {
    0: "text-gray-500",
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
      render: (record: Message) => {
        return (
          <div className="flex gap-2">
            <button
              disabled={record.status === 2 || record.status === 3}
              onClick={() => {
                const sendAt = record.sendAt
                  ? new Date(record.sendAt).toISOString()
                  : undefined;

                const type = record.sendAt ? 2 : 3;

                dispatch(
                  modalUpdate({
                    show: true,
                    content: "message",
                    title: "Edit Message",
                    data: { ...record, sendAt, type },
                  })
                );
              }}
              className={`${
                record.status === 2 || record.status === 3
                  ? "text-gray-500"
                  : "text-blue-500 underline"
              } hover:no-underline`}
            >
              Edit
            </button>

            {/* <button
              disabled={record.status !== 1}
              onClick={() => {
                Modal.confirm({
                  type: "warning",
                  title: "Are you sure?",
                  content: "Do you want to cancel this message?",
                  maskClosable: true,
                  okButtonProps: {
                    danger: true,
                  },
                  onOk: async () => {

                  },
                });
              }}
              className={`${
                record.status !== 1 ? "text-gray-500" : "text-red-500 underline"
              } hover:no-underline`}
            >
              Cancel
            </button> */}
          </div>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={data?.content}
      rowKey={(record: Message) => record.id}
      pagination={{
        total: data?.totalElements,
        pageSize: data?.size,
        current: data?.page,
        onChange: (page, size) => {
          navigate(`?page=${page}&size=${size}`);
        },
      }}
      columns={columns}
      {...props}
    />
  );
}

export default MessageTable;
