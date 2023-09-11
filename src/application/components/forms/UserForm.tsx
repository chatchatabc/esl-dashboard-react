import { Button, Form, FormInstance, Input, Select, message } from "antd";
import { userOptionStatus } from "../../../domain/services/userService";
import { trpc } from "../../../domain/infras/trpcActions";
import { useAppDispatch } from "../../redux/hooks";
import { modalUpdate } from "../../redux/features/modalSlice";

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

function UserForm({ loading, formRef }: Props) {
  const dispatch = useAppDispatch();
  const trpcClient = trpc.useContext();
  const userUpdateMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      trpcClient.user.getAll.invalidate();
      message.success("Successfully updated user!");
      dispatch(modalUpdate({ show: false }));
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  const userCreateMutation = trpc.user.create.useMutation({
    onSuccess: () => {
      trpcClient.user.getAll.invalidate();
      message.success("Successfully created user!");
      dispatch(modalUpdate({ show: false }));
    },
    onError: (error) => {
      message.error(error.message);
    },
  });
  const rolesQuery = trpc.role.getAll.useQuery({
    page: 1,
    size: 100000,
  });

  return (
    <Form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        e.credits = Number(e.credits);
        if (e.id) {
          userUpdateMutation.mutate(e);
        } else {
          userCreateMutation.mutate(e);
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
            loading={rolesQuery.isLoading}
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
