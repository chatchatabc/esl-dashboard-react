import DynamicTable from "../DynamicTable";
import { ColumnsType } from "antd/es/table";
import { utilFormatCurrency } from "../../../domain/services/utilService";
import { Course } from "../../../../../esl-workers/src/domain/models/CourseModel";
import { courseGetAll } from "../../../domain/services/courseService";

type Props = {
  teacherId: number;
};

function TeacherCourseTable({ teacherId }: Props) {
  const columns: ColumnsType<Course> = [
    {
      key: "name",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "description",
      title: "Description",
      dataIndex: "description",
    },
    {
      key: "price",
      title: "Price",
      render: (record: Course) => {
        return <p key={record.price}>{utilFormatCurrency(record.price)}</p>;
      },
    },
  ];

  return (
    <DynamicTable
      rowKey={(record: Course) => record.id}
      columns={columns}
      getData={(values: any) => {
        return courseGetAll({ ...values, teacherId });
      }}
    />
  );
}

export default TeacherCourseTable;
