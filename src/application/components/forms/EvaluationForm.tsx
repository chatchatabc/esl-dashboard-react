import { Button, Form, FormInstance, Input, Select } from "antd";
import { bookingComplete } from "../../../domain/services/bookingService";

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

function EvaluationForm({ loading, handleSubmit, formRef }: Props) {
  return (
    <Form
      data-user-form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        e.credits = Number(e.credits);
        handleSubmit(
          bookingComplete,
          e,
          "Successfully added evaluation!",
          "Failed to add evaluation!",
          [["bookings"]]
        );
      }}
    >
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>

      <div className="flex flex-wrap -mx-1">
        <Form.Item
          className="w-full px-1"
          name="status"
          rules={[
            {
              required: true,
              message: "Need some input here",
            },
          ]}
          label="Status"
          initialValue={1}
        >
          <Select
            placeholder="Status"
            options={[
              { label: "Complete", value: 3 },
              { label: "Absent", value: 5 },
            ]}
          />
        </Form.Item>

        <Form.Item
          className="w-full px-1"
          rules={[
            {
              required: true,
              message: "Need some input here",
            },
          ]}
          name="message"
          label="Feedback"
        >
          <Input.TextArea placeholder="Feedback" />
        </Form.Item>
      </div>

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default EvaluationForm;
