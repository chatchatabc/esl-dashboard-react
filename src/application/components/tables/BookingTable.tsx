import DynamicTable from "../DynamicTable";
import { ColumnsType } from "antd/es/table";
import { utilFormatDateAndTime } from "../../../domain/services/utilService";
import { Booking } from "../../../../../esl-workers/src/domain/models/BookingModel";
import { bookingGetAll } from "../../../domain/services/bookingService";

type Props = {
  userId: number;
};

function BookingTable({ userId }: Props) {
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
        return <p>{record.user?.alias}</p>;
      },
    },
    {
      key: "teacherId",
      title: "Teacher",
      render: (record: Booking) => {
        return <p>{record.teacher?.alias}</p>;
      },
    },
  ];

  return (
    <DynamicTable
      rowKey={(record: Booking) => record.id}
      columns={columns}
      getData={(values: any) => {
        return bookingGetAll({ ...values, userId });
      }}
    />
  );
}

export default BookingTable;
