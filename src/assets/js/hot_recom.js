import { getCurrentInstance, onMounted, reactive } from "vue"

export default function playlisthot(){

    const {proxy} = getCurrentInstance()

    const playListHot_info = reactive({
        playListTags:[],
        playList:[],
        playListIndex:0,
        loading:true,
        playListParams:{order:'hot',cat:'全部',limit:6},
    })

    const getHotTags = async()=>{
        const {data:res} = await proxy.$http.playListHot()
        if(res.code !== 200){
            proxy.$msg.error("请求失败")
        }
        res.tags.unshift({name:'为你推荐'})
        playListHot_info.playListTags = res.tags.splice(0,6)
    }

    const changePlayListIndex = index =>{
        console.log(111)
        if(playListHot_info.playListIndex === index || !playListHot_info.playList){
            return 
        }
        playListHot_info.playListIndex = index
        playListHot_info.playListParams.cat = playListHot_info.playListTags[index].name
        getPlayList()
    }

    const getPlayList = async()=>{
        const {data:res} = await proxy.$http.playList(playListHot_info.playListParams)
        if(res.code !== 200){
            proxy.$msg.error("请求失败")
        }
        playListHot_info.playList = res.playlists
        playListHot_info.loading = false
    }

    onMounted(()=>{
        getHotTags()
        getPlayList()
    })

    return{
        playListHot_info,
        changePlayListIndex,
    }
}