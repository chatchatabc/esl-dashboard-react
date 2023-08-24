import { Button, DatePicker, Form, FormInstance, Select } from "antd";
import { userGetAll } from "../../../domain/services/userService";
import { User } from "../../../../../esl-workers/src/domain/models/UserModel";
import React from "react";
import { bookingCreate } from "../../../domain/services/bookingService";
import { teacherGetAll } from "../../../domain/services/teacherService";
import { Teacher } from "../../../../../esl-workers/src/domain/models/TeacherModel";
import { Course } from "../../../../../esl-workers/src/domain/models/CourseModel";
import { courseGetAll } from "../../../domain/services/courseService";

type Props = {
  loading: boolean;
  handleSubmit: (
    action: (params: any) => Promise<any>,
    values: any,
    success: string,
    fail: string
  ) => Promise<any>;
  formRef: FormInstance;
};

function BookingForm({ loading, handleSubmit, formRef }: Props) {
  const [localLoading, setLocalLoading] = React.useState(true);
  const [students, setStudents] = React.useState<User[]>([]);
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);

  React.useEffect(() => {
    if (localLoading) {
      (async () => {
        const resStudents = await userGetAll({
          page: 1,
          size: 10000,
          roleId: 2,
        });

        if (resStudents) {
          setStudents(resStudents.content);
        }

        const resTeachers = await teacherGetAll({
          page: 1,
          size: 10000,
        });

        if (resTeachers) {
          setTeachers(resTeachers.content);
        }

        const resCourses = await courseGetAll({
          page: 1,
          size: 10000,
        });

        if (resCourses) {
          setCourses(resCourses.content);
        }

        setLocalLoading(false);
      })();
    }
  }, [localLoading]);

  return (
    <Form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        e.start = e.start.toDate().getTime();
        e.end = e.end.toDate().getTime();

        handleSubmit(
          bookingCreate,
          e,
          "Booking created successfully",
          "Booking created failed"
        );
      }}
    >
      {/* Teacher */}
      <Form.Item
        name="teacherId"
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        label="Teacher"
      >
        <Select
          placeholder="Select a teacher"
          options={teachers.map((teacher) => {
            if (teacher.user) {
              return {
                value: teacher.id,
                label: `${teacher.user.firstName} ${teacher.user.lastName}`,
              };
            }

            return {
              value: teacher.id,
              label: teacher.alias,
            };
          })}
        />
      </Form.Item>

      {/* Student */}
      <Form.Item
        name="userId"
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        label="Student"
      >
        <Select
          placeholder="Select a student"
          options={students.map((student) => {
            return {
              value: student.id,
              label: `${student.firstName} ${student.lastName}`,
            };
          })}
        />
      </Form.Item>

      {/* Course */}
      <Form.Item
        name="courseId"
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        label="Course"
      >
        <Select
          placeholder="Select a course"
          options={courses.map((course) => {
            return {
              value: course.id,
              label: `(${course.price}点) ${course.name}`,
            };
          })}
        />
      </Form.Item>

      {/* Start Time */}
      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="start"
        label="Start Time"
      >
        <DatePicker className="w-full" showTime />
      </Form.Item>

      {/* End Time */}
      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="end"
        label="End Time"
      >
        <DatePicker className="w-full" showTime />
      </Form.Item>

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default BookingForm;
