import { Button, Form, FormInstance, Input } from "antd";
import { messageSend } from "../../../domain/services/messageService";

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

function UserForm({ loading, handleSubmit, formRef }: Props) {
  return (
    <Form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        if (e.id) {
        } else {
          handleSubmit(
            messageSend,
            e,
            "Successfully created user!",
            "Failed to create user!"
          );
        }
      }}
    >
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>

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

      <Form.Item name="firstName" label="First Name">
        <Input placeholder="First Name" />
      </Form.Item>

      <Form.Item name="lastName" label="Last Name">
        <Input placeholder="Last Name" />
      </Form.Item>

      <Form.Item name="phone" label="Phone">
        <Input placeholder="Phone" />
      </Form.Item>

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default UserForm;
