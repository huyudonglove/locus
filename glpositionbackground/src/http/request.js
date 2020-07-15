import http from '../http'
import {loadRequest} from '../util' //loading遮罩层
import { Message,Loading } from 'element-ui';
const login=(msg)=>{
   return  http.post('/api/location/access/login',msg)
}
/* 获取验证码h */
const getCode = () => {
  return http.get('/api/recorded/access/getIdentifyCode')
}
/*获取sdk列表*/
const  getSdk=(msg)=>{
  return http.post('/api/location/background/sdk/list/page',msg)
}
/**上传sdk*/
const upSdk=(msg)=>{
  return http.post('/api/file/upload',msg)
}
/*新增sdk*/
const addSdk=(msg)=>{
  return http.post('/api/location/background/sdk/add',msg)
}
/*上下架*/
const operationSdk=(msg)=>{
  return http.post('/api/location/background/sdk/operation',msg)
}
/*删除sdk*/
const deleteSdk=(id)=>{
  return loadRequest('/api/location/background/sdk/delete',{id:id},'删除',http,'get')
}
/*获取sdk详情*/
const sdkInfo=(id)=> {
  return http.get('/api/location/background/sdk/info', {id: id})
}
/*编辑sdk*/
const updateSdk=(msg)=>{
  return http.post('/api/location/background/sdk/update',msg)
}
/** 服务器资源管理-  分页获取定位服务资源 w*/
export function serverList(params) {
  let pageNum = parseInt(params.page)||1;
  let pageSize = parseInt(params.limit)||20;
  return new Promise((resolve,reject)=>{
    http.post('/api/location/servermgt/page/server',{pageNum,pageSize}).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}

/**服务器资源管理 -  分页获取地图运行状态 w*/
export function mapState(params) {
  let pageNum = parseInt(params.page)||1;
  let pageSize = parseInt(params.limit)||20;
  return new Promise((resolve,reject)=>{
    http.post('/api/location/servermgt/page/mapState',{pageNum,pageSize}).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
        resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}



/**服务器资源管理 -  指定服务停止任务,自动分配   停止 w*/
export function autoStopMap(params) {
  return loadRequest('/api/location/map/info/autoStopMap',params,'停止运行',http,'get')
}
export {
    login,
    getCode,
    getSdk,
    upSdk,
    addSdk,
    operationSdk,
    deleteSdk,
    sdkInfo,
    updateSdk
}
