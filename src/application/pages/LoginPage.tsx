import React from "react";
import { authGetToken, authLogin } from "../../domain/services/authService";
import { Navigate, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const response = await authLogin(data);

    if (response.errors) {
      alert(response.errors[0].message);
    } else {
      navigate("/");
    }
  }

  if (authGetToken()) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-sm w-full mx-auto p-8 border shadow-xl"
      >
        <header>
          <h1 className="text-2xl font-bold">Sign in</h1>
        </header>

        <section className="mt-4 space-y-2">
          <div>
            <label htmlFor="username" className="flex flex-col">
              <span className="text-xs font-bold">Username</span>
              <input
                required
                className="p-2 border rounded-md"
                id="username"
                placeholder="Username"
                name="username"
              />
            </label>
          </div>

          <div>
            <label htmlFor="password" className="flex flex-col">
              <span className="text-xs font-bold">Password</span>
              <input
                type="password"
                required
                className="p-2 border rounded-md"
                id="password"
                placeholder="Password"
                name="password"
              />
            </label>
          </div>
        </section>

        <footer className="mt-4 flex space-x-2">
          <button className="px-3 py-1 rounded-md bg-blue-500 text-white">
            Login
          </button>
          {/* <button type="button" className="px-3 py-1 text-blue-500">
            Register
          </button> */}
        </footer>
      </form>
    </div>
  );
}

export default LoginPage;
