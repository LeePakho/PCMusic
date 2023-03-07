<template>
  <el-carousel :interval="5000" arrow='never' indicator-position="outside">
    <el-carousel-item class="box" v-for="(list,index) in info.lists" :key="index">
      <router-link class="item" :to="{path:'/singer',query:{id:item.id}}" v-for="item in list" :key="item.id">
        <el-image :src="item.picUrl"></el-image>
      </router-link>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive } from 'vue'

    const { proxy } = getCurrentInstance()

    const info = reactive({
        limit:36,
        lists:[],
        count:12,
    })

    const getlist = async()=>{
        const {data:res} = await proxy.$http.topArtists({limit:info.limit})
        if(res.code !== 200){
            return proxy.$msg.error("请求失败")
        }
        info.list = res.artists
        info.lists = splitGroup(res.artists,info.count)
    }

    const splitGroup = (array,GroupLength)=>{
        let index = 0
        let newarray = []
        while(index<array.length){
            newarray.push(array.slice(index,index+=GroupLength))
        }
        return newarray
    }


    onMounted(()=>{
        getlist()
    })
 
</script>

<style lang="less" scoped>
    .box{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;
        padding: 0;
        .item{
            flex: 25%;
            max-width: calc(100% / 4 - 10px);
            .el-image{
                border-radius: 10px;
            }
        }
    }
.el-carousel{
    margin-bottom: 0;
}
</style>