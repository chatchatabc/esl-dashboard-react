import { Button, Form, FormInstance, Input } from "antd";
import { messageTemplateCreate } from "../../../domain/services/messageTemplateService";

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
        handleSubmit(messageTemplateCreate, e, "Success", "Fail");
      }}
    >
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

export default MessageTemplateForm;
