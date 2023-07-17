import { restPost } from "../infras/apis/restActions";

export async function authLogin(params: Record<string, any>) {
  const response = await restPost("/auth/login", params, "AuthLogin");

  return response;
}

export function authGetToken() {
  return null;
}
