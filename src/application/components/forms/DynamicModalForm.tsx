import { Modal, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import MessageForm from "./MessageForm";
import { modalUpdate } from "../../redux/features/modalSlice";
import MessageTemplateForm from "./MessageTemplateForm";
import UserForm from "./UserForm";
import { globalReset } from "../../redux/features/globalSlice";
import CreditForm from "./CreditForm";
import BookingForm from "./BookingForm";
import dayjs from "dayjs";

function DynamicModalForm() {
  const [loading, setLoading] = React.useState(false);
  const [form] = useForm();
  const modal = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  async function handleSubmit(
    action: (params: Record<string, any>) => Promise<any>,
    params: Record<string, any>,
    messageSuccess: string,
    messageFail: string
  ) {
    setLoading(true);

    const response = await action(params);
    if (!response) {
      message.error(messageFail);
    } else {
      message.success(messageSuccess);
      form.resetFields();
      dispatch(modalUpdate({ show: false }));
      dispatch(globalReset());
    }

    setLoading(false);
  }

  React.useEffect(() => {
    if (modal.data) {
      const obj = { ...modal.data };
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "string" && dayjs(obj[key]).isValid()) {
          obj[key] = dayjs(obj[key]);
        }
      });

      form.setFieldsValue(obj);
    } else {
      form.resetFields();
    }
  }, [modal.data]);

  return (
    <Modal
      open={modal.show}
      title={modal.title}
      onCancel={() => {
        dispatch(modalUpdate({ show: false }));
      }}
      onOk={() => {
        form.submit();
      }}
      confirmLoading={loading}
      okButtonProps={{ className: "bg-blue-500" }}
    >
      <div className="max-h-[500px] overflow-auto">
        {modal.content === "message" && (
          <MessageForm
            loading={loading}
            formRef={form}
            handleSubmit={handleSubmit}
          />
        )}

        {modal.content === "messageTemplate" && (
          <MessageTemplateForm
            loading={loading}
            formRef={form}
            handleSubmit={handleSubmit}
          />
        )}

        {modal.content === "user" && (
          <UserForm
            loading={loading}
            formRef={form}
            handleSubmit={handleSubmit}
          />
        )}

        {modal.content === "credit" && (
          <CreditForm
            loading={loading}
            formRef={form}
            handleSubmit={handleSubmit}
          />
        )}

        {modal.content === "booking" && (
          <BookingForm
            loading={loading}
            formRef={form}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </Modal>
  );
}

export default DynamicModalForm;
