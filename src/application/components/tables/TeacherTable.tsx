import DynamicTable from "../DynamicTable";
import { teacherGetAll } from "../../../domain/services/teacherService";
import { ColumnsType } from "antd/es/table";
import { Teacher } from "../../../../../esl-workers/src/domain/models/TeacherModel";
import { utilFormatDateAndTime } from "../../../domain/services/utilService";
import { useNavigate } from "react-router-dom";

function TeacherTable() {
  const navigate = useNavigate();

  const columns: ColumnsType<Teacher> = [
    {
      title: "Alias",
      key: "alias",
      render: (record: Teacher) => {
        return (
          <button
            onClick={() => {
              navigate("/teachers/" + record.user?.username);
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
      render: (record: Teacher) => {
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
      render: (record: Teacher) => {
        return (
          <p>{utilFormatDateAndTime("en-US", new Date(record.createdAt))}</p>
        );
      },
    },
    {
      title: "Last Updated",
      key: "updatedAt",
      render: (record: Teacher) => {
        return (
          <p>{utilFormatDateAndTime("en-US", new Date(record.updatedAt))}</p>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Teacher) => {
        return (
          <div>
            <button className="text-blue-500 underline hover:no-underline">
              Edit
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <DynamicTable
      getData={teacherGetAll}
      columns={columns}
      rowKey={(record: Teacher) => record.id}
    />
  );
}

export default TeacherTable;
