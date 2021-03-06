import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import login from '../components/log/login'
import firstPage from  '../components/firstPage'
import sdkList from '../components/sdk/sdkList'
import addSdk from '../components/sdk/addSdk'
import logout from '../components/log/logout'
import mapManageList from '@/components/mapManage/mapManageList'
import mapInfoList from '@/components/mapManage/mapInfoList'
import mapInfo from '@/components/mapManage/mapInfo'
import licenseManage from '@/components/licenseAuthority/licenseManage'
import licenseCreate1 from '@/components/licenseAuthority/licenseCreate1'
import licenseCreate2 from '@/components/licenseAuthority/licenseCreate2'
import licenseCreate3 from '@/components/licenseAuthority/licenseCreate3'
import licenseInfo from '@/components/licenseAuthority/licenseInfo'
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
          path:'/firstPage',
          name:'firstPage',
          component:firstPage
        },
        {
          path:'/sdkList',
          name:'sdkList',
          component:sdkList
        },
        {
          path: '/service/apikeyList',
          name: 'apikeyList',
          component: ()=>import('@/components/apiKey/apikeyList'),
          children:[
            {
              path: '/service/apikeyInfo',
              name: 'apikeyInfo',
              component: ()=>import('@/components/apiKey/apikeyInfo'),
            },
            {
              path: '/service/createApikey',
              name: 'createApikey',
              component: ()=>import('@/components/apiKey/createApikey'),
            }
          ]
        },
        {
          path:'/addSdk',
          name:'addSdk',
          component:addSdk
        },
        {
          path: '/runMapList',
          name: 'runMapList',
          component: ()=>import('@/components/serviceResourceManagement/runMapList')
        },
        {
          path: '/serviceList',
          name: 'serviceList',
          component: ()=>import('@/components/serviceResourceManagement/serviceList')
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
          path: '/recognitionMsg',
          name: 'recognitionMsg',
          component: ()=>import('@/components/cloudRecognition/recognitionMsg')
        },
        {
          path: '/recognitionSomeMsg',
          name: 'recognitionSomeMsg',
          component: ()=>import('@/components/cloudRecognition/recognitionSomeMsg')
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
          path: '/userList',
          name: 'userList',
          component: ()=>import('@/components/userManager/userList')
        },
        {
          path: '/createUser',
          name: 'createUser',
          component: ()=>import('@/components/userManager/createUser')
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: ()=>import('@/components/userManager/userInfo')
        },
      ]

    },
    // {
    //   path:'/setPassword',
    //   name:'setPassword',
    //   component:()=>import('@/components/userManager/setPassword')
    // },
    // {
    //   path:'/resetPassword',
    //   name:'resetPassword',
    //   component:()=>import('@/components/userManager/setPassword')
    // },
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path:'/logout',
      name:'logout',
      component:logout
    },
    {
      path:'/version',
      name:'version',
      component:()=>import('@/components/version')
    }
  ]
})
