import { message } from "antd";
import axios, { AxiosInstance } from "axios";
import { getSession } from "next-auth/react";
class BaseApi {
  axiosInstance: AxiosInstance;
  constructor(baseURL?: string, defaultParams?: any) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || process.env.BASE_URL,
      headers: {
        "Content-Type": "application/json"
      },
      params: defaultParams,
    });

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const session = await getSession() as any;
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session?.access_token}`;
        }

        return config;
      },
      (error) => {
        message.error('Lỗi không xác định');
        console.log(error);

        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use((response) => {
      return response;
    });
  }

  async GET<T = any>(url: string, params?: any): Promise<T> {
    return this.axiosInstance
      .get(url, { params })
      .then(response => response.data)
      .catch(error => {throw error})
  } 

  async POST<T = any>(url: string, data: any): Promise<T> {
    return this.axiosInstance
      .post(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  async PUT<T = any>(url: string, data: any): Promise<T> {
    return this.axiosInstance
      .put(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  async DELETE<T = any>(url: string): Promise<T> {
    return this.axiosInstance
      .delete(url)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }
}

export { BaseApi }
const ApiClient = new BaseApi()

export default ApiClient