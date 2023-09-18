import React from "react";
import { authGetUserId, authLogin } from "../../domain/services/authService";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";

function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: Record<string, any>) {
    setLoading(true);

    const response = await authLogin(e as any);

    if (!response) {
      message.error("Failed to login.");
      setLoading(false);
    } else {
      message.success("Successfully logged in.");
      navigate("/");
    }
  }

  if (authGetUserId()) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        className="max-w-lg w-full bg-blue-500 bg-opacity-10 mx-auto p-8 border shadow-xl rounded-3xl"
      >
        <header>
          <h1 className="text-2xl font-bold">Sign in</h1>
        </header>

        <section className="mt-4 [&>*]:my-2">
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Need some input here",
              },
            ]}
          >
            <label>
              <p className="text-xs font-bold">Username</p>
              <Input className="py-2" placeholder="Username" />
            </label>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Need some input here",
              },
            ]}
          >
            <label>
              <p className="text-xs font-bold">Password</p>
              <Input.Password className="py-2" placeholder="Password" />
            </label>
          </Form.Item>
        </section>

        <footer className="mt-4 flex space-x-2">
          <Button
            htmlType="submit"
            size="large"
            loading={loading}
            className="px-3 py-1 rounded-md bg-blue-500 text-white"
          >
            Login
          </Button>
        </footer>
      </Form>
    </div>
  );
}

export default LoginPage;
