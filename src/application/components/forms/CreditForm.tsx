import { Button, Form, FormInstance, Input } from "antd";
import { creditAdd } from "../../../domain/services/creditService";

type Props = {
  loading: boolean;
  handleSubmit: (
    action: (params: any) => Promise<any>,
    values: any,
    success: string,
    fail: string,
    queryKey: any[][]
  ) => Promise<any>;
  formRef: FormInstance;
};

function CreditForm({ loading, handleSubmit, formRef }: Props) {
  return (
    <Form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        e.currency = "CNY";
        e.amount = Number(e.amount);
        e.credits = Number(e.credits);
        handleSubmit(
          creditAdd,
          e,
          "Successfully added credit",
          "Failed to add credit",
          [["credits"], ["users"]]
        );
      }}
    >
      <Form.Item name="userId" hidden></Form.Item>

      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
          {
            message: "Must be a currency",
            pattern: /^-?[0-9]+(\.[0-9]{1,2})?$/,
          },
        ]}
        name="credits"
        label="Credits"
      >
        <Input
          classNames={{
            prefix: "border-r pr-2",
          }}
          prefix={"点"}
          placeholder="Credits"
        />
      </Form.Item>

      <Form.Item
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
          {
            message: "Must be a currency",
            pattern: /^-?[0-9]+(\.[0-9]{1,2})?$/,
          },
        ]}
        name="amount"
        label="Amount"
      >
        <Input
          classNames={{
            prefix: "border-r pr-2",
          }}
          prefix={"元"}
          placeholder="Amount"
        />
      </Form.Item>

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default CreditForm;
