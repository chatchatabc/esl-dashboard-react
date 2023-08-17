import { Button, DatePicker, Form, FormInstance, Select } from "antd";
import { userGetAll } from "../../../domain/services/userService";
import { User } from "../../../../../esl-workers/src/domain/models/UserModel";
import React from "react";
import { bookingCreate } from "../../../domain/services/bookingService";

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
  const [teachers, setTeachers] = React.useState<User[]>([]);

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

        const resTeachers = await userGetAll({
          page: 1,
          size: 10000,
          roleId: 3,
        });

        if (resTeachers) {
          setTeachers(resTeachers.content);
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
            return {
              value: teacher.id,
              label: `${teacher.firstName} ${teacher.lastName}`,
            };
          })}
        />
      </Form.Item>

      {/* Student */}
      <Form.Item
        name="studentId"
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
