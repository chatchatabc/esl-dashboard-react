import { Button, Form, FormInstance, Input } from "antd";
import {
  courseCreate,
  courseUpdate,
} from "../../../domain/services/courseService";

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

function CourseForm({ loading, handleSubmit, formRef }: Props) {
  return (
    <Form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        if (e.id) {
          handleSubmit(
            courseUpdate,
            e,
            "Successfully updated course",
            "Failed to update course",
            [["courses"]]
          );
        } else {
          handleSubmit(
            courseCreate,
            e,
            "Successfully created course",
            "Failed to create course",
            [["courses"]]
          );
        }
      }}
    >
      <Form.Item name="id" hidden></Form.Item>
      <Form.Item name="teacherId" hidden></Form.Item>

      {/* Name */}
      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="name"
        label="Name"
      >
        <Input placeholder="Name" />
      </Form.Item>

      {/* Details */}
      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="description"
        label="Description"
      >
        <Input.TextArea placeholder="Description" />
      </Form.Item>

      {/* Price */}
      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
          {
            pattern: /^[0-9]*$/,
            message: "Must be a number",
          },
        ]}
        name="price"
        label="Price"
      >
        <Input placeholder="Price" />
      </Form.Item>

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default CourseForm;
