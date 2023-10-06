import { Button, Form, FormInstance, Input } from "antd";
import { teacherCreate } from "../../../domain/services/teacherService";

type Props = {
  loading: boolean;
  handleSubmit: (
    action: (params: any) => Promise<any>,
    values: any,
    success: string,
    fail: string,
    queryKeys: any[]
  ) => Promise<any>;
  formRef: FormInstance;
};

function TeacherForm({ loading, handleSubmit, formRef }: Props) {
  return (
    <Form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        e.credits = Number(e.credits);
        handleSubmit(
          teacherCreate,
          e,
          "Successfully created teacher!",
          "Failed to create teacher!",
          [["teachers"]]
        );
      }}
    >
      <div className="grid grid-cols-2 gap-x-2">
        <Form.Item
          rules={[
            {
              required: true,
              message: "Need some input here",
            },
          ]}
          name="username"
          label="Username"
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
              message: "Need some input here",
            },
          ]}
          name="alias"
          label="Nickname"
        >
          <Input placeholder="Nickname" />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
              message: "Need some input here",
            },
          ]}
          name="password"
          label="Password"
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
              message: "Need some input here",
            },
          ]}
          name="confirmPassword"
          label="Confirm Password"
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>

        {/* First Name */}
        <Form.Item
          rules={[
            {
              required: true,
              message: "Need some input here",
            },
          ]}
          name="firstName"
          label="First Name"
        >
          <Input placeholder="First Name" />
        </Form.Item>

        {/* Last Name */}
        <Form.Item
          rules={[
            {
              required: true,
              message: "Need some input here",
            },
          ]}
          name="lastName"
          label="Last Name"
        >
          <Input placeholder="Last Name" />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          rules={[
            {
              required: true,
              message: "Need some input here",
            },
          ]}
          name="phone"
          label="Phone"
        >
          <Input placeholder="Phone" />
        </Form.Item>

        {/* Credits */}
        <Form.Item
          rules={[
            {
              required: true,
              message: "Need some input here",
            },
            {
              pattern: new RegExp(/^[0-9]*$/),
              message: "Please input number only",
            },
          ]}
          name="credits"
          label="User Credits"
        >
          <Input placeholder="User Credits" />
        </Form.Item>
      </div>

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default TeacherForm;
