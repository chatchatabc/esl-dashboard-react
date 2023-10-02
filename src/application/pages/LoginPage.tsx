import React from "react";
import { authGetUser, authLogin } from "../../domain/services/authService";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { useQuery } from "@tanstack/react-query";
import { utilSaveCookie } from "../../domain/services/utilService";
import { userGetProfile } from "../../domain/services/userService";

export function LoginPage() {
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

  // Get user profile locally
  const user = authGetUser();
  if (user) {
    message.success(`Logged in as ${user.username}.`);
    return <Navigate to="/" />;
  }

  // Get user profile from server
  useQuery({
    queryKey: ["users", "profile"],
    refetchInterval: false,
    queryFn: async () => {
      const res = await userGetProfile();
      if (res) {
        utilSaveCookie("user", JSON.stringify(res));
        message.success(`Logged in as ${res.username}.`);
        navigate("/");
      }
      return null;
    },
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <header className="w-64">
        <h1 className="sr-only">登录到您的帐户</h1>
        <img src="/images/logo-horizontal.webp" alt="logo" />
      </header>

      <Form
        layout="vertical"
        onFinish={handleSubmit}
        className="max-w-lg w-full mt-8 bg-blue-500 bg-opacity-10 mx-auto p-8 border shadow-xl rounded-3xl"
      >
        <header>
          <h2 className="text-2xl font-bold">登录到您的帐户</h2>
        </header>

        <section className="mt-4 [&>*]:my-2">
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "需要一些输入",
              },
            ]}
          >
            <label>
              <p className="text-xs font-bold">用户名</p>
              <Input className="py-2" placeholder="用户名" />
            </label>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "需要一些输入",
              },
            ]}
          >
            <label>
              <p className="text-xs font-bold">密码</p>
              <Input.Password className="py-2" placeholder="密码" />
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
            登入
          </Button>
        </footer>
      </Form>

      <section className="mt-8">
        <a
          href="https://esl-cca.pages.dev"
          className="text-blue-500 font-bold hover:text-blue-600"
        >
          &lt;&lt; 返回主页
        </a>
      </section>
    </div>
  );
}

export default LoginPage;
