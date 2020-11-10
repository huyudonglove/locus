import http from '../http'
import {loadRequest} from '../util' //loading遮罩层
import { Message,Loading } from 'element-ui';
const login=(msg)=>{
   return  http.post('/api/location/access/login',msg)
}

/** 授权管理 License -  列表 w*/
export function licenseList(params){
    let pageNum = parseInt(params.page)||1;
    let pageSize = parseInt(params.limit)||20;
    return new Promise((resolve,reject)=>{
      http.post('/api/location/license/auth/list/page',{pageNum,pageSize}).then(res=>{
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

/** 授权管理 License -  详情 w*/
export function licenseInfo(params) {
    return http.get(`/api/location/license/key/queryByLicenseAuthId`, params)
  }
  /** 授权管理 License -  新增保存 w*/
  export function licenseSave(params) {
    return http.post(`/api/location/license/auth/add`, params)
  }
   /** 授权管理 License -  修改应用名 w*/
   export function licenseEditName(params) {
    return http.post(`/api/location/license/auth/update`, params)
  }
  /** 授权管理 License -  Bundle ID 或者Package Name w*/
  export function licenseEdit(params) {
    return http.post(`/api/location/license/key/add`, params)
  }

  /** 地图库管理 -  列表 w*/
export function mapList(params){
    let pageNum = parseInt(params.page)||1;
    let pageSize = parseInt(params.limit)||20;
    let licenseAuthId = parseInt(params.licnese)||'';
    return new Promise((resolve,reject)=>{
      http.post('/api/location/map/database/list/page',{pageNum,pageSize,licenseAuthId}).then(res=>{
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

    /** 地图库管理 - 详情 列表 w*/
export function mapInfoList(params){
  console.log(params,'params')
    let pageNum = parseInt(params.page)||1;
    let pageSize = parseInt(params.limit)||20;
    let mapName = params.wd||'';
    let mapKey = params.q||'';
    let status = params.status||'';
    let mapDatabaseId = params.mapDatabaseId||'';
    let sortType = params.sortType||'desc';
    let sortField = params.sortField||'create_time';
    return new Promise((resolve,reject)=>{
      http.post('/api/location/map/info/list/page',{pageNum,pageSize,mapName,mapKey,status,mapDatabaseId,sortType,sortField}).then(res=>{
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

   /**地图库管理 -  删除 w*/
   export function mapInfoDel(params) {
    return loadRequest('/api/location/map/info/delete', params, '删除', http, 'get')
  }

  /**地图库管理 -  启动地图，使用自动分配方式    运行地图 w*/
   export function autoStartMap(params) {
    return http.get('/api/location/map/info/autoStartMap',params)
  }
  /**地图库管理 -  指定服务停止任务,自动分配   停止 w*/
  export function autoStopMap(params) {
    return http.get('/api/location/map/info/autoStopMap',params)
  }
/** 账号管理-账号信息 Author:minggui*/
export function userInfo(){
  return http.get('/api/location/middleground/user/current')
}
/** 账号管理-修改密码 Author:minggui*/
export function editPassword(params){
    return http.post('/api/location/middleground/user/modifyPassword',params)
}
/** 转换列表 Author:minggui*/
export function getReplaceList(params){
  let pageNum = params.pageNum||1;
  let pageSize = params.pageSize||20;
  let status = params.status||'';
  let type = params.type;
  let sortField = params.sortField;
  let sortType = params.sortType;
  let mapLocation = params.mapLocation||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/location/map/transform/list/page',{pageNum,pageSize,status,mapLocation,type,sortField,sortType}).then(res=>{
      if(res.code){
          Message.error(res.message);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 转换列表-获取状态列表 Author:minggui*/
export function getStatusList(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/location/map/transform/status/list',params).then(res=>{
      if(res.code){
          Message.error(res.message);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 转换列表-停止转换 Author:minggui*/
export function stopReplace(params){
  return loadRequest('/api/location/map/transform/stopTransform',params,'停止',http,'get')
}
/** apikey-apikey列表 Author:minggui*/
export function getApikeyList(params){
    let pageNum = params.pageNum||1;
    let pageSize = params.pageSize||20;
    let name = params.name||'';
    return new Promise((resolve,reject)=>{
      http.post('/api/location/api/key/list/page',{pageNum,pageSize,name}).then(res=>{
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
/** apikey-创建apikey Author:minggui*/
export function createApikey(params){
    return loadRequest('/api/location/api/key/add',params,'创建',http,'post')
}
/** apikey-删除apikey Author:minggui*/
export function delApikey(params){
    return loadRequest('/api/location/api/key/delete',params,'删除',http,'get')
}

/** apikey-云服务多选框 Author:minggui*/
export function getServerTypeList(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/location/api/key/apiKeyTypeList',params).then(res=>{
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
/** sdk下载-sdk下载列表 Author:minggui*/
export function getSdkList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  return new Promise((resolve,reject)=>{
    http.post('/api/location/middleground/sdk/list/page',{pageNum,pageSize}).then(res=>{
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
/** 图像本地、云识别管理-图库列表 Author:minggui*/
export function getRecognitionList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let name = params.inputX||'';
  let identifiedType = params.identifiedType;
  return new Promise((resolve,reject)=>{
    http.post('/api/location/middleground/IdentifiedImage/Database/list/page',{pageNum,pageSize,name,identifiedType}).then(res=>{
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
/** 图像本地、云识别管理-创建图库 Author:minggui*/
export function addRecognition(params){
  return loadRequest('/api/location/middleground/IdentifiedImage/Database/add',params,'创建识别图库'+params.name,http,'post')
}
/** 图像本地、云识别管理-识别图列表 Author:minggui*/
export function getImageList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let name = params.inputX||'';
  let identifiedImageDatabaseId = params.identifiedImageDatabaseId;
  return new Promise((resolve,reject)=>{
    http.post('/api/location/middleground/IdentifiedImage/list/page',{pageNum,pageSize,name,identifiedImageDatabaseId}).then(res=>{
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
/** 图像本地、云识别管理-检查图像是否重复 Author:minggui*/
export function checkImgIsRepeat(params){
  return http.post('/api/location/middleground/IdentifiedImage/similar',params)
}
/** 图像本地、云识别管理-添加识别图 Author:minggui*/
export function addIdentifiedImage(params){
  if(params.type==5){
   return http.post('/api/location/middleground/IdentifiedImage/add',params)
}else{
  return loadRequest('/api/location/middleground/IdentifiedImage/add',params,'添加识别图',http,'post')
}

}
/** 图像本地、云识别管理-下载识别图 Author:minggui*/
export function downloadIdentifiedImage(params){
  return loadRequest('/api/location/middleground/IdentifiedImage/Database/download',params,'下载',http,'get')
}
/** 地图信息-地图信息 Author:minggui*/
export function getMapInfo(params){
  return http.get('/api/location/map/info/queryById',params)
}
/** 地图信息-获取是否有最新模型数据 Author:minggui*/
export function getMapUpdate(params){
  return http.get('/api/location/map/info/mapresource/info',params)
}
/** 地图信息-获取地图尺寸大小 Author:minggui*/
export function getMapScale(params){
  return http.get('/api/location/map/info/get/mapmodel/scale',params)
}
/** 地图信息-修改地图尺寸大小 Author:minggui*/
export function updateMapScale(params){
  return http.post('/api/location/map/info/update/mapmodel/scale',params)
}
/*上传地图信息 Author:minggui*/
export function upResult(params){
  return http.post('/api/location/map/info/mapResource/update',params)
}
/** 地图信息-修改地图 Author:minggui*/
export function editMapInfo(params){
  return http.post('/api/location/map/info/update',params)
}
  /** 查询最新SDK版本&&下载地址 w*/
  export function sdkInfo(params) {
    return http.get(`/api/location/sdk/info/latest`, params)
  }
/*上传地图信息*/
const upMap=(msg)=>{
  return http.post('/api/location/map/info/add',msg)
}
/*获取地图历史版本*/
const getMapVersion=(mapKey)=>{
  return http.get('/api/location/map/info/versions',{mapKey:mapKey})
}
/*更新地图*/
const changeMainMap=(msg)=>{
  return http.post('/api/location/map/info/changeMainMap',msg)
}
/*删除新版地图*/
const deleteVersion=(mapKey)=>{
  return loadRequest('/api/location/map/info/deleteVersion',{mapKey:mapKey},'删除',http,'get')
}
/*获取折线图*/
const getMapLine=(mapKey)=>{
  return http.get('/api/location/map/info/mapLine/get',{mapKey:mapKey})
}

 /** 新增更新地图曲线 w*/
 export function updateMake(params) {
  return http.post(`/api/location/map/info/mapLine/make`, params)
}


/** 修改识别图备注 w*/
export function updateRemark(params){
  return loadRequest('/api/location/background/IdentifiedImage/updateRemark',params,'保存',http,'post')
}

/** 删除识别图 w*/
export function identifiedImageDelete(params){
  return loadRequest('/api/location/background/IdentifiedImage/delete',{id:params.id},`删除${params.name}`,http,'post')
}

 /** 获取识别度和识别点 w*/
 export function identifiedImageDegree(params) {
  return http.get(`/api/location/middleground/IdentifiedImage/degree`, params)
}

 /** 获取详细 w*/
 export function dentifiedImageInfo(params) {
  return http.get(`/api/location/middleground/IdentifiedImage/info`, params)
}

/** 更换识别图  w*/
export function identifiedImageUpdate(params){
  return http.post('/api/location/middleground/IdentifiedImage/update',params)
}
/*停止转换*/
const stopMap=(id)=>{
  return loadRequest('/api/location/map/transform/stopTransformMap',{mapKey:id},'停止',http,'get')
}
/*获取地图信息详情*/
const checkMapEnableUpdate=(mapKey)=>{
  return http.get('/api/location/map/info/checkMapEnableUpdate',{mapKey:mapKey})
}
/*获取验证码*/
const getCode=()=>{
  return http.get('/api/location/access/getIdentifyCode')
}
/*用户注册*/
const register=(msg)=>{
  return http.post('/api/location/access/register',msg)
}
export {
    login,
    upMap,
    getMapVersion,
    changeMainMap,
    getMapLine,
    deleteVersion,
    stopMap,
    checkMapEnableUpdate,
    getCode,
    register
}
