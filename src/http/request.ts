import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';
import { getMessageInfo } from './status';

interface BaseResponse<T = any> {
    code: number | string;
    message: string;
    data: T;
    status?: number | string;
}

// 创建一个新的axios实例
const service = axios.create({
    // 配置项
    baseURL: import.meta.env.VITE_APP_USE_MOCK
        ? import.meta.env.VITE_APP_MOCK_BASEURL
        : import.meta.env.VITE_APP_API_BASEURL,
    timeout: 10000
});
// axios实例拦截请求
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 在发送请求之前做些什么
        return config;
    },
    (error: AxiosError) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);
// axios实例拦截相应
service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            return response;
        }
        ElMessage({
            message: getMessageInfo(response.status),
            type: 'error'
        });
        return response;
    },
    (error: any) => {
        const { response } = error;
        if (response) {
            ElMessage({
                message: getMessageInfo(response.status),
                type: 'error'
            });
            return Promise.reject(response.data);
        }
        ElMessage({
            message: '网络连接异常，请稍后再试!',
            type: 'error'
        });
    }
);

// 此处相当于二次响应拦截
// 为响应数据进行定制化处理
const requestInstance = <T = any>(config: AxiosRequestConfig): Promise<T> => {
    const conf = config;
    return new Promise((resolve, reject) => {
        service.request<any, AxiosResponse<BaseResponse>>(conf).then((res: AxiosResponse<BaseResponse>) => {
            const data = res.data; // 如果data.code为错误代码返回message信息
            console.log('🚀 ~ service.request<any,AxiosResponse<BaseResponse>> ~ data:', data);
            if (data.code != 0) {
                ElMessage({
                    message: data.message,
                    type: 'error'
                });
                reject(data.message);
            } else {
                ElMessage({
                    message: data.message,
                    type: 'success'
                }); // 此处返回data信息 也就是 api 中配置好的 Response类型
                resolve(data.data as T);
            }
        });
    });
};

export function get<T = any, U = any>(config: AxiosRequestConfig, url: string, params?: U): Promise<T> {
    return requestInstance({ ...config, url, method: 'GET', params: params });
}
export function post<T = any, U = any>(config: AxiosRequestConfig, url: string, data: U): Promise<T> {
    return requestInstance({ ...config, url, method: 'POST', data: data });
}

export function put<T = any, U = any>(config: AxiosRequestConfig, url: string, params?: U): Promise<T> {
    return requestInstance({ ...config, url, method: 'PUT', params: params });
}
export function del<T = any, U = any>(config: AxiosRequestConfig, url: string, data: U): Promise<T> {
    return requestInstance({ ...config, url, method: 'DELETE', data: data });
}

// 一般的后端返回的数据结构
// {
//     'code': 1,
//     'message': '成功',
//     'data': {
//         'id': 1,
//         'name': '张三',
//         'age': 18,
//         'sex': 1,
//         'address': '北京市',
//         'createTime': '2021-08-30 15:49:16',
//         'updateTime': '2021-08-30 15:49:16',
//         'deleteTime': null,
//         'createBy': 1,
//         'updateBy': 1,
//     }

// }

export default service;
