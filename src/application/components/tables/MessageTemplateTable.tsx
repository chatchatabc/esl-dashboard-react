import { useAppDispatch } from "../../redux/hooks";
import { Button, Table, TableProps } from "antd";
import { CommonContent } from "../../../../../esl-workers/src/domain/models/CommonModel";
import { MessageTemplate } from "../../../../../esl-workers/src/domain/models/MessageModel";
import { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { modalUpdate } from "../../redux/features/modalSlice";

type Props = TableProps<any> & {
  data?: CommonContent<MessageTemplate>;
};

function MessageTemplateTable({ data, ...props }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const statusLabel = {
    1: "Active",
    2: "Approved",
    3: "Rejected",
  };
  const statusColor = {
    1: "text-green-500",
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
            <Button
              onClick={() => {
                dispatch(
                  modalUpdate({
                    show: true,
                    content: "messageTemplate",
                    title: "Edit Message Template",
                    data: record,
                  })
                );
              }}
              disabled={record.status === 2}
              type="link"
              size="small"
            >
              Edit
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={data?.content}
      rowKey={(record: MessageTemplate) => record.id}
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

export default MessageTemplateTable;
