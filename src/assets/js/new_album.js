import { getCurrentInstance, onMounted, reactive } from "vue";

export default function new_album (){
    
    const {proxy} = getCurrentInstance()

    const new_album_info = reactive({
        albumList:[],
        albumIndex:0,
        albumType:[{name:'全部',type:'ALL'},{name:'华语',type:'ZH'},{name:'欧美',type:'EA'},{name:'韩国',type:'KR'},{name:'日本',type:'JP'}],
        area:'ALL',
        limit:12
    })

    const getAlbumInfo = async area =>{
        const {data:res} = await proxy.$http.topAlbum(area)
        if(res.code !== 200){
            return proxy.$msg.error = "请求失败"
        }
        if(area === 'ALL'){
            new_album_info.albumList = res.weekData.splice(0,12)
        }else{
            new_album_info.albumList = res.monthData.splice(0,12)
        }
        new_album_info.albumList = new_album_info.albumList && new_album_info.albumList.map(item=>{
            return {
                name:proxy.$utils.getStringByte(item.name)>10? item.name.substring(0,4)+'...' : item.name,
                albumId:item.id,
                picUrl:item.picUrl,
                Singer:item.artist.name || '',
                type:item.type,
            }
        })
    }

    const changeAlbumIndex = index =>{
        new_album_info.albumIndex = index
        new_album_info.area = new_album_info.albumType[new_album_info.albumIndex].type
        getAlbumInfo(new_album_info.area)

    }

    onMounted(()=>{
        getAlbumInfo(new_album_info.area)
    })

    return{
        new_album_info,
        changeAlbumIndex,
    }

}

