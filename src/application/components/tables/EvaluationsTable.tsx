import { TableProps } from "antd";
import { CommonContent } from "../../../../../esl-backend-workers/src/domain/models/CommonModel";
import { Booking } from "../../../../../esl-backend-workers/src/domain/models/BookingModel";
import { ColumnsType } from "antd/es/table";
import { utilFormatDateAndTime } from "../../../domain/services/utilService";
import DynamicTable from "./DynamicTable";

type Props = {
  roleId: number;
  data?: CommonContent<Booking> | null;
} & TableProps<any>;

function EvaluationsTable({ data, roleId, ...props }: Props) {
  const columns: ColumnsType<Booking> = [];

  if (roleId === 3) {
    columns.push({
      key: "studentId",
      title: "Student",
      render: (record: Booking) => {
        return <p>{record.student?.alias}</p>;
      },
    });
  }

  if (roleId === 2) {
    columns.push({
      key: "teacherId",
      title: "Teacher",
      render: (record: Booking) => {
        return <p>{record.teacher?.alias}</p>;
      },
    });
  }

  columns.push(
    {
      key: "start",
      title: "Class Schedule",
      render: (_, record) => {
        return (
          <p>
            {utilFormatDateAndTime("zn-CH", new Date(record.start))}
            {" - "}
            {utilFormatDateAndTime("zn-CH", new Date(record.end), {
              timeStyle: "short",
            })}
          </p>
        );
      },
    },
    {
      key: "message",
      title: "Feedback",
      render: (_, record) => {
        if (record.message) {
          return <p>{record.message}</p>;
        } else {
          return <p>No feedback</p>;
        }
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, record) => {
        return <div></div>;
      },
    }
  );

  return (
    <DynamicTable
      rowKey={(record: Booking) => record.id}
      data={data}
      columns={columns}
      {...props}
    />
  );
}

export default EvaluationsTable;
