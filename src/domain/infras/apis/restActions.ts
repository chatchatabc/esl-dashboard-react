import { AxiosRequestConfig } from "axios";
import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axiosActions";

const baseUrl = "http://localhost:5000/api"; // Dev
// const baseUrl = "https://esl-trpc.bonjomontes.workers.dev/api"; // Prod

function restConfig() {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return config;
}

export async function restGet(
  url: string,
  params: AxiosRequestConfig["params"],
  config: AxiosRequestConfig
) {
  config = { ...restConfig(), ...config };
  const response = await axiosGet(baseUrl + url, params, config);
  return response;
}

export async function restPost(
  url: string,
  values: Record<string, any>,
  config: AxiosRequestConfig
) {
  config = { ...restConfig(), ...config };
  const response = await axiosPost(baseUrl + url, values, config);
  return response;
}

export async function restPut(
  url: string,
  values: Record<string, any>,
  config: AxiosRequestConfig
) {
  config = { ...restConfig(), ...config };
  const response = await axiosPut(baseUrl + url, values, config);
  return response;
}

export async function restDelete(
  url: string,
  values: Record<string, any> = {},
  config: AxiosRequestConfig
) {
  config = { ...restConfig(), ...config };
  const response = await axiosDelete(baseUrl + url, values, config);
  return response;
}
