import DynamicTable from "../DynamicTable";
import { ColumnsType } from "antd/es/table";
import { utilFormatCurrency } from "../../../domain/services/utilService";
import { Course } from "../../../../../esl-workers/src/domain/models/CourseModel";
import { courseGetAll } from "../../../domain/services/courseService";
import { useAppDispatch } from "../../redux/hooks";
import { modalUpdate } from "../../redux/features/modalSlice";

type Props = {
  teacherId: number;
};

function TeacherCourseTable({ teacherId }: Props) {
  const dispatch = useAppDispatch();

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
        return <p key={record.price}>{record.price}点</p>;
      },
    },
    {
      key: "action",
      title: "Actions",
      render: (record: Course) => {
        return (
          <div>
            <button
              className="text-blue-500"
              onClick={() => {
                dispatch(
                  modalUpdate({
                    show: true,
                    title: "Edit Course",
                    content: "course",
                    data: record,
                  })
                );
              }}
            >
              Edit
            </button>
          </div>
        );
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
