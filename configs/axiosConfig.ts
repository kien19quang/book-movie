import axios from "axios";

const axiosConfig = axios.create({
  headers: {
    "Content-Type": "application/json"
  },
  baseURL: 'https://api.themoviedb.org/3',
})

// axiosConfig.interceptors.request.use(
//   async (config) => {
//     const session = await getSession() as any
//     if (session?.access_token) {
//       config.headers.Authorization = `Bearer ${session?.access_token}`;
//     }

//     return config
//   },
//   (error) => {
//     message.error('Lỗi không xác định');
//     console.log(error);

//     Promise.reject(error)
//   },
// )

axiosConfig.interceptors.response.use((response) => {
  return response;
});


class BaseApi {
  async GET<T = any>(url: string, params?: any): Promise<T> {
    return axiosConfig
      .get(url, { params })
      .then(response => response.data)
      .catch(error => {throw error})
  } 

  async POST<T = any>(url: string, data: any): Promise<T> {
    return axiosConfig
      .post(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  async PUT<T = any>(url: string, data: any): Promise<T> {
    return axiosConfig
      .put(url, data)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  async DELETE<T = any>(url: string): Promise<T> {
    return axiosConfig
      .delete(url)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }
}

export { axiosConfig }
const ApiClient = new BaseApi()

export default ApiClient