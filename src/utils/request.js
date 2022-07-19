// axios的二次封装
import axios from "axios";

const request = axios.create({
    // 初始url
    baseURL: 'http://127.0.0.1:8888/api/private/v1/'
})




// 配置请求拦截器
request.interceptors.request.use(config => {
    // 添加请求头字段 token
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})


export default request