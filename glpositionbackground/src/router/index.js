import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import login from '../components/log/login'
import firstPage from  '../components/firstPage'
import sdkList from '../components/sdk/sdkList'
import addSdk from '../components/sdk/addSdk'
import logout from '../components/log/logout'
Vue.use(Router)

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
    }

  ]
})
