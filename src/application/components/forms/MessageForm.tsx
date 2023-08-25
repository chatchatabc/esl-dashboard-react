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
  const [variables, setVariables] = React.useState<string[]>([]);

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
        const templateVariables: Record<string, any> = {};
        variables.forEach((variable) => {
          templateVariables[variable] = e[`variables.${variable}`];
        });
        e.templateValues = JSON.stringify(templateVariables);

        console.log(e);
        handleSubmit(messageSend, e, "Success", "Fail");
      }}
    >
      <Form.Item name="userId" label="User">
        <Select
          placeholder="Select a user"
          onChange={(e) => {
            const user = users.find((user) => user.id === e);
            if (user && user.phone) {
              formRef.setFieldsValue({ phone: user.phone });
            }
          }}
          options={users.map((user) => {
            const { firstName, lastName, alias } = user;
            if (firstName && lastName) {
              return {
                label: `${firstName} ${lastName}`,
                value: user.id,
              };
            } else if (alias) {
              return { label: alias, value: user.id };
            }
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
          {
            pattern: /^(\+)?[0-9]+$/,
            message: "Only numbers are allowed",
          },
        ]}
        name="phone"
        label="Phone Number"
      >
        <Input placeholder="Phone Number" />
      </Form.Item>

      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="messageTemplateId"
        label="Message Template"
      >
        <Select
          placeholder="Select a message template"
          onChange={(e) => {
            const template = templates.find((t) => {
              return t.id === e;
            });

            if (template) {
              setVariables(template.variables.split(", "));
              formRef.setFieldsValue({
                message: `【${template.signature}】${template.message}`,
              });
            }
          }}
          options={templates.map((template) => {
            return {
              label: template.title,
              value: template.id,
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
        <Input.TextArea placeholder="Select a message template" readOnly />
      </Form.Item>

      {variables.map((variable) => {
        return (
          <Form.Item
            key={variable}
            rules={[
              {
                required: true,
                message: "Need some input here",
              },
            ]}
            name={`variables.${variable}`}
            label={variable}
          >
            <Input placeholder={variable} />
          </Form.Item>
        );
      })}

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default MessageForm;
