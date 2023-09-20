import { ColumnsType, TableProps } from "antd/es/table";
import { utilFormatDateAndTime } from "../../../domain/services/utilService";
import { Booking } from "../../../../../esl-backend-workers/src/domain/models/BookingModel";
import { bookingOptionStatus } from "../../../domain/services/bookingService";
import { CommonContent } from "../../../../../esl-backend-workers/src/domain/models/CommonModel";
import DynamicTable from "./DynamicTable";

type Props = {
  data?: CommonContent<Booking> | null;
} & TableProps<any>;

const statusOptions = bookingOptionStatus();

function BookingTable({ data, ...props }: Props) {
  const columns: ColumnsType<Booking> = [
    {
      key: "dayOfWeek",
      title: "Day",
      render: (record: Booking) => {
        const date = new Date(record.start);
        const dateFormat = new Intl.DateTimeFormat("zn-CH", {
          weekday: "short",
        });
        return <p>{dateFormat.format(date)}</p>;
      },
    },
    {
      key: "start",
      title: "Start Schedule",
      render: (record: Booking) => {
        return <p>{utilFormatDateAndTime("zn-CH", new Date(record.start))}</p>;
      },
    },
    {
      key: "end",
      title: "End Schedule",
      render: (record: Booking) => {
        return <p>{utilFormatDateAndTime("zn-CH", new Date(record.end))}</p>;
      },
    },
    {
      key: "studentId",
      title: "Student",
      render: (record: Booking) => {
        return (
          <p>
            {record.user?.firstName} {record.user?.lastName}
          </p>
        );
      },
    },
    {
      key: "teacherId",
      title: "Teacher",
      render: (record: Booking) => {
        return <p>{record.teacher?.alias}</p>;
      },
    },
    {
      key: "status",
      title: "Status",
      render: (record: Booking) => {
        const status = statusOptions.find(
          (item) => item.value === record.status
        );

        return (
          <p
            className={`${
              record.status === 1
                ? "text-gray-500"
                : record.status === 2
                ? "text-blue-500"
                : record.status === 3
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {status?.label}
          </p>
        );
      },
    },
  ];

  return (
    <DynamicTable
      rowKey={(record: Booking) => record.id}
      columns={columns}
      data={data}
      {...props}
    />
  );
}

export default BookingTable;
