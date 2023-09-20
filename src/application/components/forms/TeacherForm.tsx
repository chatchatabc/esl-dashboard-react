import { Button, Form, FormInstance, Input, Select } from "antd";
import React from "react";
import { userGetAll } from "../../../domain/services/userService";
import { User } from "../../../../../esl-backend-workers/src/domain/models/UserModel";
import {
  teacherCreate,
  teacherOptionStatus,
  teacherUpdate,
} from "../../../domain/services/teacherService";

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

function TeacherForm({ loading, handleSubmit, formRef }: Props) {
  const [localLoading, setLocalLoading] = React.useState(true);
  const [users, setUsers] = React.useState<User[]>([]);
  const formValues = formRef.getFieldsValue();

  React.useEffect(() => {
    if (localLoading) {
      (async () => {
        const resUsers = await userGetAll({
          page: 1,
          size: 10000,
          roleId: 3,
        });

        if (resUsers) {
          setUsers(resUsers.content);
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
        if (e.id) {
          handleSubmit(
            teacherUpdate,
            e,
            "Successfully updated teacher",
            "Failed to update teacher",
            [["teachers"]]
          );
        } else {
          handleSubmit(
            teacherCreate,
            e,
            "Successfully created teacher",
            "Failed to create teacher",
            [["teachers"]]
          );
        }
      }}
    >
      <Form.Item name="id" hidden></Form.Item>

      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="userId"
        label="User"
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
          options={users.map((user) => {
            return {
              value: user.id,
              label: `${user.alias} | ${user.phone}`,
            };
          })}
        />
      </Form.Item>

      {/* Alias */}
      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="alias"
        label="Alias"
      >
        <Input placeholder="Alias" />
      </Form.Item>

      {/* Bio */}
      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="bio"
        label="Bio"
      >
        <Input.TextArea placeholder="Bio" />
      </Form.Item>

      {/* Status */}
      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="status"
        label="Status"
        initialValue={1}
      >
        <Select disabled options={teacherOptionStatus()} placeholder="Status" />
      </Form.Item>

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default TeacherForm;
