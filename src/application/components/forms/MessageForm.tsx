import { Button, Form, FormInstance, Input, Select } from "antd";
import { messageSend } from "../../../domain/services/messageService";
import React from "react";
import { userGetAll } from "../../../domain/services/userService";
import { User } from "../../../../../esl-workers/src/domain/models/UserModel";
import { messageTemplateGetAll } from "../../../domain/services/messageTemplateService";
import { MessageTemplate } from "../../../../../esl-workers/src/domain/models/MessageModel";

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

function MessageForm({ loading, handleSubmit, formRef }: Props) {
  const [localLoading, setLocalLoading] = React.useState(true);
  const [users, setUsers] = React.useState<User[]>([]);
  const [templates, setTemplates] = React.useState<MessageTemplate[]>([]);

  React.useEffect(() => {
    if (localLoading) {
      (async () => {
        const responseUser = await userGetAll({});
        if (responseUser) {
          setUsers(responseUser.content);
        }

        const responseTemplate = await messageTemplateGetAll({});
        if (responseTemplate) {
          setTemplates(responseTemplate.content);
        }
      })();

      setLocalLoading(false);
    }
  }, []);

  return (
    <Form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        handleSubmit(messageSend, e, "Success", "Fail");
      }}
    >
      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="receiverId"
        label="Receiver"
      >
        <Select
          placeholder="Select a receiver"
          options={users.map((user) => {
            return { label: user.username, value: user.id };
          })}
        />
      </Form.Item>

      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="title"
        label="Title"
      >
        <Input placeholder="Title" />
      </Form.Item>

      <Form.Item name="messageTemplate" label="Message Template">
        <Select
          placeholder="Select a message template"
          onChange={(e) => {
            formRef.setFieldsValue({ message: e });
          }}
          options={templates.map((template) => {
            return {
              label: template.title,
              value: `【${template.signature}】${template.message}`,
            };
          })}
        />
      </Form.Item>

      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="message"
        label="Message"
      >
        <Input.TextArea placeholder="Select a message template" />
      </Form.Item>

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default MessageForm;
