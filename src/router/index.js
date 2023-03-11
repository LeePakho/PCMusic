import {createRouter,createWebHashHistory} from 'vue-router'

const routes = [
    {path:'/',redirect:'/index'},
    {path:'/index',name:'index',component:()=>import('@/view/index')},
    {path:'/sheet',name:'sheet',component:()=>import('@/view/sheet')},
    {path:'/rank',name:'rank',component:()=>import('@/view/rank')},
    {path:'/playlist',name:'playlist',component:()=>import('@/view/play')},
    {path:'/playlist/detail',name:'playlistdetail',component:()=>import('@/view/play/detail')},
    {path:'/mvlist',name:'mvlist',component:()=>import('@/view/mvlist')},
    {path:'/mvlist/mv',name:'mv',component:()=>import('@/view/mvlist/mv')},
    {path:'/artist',name:'artist',component:()=>import('@/view/artist')},
    {path:'/cloudsearch',name:'cloudsearch',component:()=>import('@/view/cloudsearch')},
    {path:'/album',name:'album',component:()=>import('@/view/album')},
    {path:'/song',name:'song',component:()=>import('@/view/song')},
    // {path:'/my',name:'my',component:()=>import('@/view/my')},
    
]


const router = createRouter({
    history:createWebHashHistory(),
    routes 
})


export default router
