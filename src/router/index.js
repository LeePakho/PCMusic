import {createRouter,createWebHashHistory} from 'vue-router'

const routes = [
    {path:'/',redirect:'/index'},
    {path:'/index',name:'index',component:()=>import('@/view/index')},
    {path:'/artist/singer',name:'artists',component:()=>import('@/view/singer')},
    {path:'/rank',name:'rank',component:()=>import('@/view/rank')},
    {path:'/playlist',name:'playlist',component:()=>import('@/view/play')},
    {path:'/playlist/detail',name:'playlists',component:()=>import('@/view/play/detail')},
    {path:'/mvlist',name:'mvlist',component:()=>import('@/view/mvlist')},
    {path:'/mvlist/mv',name:'mv',component:()=>import('@/view/mvlist/mv')},
    {path:'/artist',name:'artist',component:()=>import('@/view/artist')},
    {path:'/cloudsearch',name:'cloudsearch',component:()=>import('@/view/cloudsearch')},
    {path:'/album',name:'albums',component:()=>import('@/view/album')},
    {path:'/song',name:'songs',component:()=>import('@/view/song')},
    // {path:'/singer',name:'singer',component:()=>import('@/view/singer')},
    
]

const router = createRouter({
    history:createWebHashHistory(),
    routes 
})


export default router
