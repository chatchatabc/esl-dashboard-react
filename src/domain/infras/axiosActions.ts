import axios, { AxiosRequestConfig } from "axios";
import { AxiosResponse, AxiosResponseErrorItem } from "../models/AxiosModel";

const baseUrl = import.meta.env.VITE_WORKER_URL;

function axiosHandleError(e: any): AxiosResponse {
  if (!e.response) {
    return {
      ...e,
      data: {
        errors: [
          {
            title: "NO_SERVER_RESPONSE_ERROR",
            message: "NO_SERVER_RESPONSE_ERROR",
          },
        ],
      },
    };
  }

  const errors: AxiosResponseErrorItem[] = e.response?.data?.errors;

  if (errors) {
    if (errors.length) {
      return e.response;
    }

    e.response.data = {
      errors: [
        {
          title: "EMPTY_ERROR_LIST",
          message: "EMPTY_ERROR_LIST",
        },
      ],
    };
    return e.response;
  } else {
    e.response.data = {
      errors: [
        {
          title: "NULL_OR_UNDEFINED_ERR",
          message: "NULL_OR_UNDEFINED_ERR",
        },
      ],
    };
  }

  return e.response;
}

function axiosDebug(params: {
  url: string;
  method: "GET" | "PUT" | "POST" | "DELETE";
  params?: Record<string, any>;
  data?: Record<string, any>;
  response: Record<string, any>;
  title?: string;
  success: boolean;
}) {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    const title = params.title;
    params.url = `${baseUrl}${params.url}`;

    console.log(
      `${params.success ? "SUCCESS" : "FAILED"} ${title} Debug`,
      params
    );
  }
}

export async function axiosGet(
  url: string,
  config: AxiosRequestConfig,
  title: string
): Promise<AxiosResponse> {
  let response;

  try {
    response = await axios.get(`${baseUrl}${url}`, config);

    if (response.data.errors && response.data.errors.length === 0) {
      response.data.errors = null;
    }
  } catch (e: any) {
    response = axiosHandleError(e);
  }

  if (response.data.errors) {
    axiosDebug({ url, method: "GET", response, title, success: false });
  } else {
    axiosDebug({ url, method: "GET", response, title, success: true });
  }

  return response;
}

export async function axiosPost(
  url: string,
  data: Record<string, any>,
  config: AxiosRequestConfig,
  title: string
): Promise<AxiosResponse> {
  let response;

  try {
    response = await axios.post(`${baseUrl}${url}`, data, config);

    if (response.data.errors && response.data.errors.length === 0) {
      response.data.errors = null;
    }
  } catch (e: any) {
    response = axiosHandleError(e);
  }

  if (response.data.errors) {
    axiosDebug({ url, method: "POST", data, response, title, success: false });
  } else {
    axiosDebug({ url, method: "POST", data, response, title, success: true });
  }

  return response;
}

export async function axiosPut(
  url: string,
  data: Record<string, any>,
  config: AxiosRequestConfig,
  title: string
): Promise<AxiosResponse> {
  let response;

  try {
    response = await axios.put(`${baseUrl}${url}`, data, config);

    if (response.data.errors && response.data.errors.length === 0) {
      response.data.errors = null;
    }
  } catch (e: any) {
    response = axiosHandleError(e);
  }

  if (response.data.errors) {
    axiosDebug({ url, method: "PUT", data, response, title, success: false });
  } else {
    axiosDebug({ url, method: "PUT", data, response, title, success: true });
  }

  return response;
}

export async function axiosDelete(
  url: string,
  data: Record<string, any> = {},
  config: AxiosRequestConfig,
  title: string
): Promise<AxiosResponse> {
  let response;

  try {
    response = await axios.delete(`${baseUrl}${url}`, { ...config, data });

    if (response.data.errors && response.data.errors.length === 0) {
      response.data.errors = null;
    }
  } catch (e: any) {
    response = axiosHandleError(e);
  }

  if (response.data.errors) {
    axiosDebug({
      url,
      method: "DELETE",
      data,
      response,
      title,
      success: false,
    });
  } else {
    axiosDebug({
      url,
      method: "DELETE",
      data,
      response,
      title,
      success: true,
    });
  }

  return response;
}
