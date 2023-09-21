import Table, { ColumnsType, TableProps } from "antd/es/table";
import { utilFormatDateAndTime } from "../../../domain/services/utilService";
import { useNavigate } from "react-router-dom";
import { CommonContent } from "../../../../../esl-backend-workers/src/domain/models/CommonModel";
import { Student } from "../../../../../esl-backend-workers/src/domain/models/StudentModel";

type Props = TableProps<any> & {
  data?: CommonContent<Student> | null;
};

function StudentTable({ data, ...props }: Props) {
  const navigate = useNavigate();

  const columns: ColumnsType<Student> = [
    {
      title: "Student Name",
      key: "alias",
      render: (_, record) => {
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
      title: "Phone Number",
      key: "phoneNumber",
      dataIndex: "user",
      render: (_, data) => {
        return <p>{data.user.phone ?? "NULL"}</p>;
      },
    },
    {
      title: "Credits",
      key: "credits",
      dataIndex: "user",
      render: (_, data) => {
        return <p>{data.user.credits}</p>;
      },
    },
    {
      title: "Created At",
      key: "createdAt",
      render: (_, record) => {
        return (
          <p>{utilFormatDateAndTime("en-US", new Date(record.createdAt))}</p>
        );
      },
    },
    {
      title: "Last Updated",
      key: "updatedAt",
      render: (_, record) => {
        return (
          <p>{utilFormatDateAndTime("en-US", new Date(record.updatedAt))}</p>
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
