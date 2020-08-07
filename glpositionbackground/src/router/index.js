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
      ]

    },
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
