import { Button, Form, FormInstance, Input, Select } from "antd";
import React from "react";
import { UserRole } from "../../../../../esl-workers/src/domain/models/UserModel";
import {
  userCreate,
  userGetAllRole,
  userOptionStatus,
} from "../../../domain/services/userService";

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
  const [localLoading, setLocalLoading] = React.useState(true);
  const [roles, setRoles] = React.useState<UserRole[]>([]);

  React.useEffect(() => {
    if (localLoading) {
      (async () => {
        const res = await userGetAllRole({
          page: 1,
          size: 10000,
        });

        if (res) {
          setRoles(res.content);
        }

        setLocalLoading(false);
      })();
    }
  }, []);

  return (
    <Form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        if (e.id) {
        } else {
          handleSubmit(
            userCreate,
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
        name="credit"
        label="User Credits"
      >
        <Input placeholder="User Credits" />
      </Form.Item>

      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="roleId"
        label="User Role"
      >
        <Select
          options={roles.map((role) => {
            return {
              label: role.name,
              value: role.id,
            };
          })}
          placeholder="User Role"
        />
      </Form.Item>

      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="status"
        label="User Status"
        initialValue={1}
      >
        <Select
          disabled={formRef.getFieldValue("id") === undefined}
          options={userOptionStatus()}
          placeholder="User Status"
        />
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
