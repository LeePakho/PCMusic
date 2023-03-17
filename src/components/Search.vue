<template>
<el-select
        v-model="value"
        clearable
        filterable
        remote
        placeholder="请输入歌名、歌词、歌手或专辑"
        :remote-method="remoteMethod"
        :fit-input-width="true"
        :loading="loading"
        loading-text="搜索中..."
        @focus="handleFocus"
        @clear="onClear"
      >
        <div class="hot-search" v-if="!value">
            <h5>热门歌曲</h5>
            <el-option
            v-for="(item,index) in serachHot"
            :key="index"
            :value="item.first"
            @click="jumpCloudsearch(item)"
            >
                <span>{{ index+1 }}.</span>
                {{ item.first }}
            </el-option>
        </div>
        <el-option-group
            v-else
            v-for="(item) in order"
            :key="item"
            :label="listType[`${item}`].value"
        >
            <el-option
                v-for="val in searchInfo[`${item}`]"
                :key="val.id"
                :value="val.name"
                @click="jumpOther(item,val.id)"
            />
        </el-option-group>
      </el-select>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
export default {
    setup(){
        const route = useRoute()
        const router = useRouter()
        const {proxy} = getCurrentInstance()
        const info = reactive({
            serachHot:[],
            searchInfo:{},
            loading:false,
            keyValue:'',
            value:'',
            order:[],
            listType: {//1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单
                songs: {value:'单曲',type:1},
                artists: {value:'歌手',type:100},
                albums: {value:'专辑',type:10},
                playlists: {value:'歌单',tyoe:1000}
            },
        })
        //多选模式下移除tag时触发
        const remoteMethod = (val)=>{
            if(val){
                info.value = val
            }
            info.loading = true
            if(info.value.length > 0)
                getSerachSuggest()
        }
        //点击清空按钮时触发
        const onClear = ()=>{
            info.loading = false
        }
        //焦点时触发
        const handleFocus = ()=>{
            if(info.value.length>0){
                info.loading = true
                getSerachSuggest()
            }else{
                info.loading = false
            }
        }
        //热门搜索
        const getSearchHot = async ()=>{
            const {data:res} = await proxy.$http.searchHot()
            if(res.code !==200){
                return ElMessage.error("SearchHot请求出错")
            }
            info.serachHot = res.result.hots
        }
        //搜索建议
        const getSerachSuggest = async()=>{
            if(info.keyValue != info.value){
                info.keyValue = info.value
                const {data:res} = await proxy.$http.searchSuggest(info.value)
                if(res.code != 200){
                    return ElMessage.error("SerachSuggest请求出错")
                }
                info.order = res.result["order"]
                info.order.forEach(item => {
                    info.searchInfo[`${item}`] = res.result[`${item}`]
                });
            }
                info.loading = false
                console.log(info.order)
        }
        //调用热门搜索
        onMounted(()=>getSearchHot())

        //跳转cloudsearch
        const jumpCloudsearch = (item)=>{
            info.keyValue = item.first
            if(item.first === route.query.keywords){
                return;
            }
            router.push({path: '/cloudsearch' ,query: {keywords:item.first}})
        }
        //跳转其他
        const jumpOther = (item,id)=>{
            router.push({name:item,query:{id}})
        }

        return{
            ...toRefs(info),
            remoteMethod,
            handleFocus,
            onClear,
            jumpCloudsearch,
            jumpOther,
        }
    }
}
</script>

<style>

</style>