import { Button, DatePicker, Form, FormInstance, Input, Select } from "antd";
import React from "react";
import {
  bookingCreate,
  bookingOptionStatus,
  bookingUpdate,
} from "../../../domain/services/bookingService";
import { teacherGetAll } from "../../../domain/services/teacherService";
import { Teacher } from "../../../../../esl-backend-workers/src/domain/models/TeacherModel";
import { Course } from "../../../../../esl-backend-workers/src/domain/models/CourseModel";
import { courseGetAll } from "../../../domain/services/courseService";
import { Student } from "../../../../../esl-backend-workers/src/domain/models/StudentModel";
import { useQuery } from "@tanstack/react-query";
import { studentGetAll } from "../../../domain/services/studentService";

type Props = {
  loading: boolean;
  handleSubmit: (
    action: (params: any) => Promise<any>,
    values: any,
    success: string,
    fail: string,
    queryKeys: any[][]
  ) => Promise<any>;
  formRef: FormInstance;
};

function BookingForm({ loading, handleSubmit, formRef }: Props) {
  const [localLoading, setLocalLoading] = React.useState(true);
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(
    null
  );
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(
    null
  );
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(
    null
  );
  const [sessions, setSessions] = React.useState<number>(0);
  const [advanceBooking, setAdvanceBooking] = React.useState("");
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const studentsQuery = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const data = await studentGetAll({
        page: 1,
        size: 1000,
      });
      return data?.content ?? [];
    },
  });
  const students = studentsQuery.data ?? [];

  const formValues = formRef.getFieldsValue();

  // Get students and teachers
  React.useEffect(() => {
    if (localLoading) {
      (async () => {
        const resTeachers = await teacherGetAll({
          page: 1,
          size: 10000,
        });

        if (resTeachers) {
          setTeachers(resTeachers.content);
        }

        setLocalLoading(false);
      })();
    }
  }, [localLoading]);

  // Get courses every time teacher is changed
  React.useEffect(() => {
    if (selectedTeacher) {
      (async () => {
        const resCourses = await courseGetAll({
          page: 1,
          size: 10000,
          teacherId: selectedTeacher.id,
        });

        if (resCourses) {
          setCourses(resCourses.content);
          formRef.setFieldValue("courseId", resCourses.content[0].id);
        }
      })();
    }
  }, [selectedTeacher]);

  // Perform some actions when formValues is changed
  React.useEffect(() => {
    // Check if teacherId is changed
    const teacherId = formValues.teacherId;
    if (teacherId !== selectedTeacher?.id) {
      const teacher = teachers.find(
        (teacher) => teacher.id === formValues.teacherId
      );
      if (teacher) {
        setSelectedTeacher(teacher);
      }
    }

    // Check if courseId has value
    if (!formValues.courseId && courses.length) {
      formRef.setFieldValue("courseId", courses[0].id);
      setSelectedCourse(courses[0]);
    }

    // Compute sessions
    const start = formValues.start?.toDate().getTime();
    const end = formValues.end?.toDate().getTime();
    const newSession = (end - start) / 1800000;
    if (newSession !== sessions) {
      setSessions(newSession);
    }
  }, [formValues]);

  return (
    <Form
      className="overflow-hidden"
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        e.start = e.start.toDate().getTime();
        e.end = e.end.toDate().getTime();

        // Convert to number
        if (e.advanceBooking) {
          e.advanceBooking = Number(e.advanceBooking);
        } else {
          delete e.advanceBooking;
        }

        // Convert to number
        if (e.amount) {
          e.amount = Number(e.amount);
        } else {
          delete e.amount;
        }

        if (e.id) {
          handleSubmit(
            bookingUpdate,
            e,
            "Booking update successfully",
            "Booking update failed",
            [["bookings"], ["users"], ["credits"]]
          );
        } else {
          handleSubmit(
            bookingCreate,
            e,
            "Booking created successfully",
            "Booking created failed",
            [["bookings"], ["users"], ["credits"]]
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
            onChange={(e) => {
              const teacher = teachers.find((teacher) => teacher.id === e);

              if (teacher) {
                setSelectedTeacher(teacher);
                setLocalLoading(true);
              }
            }}
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
            onChange={(e) => {
              const student = students.find((student) => student.id === e);

              if (student) {
                setSelectedStudent(student);
              }
            }}
            options={students.map((student) => {
              return {
                value: student.id,
                label: `${student.user.alias} | ${student.user.phone}`,
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
            <Input
              onChange={(e) => {
                setAdvanceBooking(e.target.value);
              }}
              placeholder="Optional"
            />
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

      {!formValues.id && (
        <div className="flex -mx-1">
          <section className="w-1/2 px-1">
            <header>
              <h3>User Credit Points</h3>
            </header>

            <section>
              <p>{selectedStudent?.user.credits ?? "N/A"}</p>
            </section>
          </section>

          <section className="w-1/2 px-1">
            <header>
              <h3>Booking amount</h3>
            </header>

            <section>
              {selectedCourse ? (
                <p>
                  {selectedCourse.price *
                    Number(advanceBooking === "" ? "1" : advanceBooking) *
                    sessions}
                  点
                </p>
              ) : (
                <p>N/A</p>
              )}
            </section>
          </section>
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
        <Select placeholder="Select a course" options={bookingOptionStatus()} />
      </Form.Item>

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default BookingForm;
