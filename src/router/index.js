import {createRouter,createWebHashHistory} from 'vue-router'

const routes = [
    {path:'/',redirect:'/index'},
    {path:'/index',name:'index',component:()=>import('@/view/index')},
    {path:'/sheet',name:'sheet',component:()=>import('@/view/sheet')},
    {path:'/rank',name:'rank',component:()=>import('@/view/rank')},
    {path:'/playlist',name:'play',component:()=>import('@/view/play')},
    {path:'/mvlist',name:'mvlist',component:()=>import('@/view/mvlist')},
    {path:'/artist',name:'artist',component:()=>import('@/view/artist')},
    {path:'/my',name:'my',component:()=>import('@/view/my')},
    {path:'/cloudsearch',name:'cloudsearch',component:()=>import('@/view/cloudsearch')},
]


const router = createRouter({
    history:createWebHashHistory(),
    routes 
})


export default router
