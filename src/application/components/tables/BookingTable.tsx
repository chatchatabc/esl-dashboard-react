import DynamicTable from "../DynamicTable";
import { ColumnsType, TableProps } from "antd/es/table";
import { utilFormatDateAndTime } from "../../../domain/services/utilService";
import { Booking } from "../../../../../esl-workers/src/domain/models/BookingModel";
import {
  bookingGetAll,
  bookingOptionStatus,
} from "../../../domain/services/bookingService";

type Props = {
  userId: number;
} & TableProps<any>;

const statusOptions = bookingOptionStatus();

function BookingTable({ userId, ...props }: Props) {
  const columns: ColumnsType<Booking> = [
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
        return <p>Teacher {record.teacher?.alias}</p>;
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
      getData={(values: any) => {
        return bookingGetAll({ ...values, userId, status: "" });
      }}
      {...props}
    />
  );
}

export default BookingTable;
