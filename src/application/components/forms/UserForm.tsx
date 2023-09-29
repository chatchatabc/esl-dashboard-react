import { Button, Form, FormInstance, Input, Select } from "antd";
import {
  userCreate,
  userOptionStatus,
  userUpdate,
} from "../../../domain/services/userService";
import { useQuery } from "@tanstack/react-query";
import { roleGetAll } from "../../../domain/services/roleService";

type Props = {
  loading: boolean;
  handleSubmit: (
    action: (params: any) => Promise<any>,
    values: any,
    success: string,
    fail: string,
    queryKey?: any[][]
  ) => Promise<any>;
  formRef: FormInstance;
};

function UserForm({ loading, handleSubmit, formRef }: Props) {
  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const data = await roleGetAll({ page: 1, size: 10000 });
      return data;
    },
  });

  return (
    <Form
      data-user-form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        e.credits = Number(e.credits);
        if (e.id) {
          handleSubmit(
            userUpdate,
            e,
            "Successfully updated user!",
            "Failed to update user!",
            [["users"]]
          );
        } else {
          handleSubmit(
            userCreate,
            e,
            "Successfully created user!",
            "Failed to create user!",
            [["users"]]
          );
        }
      }}
    >
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>

      <div className="flex -mx-1">
        <Form.Item
          className="w-1/2 px-1"
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
          className="w-1/2 px-1"
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
      </div>

      {formRef.getFieldValue("id") === undefined && (
        <div className="flex -mx-1">
          <Form.Item
            className="w-1/2 px-1"
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
            className="w-1/2 px-1"
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
        </div>
      )}

      <div className="flex -mx-1">
        {/* Role */}
        <Form.Item
          className="w-1/2 px-1"
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
            options={rolesQuery.data?.content.map((role) => {
              return {
                label: role.name,
                value: role.id,
              };
            })}
            placeholder="User Role"
          />
        </Form.Item>

        {/* Status */}
        <Form.Item
          className="w-1/2 px-1"
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
      </div>

      <div className="flex -mx-1">
        {/* First Name */}
        <Form.Item
          className="w-1/2 px-1"
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
          className="w-1/2 px-1"
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
      </div>

      <div className="flex -mx-1">
        {/* Phone */}
        <Form.Item
          className="w-1/2 px-1"
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
          className="w-1/2 px-1"
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

export default UserForm;
