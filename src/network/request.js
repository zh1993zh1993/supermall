import axios from 'axios'
// 最终方案   1.创建axios实例
export function request(config) {
  const instance=axios.create({
    baseURL:'http://152.136.185.210:8000/api/h8',
    timeout:5000
  })
  // 2.axios的拦截器
  // 2.1请求拦截的作用，哪些情况下会使用拦截器？？
  instance.interceptors.request.use(config=>{
    // console.log(config);
    /*
    哪些情况下会使用拦截器？？
    1.比如config中的一些信息不符合服务器的要求
    2.比如每次发送网络请求时，都希望在界面中显示一个请求的图标
    3.某些网络请求（比如登录（token）），必须携带一些特殊的信息*/

    return config
  },err => {

  })
  // 2.2响应拦截
  instance.interceptors.response.use(res =>{
    return res.data
  },err=>{
    console.log(err);
  })

  // 3. 发送真正的网络请求
  return instance(config)
}
