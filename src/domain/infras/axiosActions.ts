import axios, { AxiosError, AxiosRequestConfig } from "axios";

export async function axiosGet(
  url: string,
  params: AxiosRequestConfig["params"],
  config: AxiosRequestConfig
) {
  config = { ...config, params };
  try {
    const response = await axios.get(url, config);
    return response;
  } catch (e: any) {
    const error = e as AxiosError;
    return error.response;
  }
}

export async function axiosPost(
  url: string,
  data: any,
  config: AxiosRequestConfig
) {
  try {
    const response = await axios.post(url, data, config);
    return response;
  } catch (e: any) {
    const error = e as AxiosError;
    return error.response;
  }
}

export async function axiosPut(
  url: string,
  data: Record<string, any>,
  config: AxiosRequestConfig
) {
  try {
    const response = await axios.put(url, data, config);
    return response;
  } catch (e: any) {
    const error = e as AxiosError;
    return error.response;
  }
}

export async function axiosDelete(
  url: string,
  data: AxiosRequestConfig["data"],
  config: AxiosRequestConfig
) {
  config = { ...config, data };
  try {
    const response = await axios.delete(url, config);
    return response;
  } catch (e: any) {
    const error = e as AxiosError;
    return error.response;
  }
}
