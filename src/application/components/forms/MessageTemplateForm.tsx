import { Button, Form, FormInstance, Input, Select } from "antd";
import {
  messageTemplateCreate,
  messageTemplateUpdate,
} from "../../../domain/services/messageTemplateService";

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

function MessageTemplateForm({ loading, handleSubmit, formRef }: Props) {
  return (
    <Form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        if (e.id) {
          handleSubmit(
            messageTemplateUpdate,
            e,
            "Successfully updated message template.",
            "Failed to update message template."
          );
        } else {
          handleSubmit(
            messageTemplateCreate,
            e,
            "Successfully created message template.",
            "Failed to create message template."
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
        name="title"
        label="Title"
      >
        <Input placeholder="Title" />
      </Form.Item>

      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="signature"
        label="Signature"
      >
        <Input placeholder="Signature" />
      </Form.Item>

      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="smsId"
        label="SMS ID"
      >
        <Input placeholder="SMS_123456789" />
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
        <Input.TextArea placeholder="Message template" />
      </Form.Item>

      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        name="variables"
        label="Variables"
      >
        <Input placeholder="Separated by commas (ex. datetime, name)" />
      </Form.Item>

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
        <Select
          disabled
          options={[
            {
              label: "Active",
              value: 1,
            },
          ]}
          placeholder="Status"
        />
      </Form.Item>

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default MessageTemplateForm;
