import {Message,Loading,MessageBox} from 'element-ui'
export function loadRequest(url,params,name,http,style){
  return new Promise((resolve, reject)=>{
    MessageBox.confirm(`<div style='font-size:20px;font-weight:bold;margin-bottom:20px;'>确认${name}吗</div>`,
    {'dangerouslyUseHTMLString':true,
    'closeOnClickModal':false,
    'showClose':false,
    'confirmButtonClass':'confirmButtonXu',
    'cancelButtonClass':'cancelButtonXu'}).then(y=>{
      let load = Loading.service({
        lock: true,
        text: `${name}中...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)',
        customClass: 'loading_xu',
      });
      http[style](url,params).then(res=>{
        load.close();
        if(res.code){
          Message.error(res.msg);
        }else{
          resolve(res);
          Message({
            message: res.msg,
            center: true,
            type: 'success'
          })
        }
      }).catch(err=>{
        load.close();
      })
    }).catch(n=>{
      console.log('取消');
      // reject();
    })
  })
}
