import { Button, Form, FormInstance, Select } from "antd";

import {
  bookingOptionStatus,
  bookingUpdateStatusMany,
} from "../../../domain/services/bookingService";

type Props = {
  loading: boolean;
  handleSubmit: (
    action: (params: any) => Promise<any>,
    values: any,
    success: string,
    fail: string,
    queryKey?: any[]
  ) => Promise<any>;
  formRef: FormInstance;
};

function BookingManyForm({ loading, handleSubmit, formRef }: Props) {
  return (
    <Form
      layout="vertical"
      form={formRef}
      onFinish={(e) => {
        handleSubmit(
          bookingUpdateStatusMany,
          e,
          "Successfully updated booking status.",
          "Failed to update booking status.",
          ["bookings"]
        );
      }}
    >
      {/* BookingIds */}
      <Form.Item name="bookingIds" hidden></Form.Item>

      {/* Status */}
      <Form.Item
        name="status"
        rules={[
          {
            required: true,
            message: "Need some input here",
          },
        ]}
        label="Status"
      >
        <Select placeholder="Select a status" options={bookingOptionStatus()} />
      </Form.Item>

      <Form.Item hidden>
        <Button htmlType="submit" loading={loading}></Button>
      </Form.Item>
    </Form>
  );
}

export default BookingManyForm;
