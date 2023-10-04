import { Button, TableProps } from "antd";
import { CommonContent } from "../../../../../esl-backend-workers/src/domain/models/CommonModel";
import { Booking } from "../../../../../esl-backend-workers/src/domain/models/BookingModel";
import { ColumnsType } from "antd/es/table";
import { utilFormatDateAndTime } from "../../../domain/services/utilService";
import DynamicTable from "./DynamicTable";
import EditIcon from "../../assets/EditIcon";
import { useAppDispatch } from "../../stores/hooks";
import { modalUpdate } from "../../stores/app/modalSlice";

type Props = {
  roleId: number;
  data?: CommonContent<Booking> | null;
} & TableProps<any>;

function EvaluationsTable({ data, roleId, ...props }: Props) {
  const dispatch = useAppDispatch();
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
        console.log(record.message);
        if (record.message) {
          return <p className="whitespace-pre-wrap">{record.message}</p>;
        } else {
          return <p>No feedback</p>;
        }
      },
    },
    {
      key: "status",
      title: "Status",
      render: (_, record) => {
        if (record.status === 3) {
          return <p className="text-green-500">Complete</p>;
        } else if (record.status === 5) {
          return <p className="text-red-500">Absent</p>;
        } else if (record.status === 2) {
          return <p className="text-blue-500">Ongoing</p>;
        }
      },
    }
  );

  if (roleId === 3) {
    columns.push({
      key: "actions",
      title: "Actions",
      render: (_, record) => {
        return (
          <div className="flex space-x-2">
            <Button
              onClick={() => {
                if (record.status !== 3 && record.status !== 5) {
                  record.status = 3;
                }

                dispatch(
                  modalUpdate({
                    show: true,
                    title: "Edit Evaluation",
                    content: "evaluation",
                    data: record,
                  })
                );
              }}
              className="bg-primary text-white transition hover:bg-opacity-80"
            >
              <div className="w-4 h-4">
                <EditIcon />
              </div>
            </Button>
          </div>
        );
      },
    });
  }

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
