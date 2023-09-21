import Table, { ColumnsType, TableProps } from "antd/es/table";
import { utilFormatDateAndTime } from "../../../domain/services/utilService";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../stores/hooks";
import { modalUpdate } from "../../stores/app/modalSlice";
import { CommonContent } from "../../../../../esl-backend-workers/src/domain/models/CommonModel";
import { Student } from "../../../../../esl-backend-workers/src/domain/models/StudentModel";

type Props = TableProps<any> & {
  data?: CommonContent<Student> | null;
};

function StudentTable({ data, ...props }: Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const columns: ColumnsType<Student> = [
    {
      title: "Student Name",
      key: "alias",
      render: (record: Student) => {
        return (
          <button
            onClick={() => {
              navigate("/students/" + record.user?.username);
            }}
            className="text-blue-500 underline hover:no-underline"
          >
            {record.alias}
          </button>
        );
      },
    },
    {
      title: "Username",
      key: "username",
      render: (record: Student) => {
        return (
          <button
            onClick={() => {
              navigate("/users/" + record.user?.username);
            }}
            className="text-blue-500 underline hover:no-underline"
          >
            {record.user?.username}
          </button>
        );
      },
    },
    {
      title: "Created At",
      key: "createdAt",
      render: (record: Student) => {
        return (
          <p>{utilFormatDateAndTime("en-US", new Date(record.createdAt))}</p>
        );
      },
    },
    {
      title: "Last Updated",
      key: "updatedAt",
      render: (record: Student) => {
        return (
          <p>{utilFormatDateAndTime("en-US", new Date(record.updatedAt))}</p>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Student) => {
        return (
          <div>
            <button
              onClick={() => {
                dispatch(
                  modalUpdate({
                    show: true,
                    title: "Edit Teacher",
                    content: "teacher",
                    data: record,
                  })
                );
              }}
              className="text-blue-500 underline hover:no-underline"
            >
              Edit
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={data?.content}
      columns={columns}
      pagination={{
        total: data?.totalElements,
        pageSize: data?.size,
        current: data?.page,
        onChange: (page, size) => {
          navigate(`?page=${page}&size=${size}`);
        },
      }}
      rowKey={(record: Student) => record.id}
      {...props}
    />
  );
}

export default StudentTable;
