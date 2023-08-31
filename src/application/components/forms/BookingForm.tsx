import { Button, DatePicker, Form, FormInstance, Input, Select } from "antd";
import { userGetAll } from "../../../domain/services/userService";
import { User } from "../../../../../esl-workers/src/domain/models/UserModel";
import React from "react";
import {
  bookingCreate,
  bookingOptionStatus,
  bookingUpdate,
} from "../../../domain/services/bookingService";
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
  const formValues = formRef.getFieldsValue();

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

  React.useEffect(() => {
    if (!formValues.courseId && courses.length) {
      formRef.setFieldValue("courseId", courses[0].id);
    }
  }, [formValues, courses]);

  return (
    <Form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        e.start = e.start.toDate().getTime();
        e.end = e.end.toDate().getTime();

        // Convert to number
        if (e.advanceBooking && e.advanceBooking === "") {
          delete e.advanceBooking;
        } else if (e.advanceBooking) {
          e.advanceBooking = Number(e.advanceBooking);
        }

        // Convert to number
        if (e.amount && e.amount === "") {
          delete e.amount;
        } else if (e.amount) {
          e.amount = Number(e.amount);
        }

        if (e.id) {
          handleSubmit(
            bookingUpdate,
            e,
            "Booking update successfully",
            "Booking update failed"
          );
        } else {
          handleSubmit(
            bookingCreate,
            e,
            "Booking created successfully",
            "Booking created failed"
          );
        }
      }}
    >
      <Form.Item name="id" hidden></Form.Item>

      <div className="flex -mx-1">
        {/* Teacher */}
        <Form.Item
          className="w-1/2 px-1"
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
            disabled={formValues.id ? true : false}
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
          className="w-1/2 px-1"
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
            disabled={formValues.id ? true : false}
            placeholder="Select a student"
            showSearch={true}
            filterOption={(input, option) => {
              if (option?.label) {
                return (
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }
              return false;
            }}
            options={students.map((student) => {
              return {
                value: student.id,
                label: `${student.alias} | ${student.phone}`,
              };
            })}
          />
        </Form.Item>
      </div>

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
          disabled={formValues.id ? true : false}
          placeholder="Select a course"
          options={courses.map((course) => {
            return {
              value: course.id,
              label: `(${course.price}点) ${course.name}`,
            };
          })}
        />
      </Form.Item>

      <div className="flex -mx-1">
        {/* Start Time */}
        <Form.Item
          className="w-1/2 px-1"
          rules={[
            {
              required: true,
              message: "Need some input here",
            },
          ]}
          name="start"
          label="Start Time"
        >
          <DatePicker
            disabled={formValues.id ? true : false}
            className="w-full"
            showTime
          />
        </Form.Item>

        {/* End Time */}
        <Form.Item
          className="w-1/2 px-1"
          rules={[
            {
              required: true,
              message: "Need some input here",
            },
          ]}
          name="end"
          label="End Time"
        >
          <DatePicker
            disabled={formValues.id ? true : false}
            className="w-full"
            showTime
          />
        </Form.Item>
      </div>

      {!formValues.id && (
        <div className="flex -mx-1">
          {/* Advance Booking */}
          <Form.Item
            className="w-1/2 px-1"
            name="advanceBooking"
            label="Advance Booking"
            rules={[
              {
                pattern: new RegExp(/^[0-9]*$/),
                message: "Please input a number",
              },
            ]}
          >
            <Input placeholder="Optional" />
          </Form.Item>

          {/* Amount */}
          <Form.Item
            className="w-1/2 px-1"
            name="amount"
            label="Override Amount"
          >
            <Input placeholder="Optional" />
          </Form.Item>
        </div>
      )}

      <Form.Item
        name="status"
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        label="Status"
        initialValue={1}
      >
        <Select
          disabled={!formValues.id}
          placeholder="Select a course"
          options={bookingOptionStatus()}
        />
      </Form.Item>

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default BookingForm;
