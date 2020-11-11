import Vue from 'vue'
import Router from 'vue-router'
import login from  '@/components/log/login'
import up from '@/components/up'
import home from '@/components/home'
import licenseManage from '@/components/licenseAuthority/licenseManage'
import licenseCreate1 from '@/components/licenseAuthority/licenseCreate1'
import licenseCreate2 from '@/components/licenseAuthority/licenseCreate2'
import licenseCreate3 from '@/components/licenseAuthority/licenseCreate3'
import licenseInfo from '@/components/licenseAuthority/licenseInfo'
import mapManageList from '@/components/mapManage/mapManageList'
import mapInfoList from '@/components/mapManage/mapInfoList'
import mapInfo from '@/components/mapManage/mapInfo'
import logout from  '@/components/log/logout'
import  userManager from '@/components/userManager/userManager'
import  replaceList from '@/components/replaceList/replaceList'
import  apikeyList from '@/components/apikey/apikeyList'
import  apikeyInfo from '@/components/apikey/apikeyInfo'
import  createApikey from '@/components/apikey/createApikey'
import  version from '@/components/version'
import register from '../components/log/register'
import forgot from '../components/log/forgot'
import success from '../components/log/success'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      children:[
        {
          path: '/licenseManage',
          name: 'licenseManage',
          component: licenseManage,
          children:[
            {
              path: '/licenseManage/licenseCreate/1',
              name: 'licenseCreate1',
              component: licenseCreate1,
            },
            {
              path: '/licenseManage/licenseCreate/2',
              name: 'licenseCreate2',
              component: licenseCreate2,
            },
            {
              path: '/licenseManage/licenseCreate/3',
              name: 'licenseCreate3',
              component: licenseCreate3,
            },
            {
              path: '/licenseManage/licenseInfo',
              name: 'licenseInfo',
              component: licenseInfo,
            }
          ]
        },
        {
          path: '/mapManageList',
          name: 'mapManageList',
          component: mapManageList,
          children:[
            {
              path: '/mapManageList/mapInfoList',
              name: 'mapInfoList',
              component: mapInfoList,
              children:[
                {
                  path: '/mapManageList/mapInfoList/mapInfo',
                  name: 'mapInfo',
                  component: mapInfo,
                },
              ]
            }
          ]
        },
        {
          path: '/system/userManager',
          name: 'userManager',
          component: userManager
        },
        {
          path: '/replaceList',
          name: 'replaceList',
          component: replaceList
        },
        {
          path: '/cloudRecognitionList',
          name: 'cloudRecognitionList',
          component: ()=>import('@/components/cloudRecognition/recognitionList')
        },
        {
          path: '/localRecognitionList',
          name: 'localRecognitionList',
          component: ()=>import('@/components/cloudRecognition/recognitionList')
        },
        {
          path: '/createRecognition',
          name: 'createRecognition',
          component: ()=>import('@/components/cloudRecognition/createRecognition')
        },
        {
          path: '/recognitionInfo',
          name: 'recognitionInfo',
          component: ()=>import('@/components/cloudRecognition/recognitionInfo')
        },
        {
          path: '/recognitionSomeMsg',
          name: 'recognitionSomeMsg',
          component: ()=>import('@/components/cloudRecognition/recognitionSomeMsg')
        },
        {
          path: '/recognitionMsg',
          name: 'recognitionMsg',
          component: ()=>import('@/components/cloudRecognition/recognitionMsg')
        },
        {
          path: '/sdkList',
          name: 'sdkList',
          component: ()=>import('@/components/sdk/sdkList')
        },
        {
          path: '/service/apikeyList',
          name: 'apikeyList',
          component: apikeyList,
          children:[
            {
              path: '/service/apikeyInfo',
              name: 'apikeyInfo',
              component: apikeyInfo,
            },
            {
              path: '/service/createApikey',
              name: 'createApikey',
              component: createApikey,
            }
          ]
        }
      ]
    },
    {
      path:'/setPassword',
      name:'setPassword',
      component:()=>import('@/components/userManager/setPassword')
    },
    {
      path:'/resetPassword',
      name:'resetPassword',
      component:()=>import('@/components/userManager/setPassword')
    },
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path:'/up',
      name:'up',
      component:up
    },
    {
      path:'/logout',
      name:'logout',
      component:logout
    },
    {
      path:'/version',
      name:'version',
      component:version
    },
    {
      path:'/register',
      name:'register',
      component:register
    },
    {
      path:'/forgot',
      name:'forgot',
      component:forgot
    },
    {
      path:'/success',
      name:'success',
      component:success
    }
  ]
})
