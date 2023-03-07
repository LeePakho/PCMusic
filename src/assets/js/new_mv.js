import { getCurrentInstance, onMounted, reactive } from "vue"

export default function playlistmv(){

    const {proxy} = getCurrentInstance()

    const mv_info = reactive({
        mvList:[],
        mvIndex:0,
        limit:12,
        mvType:['全部','内地','港台','欧美','日本','韩国'],
        area:''
    })

    const getmv = async()=>{
        const {data:res} = await proxy.$http.mvFirst({area:mv_info.area,limit:mv_info.limit})
        if(res.code !== 200){
            return proxy.$msg.error("请求失败");
        }
        mv_info.mvList = res.data
    }

    const changeMvIndex = index =>{
        if(index == mv_info.mvIndex){
            return
        }
        mv_info.mvIndex = index
        mv_info.area = index == 0 ? '' :  mv_info.mvType[index]
        getmv()
    }

    onMounted(()=>{
        getmv()
    })

    return{
        mv_info,
        changeMvIndex
    }
}