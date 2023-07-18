import { restPost } from "../infras/apis/restActions";

export async function authLogin(params: Record<string, any>) {
  const response = await restPost("/auth/login", params, "AuthLogin");

  if (response.data.errors) {
    return response.data;
  }

  // Get token
  const token = response.headers["x-access-token"];
  if (!token) {
    return {
      errors: [
        {
          message: "Token not found",
          title: "Token not found",
        },
      ],
    };
  }

  // Set token to cookie
  document.cookie = `token=${token}; path=/; max-age=86400`;
  return response.data;
}

export function authGetToken() {
  const cookies = document.cookie.split(";");
  const token = cookies.find((cookie) => cookie.includes("token"));
  if (!token) {
    return null;
  }

  return token.split("=")[1];
}
