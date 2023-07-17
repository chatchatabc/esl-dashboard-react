import { AxiosResponse as AxiosResponseOriginal } from "axios";

export type AxiosResponse<T = any> = AxiosResponseOriginal<
  AxiosResponseData<T> | AxiosResponseError
>;

export type AxiosResponseErrorItem = {
  title: string;
  message: string;
};

export type AxiosResponseData<Data = any> = {
  data: Data;
  errors?: null;
};

export type AxiosResponseError = {
  errors: AxiosResponseErrorItem[];
};
