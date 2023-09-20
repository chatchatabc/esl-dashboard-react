import { Button, DatePicker, Form, FormInstance, Input, Select } from "antd";
import {
  messageCreate,
  messageSend,
  messageUpdate,
} from "../../../domain/services/messageService";
import React from "react";
import { userGetAll } from "../../../domain/services/userService";
import { User } from "../../../../../esl-backend-workers/src/domain/models/UserModel";
import { messageTemplateGetAll } from "../../../domain/services/messageTemplateService";
import { MessageTemplate } from "../../../../../esl-backend-workers/src/domain/models/MessageModel";
import Cron, { HEADER } from "react-cron-generator";
import dayjs from "dayjs";

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

function MessageForm({ loading, handleSubmit, formRef }: Props) {
  const [cronValue, setCronValue] = React.useState("0 0 1 1 1");
  const [localLoading, setLocalLoading] = React.useState(true);
  const [users, setUsers] = React.useState<User[]>([]);
  const [templates, setTemplates] = React.useState<MessageTemplate[]>([]);
  const [variables, setVariables] = React.useState<string[]>([]);
  const [type, setType] = React.useState(1);
  const formValues = formRef.getFieldsValue();

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

  React.useEffect(() => {
    const { message, messageTemplateId, type, id, sendAt } = formValues;
    if ((!message || !message.length) && messageTemplateId) {
      const template = templates.find(
        (template) => template.id === messageTemplateId
      );
      if (template && template.variables) {
        setVariables(template.variables.split(", "));
      }
      if (template) {
        formRef.setFieldsValue({
          message: `【${template.signature}】${template.message}`,
        });
      }
    }

    if (!type && id) {
      if (sendAt) {
        setType(2);
      } else {
        setType(3);
      }
    }
  }, [formValues]);

  // Set values for the shown variables
  React.useEffect(() => {
    if (variables.length) {
      const templateVariables = JSON.parse(
        formRef.getFieldValue("templateValues") ?? "{}"
      );
      variables.forEach((variable) => {
        if (templateVariables[variable]) {
          formRef.setFieldsValue({
            [`variables.${variable}`]: templateVariables[variable],
          });
        }
      });
    }
  }, [variables]);

  return (
    <Form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        // Create template values
        const templateVariables: Record<string, any> = {};
        variables.forEach((variable) => {
          templateVariables[variable] = e[`variables.${variable}`];
        });
        e.templateValues = JSON.stringify(templateVariables);
        e.cron = cronValue;
        if (e.type === 2) {
          e.sendAt = dayjs(e.sendAt).startOf("minute").valueOf();
        } else {
          e.sendAt = undefined;
        }

        if (e.id) {
          if (e.type === 1) {
            e.sendAt = Date.now();
            e.status = 2;
          }
          handleSubmit(
            messageUpdate,
            e,
            "Successfully updated",
            "Failed to update",
            [["messages"]]
          );
        } else if (e.type !== 1) {
          handleSubmit(
            messageCreate,
            e,
            e.sendAt
              ? "Successfully schedule message"
              : "Successfully created recurring message",
            e.sendAt
              ? "Failed to schedule message"
              : "Failed to create recurring message",
            [["messages"]]
          );
        } else {
          handleSubmit(messageSend, e, "Successfully sent", "Failed to send", [
            ["messages"],
          ]);
        }
      }}
    >
      <Form.Item name="id" hidden></Form.Item>
      <Form.Item name="templateValues" hidden></Form.Item>

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

      <div className="flex -mx-1">
        <Form.Item
          className="w-1/2 px-1"
          label="Type"
          name="type"
          initialValue={type}
        >
          <Select
            onChange={(e) => {
              setType(e);
            }}
            options={[
              {
                label: "Send now",
                value: 1,
              },
              {
                label: "Schedule",
                value: 2,
              },
              {
                label: "Recurring",
                value: 3,
              },
            ]}
          ></Select>
        </Form.Item>

        <Form.Item
          className="w-1/2 px-1"
          label="Status"
          name="status"
          initialValue={1}
        >
          <Select
            options={[
              {
                label: "Active",
                value: 1,
              },
              {
                label: "Inactive",
                value: 0,
              },
            ]}
          ></Select>
        </Form.Item>
      </div>

      <Form.Item name="sendAt" label="Send at" hidden={type !== 2}>
        <DatePicker popupClassName="override" className="w-full" showTime />
      </Form.Item>

      <Form.Item
        name="cron"
        label="Schedule"
        hidden={type !== 3}
        initialValue={"0 0 1 1 1"}
      >
        <Cron
          onChange={(e) => {
            setCronValue(e.split(" ").splice(0, 5).join(" "));
          }}
          value={cronValue}
          showResultText={true}
          showResultCron={false}
          options={{
            headers: [
              HEADER.MONTHLY,
              HEADER.WEEKLY,
              HEADER.MINUTES,
              HEADER.HOURLY,
              HEADER.DAILY,
            ],
          }}
        />
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

            if (template && template.variables) {
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
