import axios from 'axios';
import { Message } from 'element-ui';
import VueCookies from 'vue-cookies'
axios.defaults.timeout = 300000;
axios.defaults.baseURL = '';
import {selfCookie} from "../self";
import router from '../router'

//http request 拦截器
axios.interceptors.request.use(
  config => {
    //console.log(config)

    config.data = JSON.stringify(config.data);
    if (config.url == '/api/file/upload' || config.url =='/api/xr/saas/identify/map/upload/image'||config.url =='/api/file/fragment/upload') {
      config.headers = {
        "Content-Type": "multipart/form-data"
      }
    } else {
      config.headers = {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }


    //const token = sessionStorage.getItem('token');
    //const  token=Cookies.get('token')
    //console.log(VueCookies,9999)
    //const token=VueCookies.get(selfCookie);
    const token=localStorage.getItem(selfCookie);
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    //console.log(error,'eeeeee')
    return Promise.reject(err);
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
    //debugger;
    if (response.data.errCode == 2) {
      router.push({
        path: "/login",
        querry: { redirect: router.currentRoute.fullPath }//从哪个页面跳转
      })
    }
    return response;
  },
  error => {
    //console.log( JSON.stringify(error))
    if(error.message.indexOf('timeout')!=-1){
      Message({
        message: '服务器请求超时',
        type: 'error'
      })
    }
    if(error.response.data.code==500){
      Message({
        message: '服务器错误，请稍后再试',
        type: 'error'
      })
    }
    if(error.response.data.status==500){
      Message({
        message: '服务器错误，请稍后再试',
        type: 'error'
      })
    }
    if(error.response.status==500){
      Message.error(error.response.data.msg)
    }
    if(error.response.status==401){
      // Message({
      //   message: error.response.data.message,
      //   type: 'error'
      // })
      localStorage.removeItem(selfCookie);
      router.push({
        path: "/login"
      })
    }
    return Promise.reject(error)
  }
)


export default {
  get(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, {
        params: params
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  post(url,data = {}){
    return new Promise((resolve,reject) => {

      if (url == '/api/xr/saas/song/upload' || url == '/api/file/upload' || url == '/api/xr/saas/identify/map/upload/image'||url=='/api/utopa/ar/material/upload/video'||url=='/api/utopa/ar/material/upload/lrc'||url =='/api/file/fragment/upload'){
        const instance=axios.create({
          withCredentials: true
        })
        instance.post(url,data,{headers: {
            "Content-Type":"multipart/form-data",
            //"Authorization": VueCookies.get(selfCookie)
            "Authorization": localStorage.getItem(selfCookie)
          }})
          .then(response => {
            resolve(response.data);
          },err => {
            reject(err)
          })
      }else{
        axios.post(url,data)
          .then(response => {
            resolve(response.data);
          }, err => {
            reject(err)
          })
      }
    })
  },
  put(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, data)
        .then(response => {
          resolve(response.data);
        }, err => {
          reject(err)
        })
    })
  },
  patch(url, data = {}) {
    return new Promise((resolve, reject) => {
      axios.patch(url, data)
        .then(response => {
          resolve(response.data);
        }, err => {
          reject(err)
        })
    })
  },
}


