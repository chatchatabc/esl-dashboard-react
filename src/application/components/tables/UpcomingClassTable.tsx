import { Button, Modal, TableProps, message } from "antd";
import { CommonContent } from "../../../../../esl-backend-workers/src/domain/models/CommonModel";
import { Booking } from "../../../../../esl-backend-workers/src/domain/models/BookingModel";
import { ColumnsType } from "antd/es/table";
import { utilFormatDateAndTime } from "../../../domain/services/utilService";
import DynamicTable from "./DynamicTable";
import { bookingCancel } from "../../../domain/services/bookingService";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  roleId: number;
  data?: CommonContent<Booking> | null;
} & TableProps<any>;

function UpcomingClassTable({ data, roleId, ...props }: Props) {
  const columns: ColumnsType<Booking> = [];
  const queryClient = useQueryClient();

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
      title: "Start Class Schedule",
      render: (_, record) => {
        return <p>{utilFormatDateAndTime("zn-CH", new Date(record.start))}</p>;
      },
    },
    {
      key: "end",
      title: "End Class Schedule",
      render: (_, record) => {
        return <p>{utilFormatDateAndTime("zn-CH", new Date(record.end))}</p>;
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, record) => {
        return (
          <div className="flex space-x-2">
            <Button
              onClick={() => {
                Modal.confirm({
                  maskClosable: true,
                  title: "Cancel Confirmation",
                  content:
                    "Are you sure you want to cancel this booking? This action cannot be undone.",
                  onOk: async () => {
                    const res = await bookingCancel({ id: record.id });
                    if (!res) {
                      message.error("Failed to cancel booking!");
                    } else {
                      message.success("Successfully cancelled booking!");
                      queryClient.invalidateQueries(["bookings"]);
                    }
                  },
                  okButtonProps: {
                    danger: true,
                  },
                });
              }}
              className="bg-red-500 text-white"
            >
              Cancel
            </Button>
          </div>
        );
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

export default UpcomingClassTable;
