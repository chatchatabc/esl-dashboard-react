import { AxiosRequestConfig } from "axios";
import { authGetToken } from "../../services/authService";
import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axiosActions";

const baseUrl = "/api";

function restConfig() {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const token = authGetToken();
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }

  return config;
}

export async function restGet(
  url: string,
  params: Record<string, any> = {},
  title: string = "REST GET"
) {
  const config = restConfig();
  config.params = params;

  const response = await axiosGet(baseUrl + url, config, title);

  return response;
}

export async function restPostFormData(
  url: string,
  values: Record<string, any>,
  title: string = "REST POST FORM DATA"
) {
  const config = restConfig();
  config.headers!["Content-Type"] = "multipart/form-data";

  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
  });

  const response = await axiosPost(baseUrl + url, formData, config, title);

  return response;
}

export async function restPost(
  url: string,
  values: Record<string, any>,
  title: string = "REST POST"
) {
  const config = restConfig();

  const response = await axiosPost(baseUrl + url, values, config, title);

  return response;
}

export async function restPut(
  url: string,
  values: Record<string, any>,
  title: string = "REST PUT"
) {
  const config = restConfig();

  const response = await axiosPut(baseUrl + url, values, config, title);

  return response;
}

export async function restDelete(
  url: string,
  values: Record<string, any> = {},
  title: string = "REST DELETE"
) {
  const config = restConfig();

  const response = await axiosDelete(baseUrl + url, values, config, title);

  return response;
}

export async function restPostMultiPart(
  url: string,
  values: Record<string, any>,
  title: string = "REST POST MULTI PART"
) {
  const config = restConfig();
  config.headers!["Content-Type"] = "multipart/form-data";

  const formData = new FormData();
  Object.keys(values).forEach((key) => {
    formData.append(key, values[key]);
  });

  const response = await axiosPost(baseUrl + url, formData, config, title);

  return response;
}
