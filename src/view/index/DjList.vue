<template>
  <div class="dj-list">
    <div class="item" v-for="item in info.djlist" :key="item.id">
        <div class="image">
            <el-image :src="item.picUrl"></el-image>
        </div>
        <div class="info">
            <div class="name"><i class="iconfont icon-dj"></i><span>{{item.name}}</span></div>
            <div class="rcmdtext">{{item.rcmdtext}}</div>
            <div class="count"><span>共{{item.programCount}}</span><span>订阅{{item.subCount}}次</span></div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive } from "vue"

    const { proxy } = getCurrentInstance()

    const info = reactive({
        limit:6,
        djlist:[]
    })

    const getdjhot = async(limit)=>{
        const {data:res} = await proxy.$http.djHot({limit})
        if(res.code !== 200){
            return proxy.$msg.error("请求失败")
        }
        info.djlist = res.djRadios
        
    }

    onMounted(()=>{
        getdjhot(info.limit)
    })

</script>

<style lang="less" scoped>
    .dj-list{
        display: flex;
        flex-direction: row;
        justify-content: left;
        flex-wrap: wrap;
        .item{
            flex: 50%;
            display: flex;
            flex-direction: row;
            justify-content: left;
            margin-bottom: 10px;
            cursor: pointer;
            .image{
                flex: 1;
                .el-image{
                    border-radius: 10px;
                }
            }
            .info{
                flex: 3;
                // margin-left: 5%;
                padding: 10px 20px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .name{
                    color: var(--color-text-main);
                    font-size: 20px;
                    font-weight: 400;
                    i{
                        color: var(--color-text-main);
                    }
                }
                .count{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                }
                .rcmdtext,.count{
                    font-size: 10px;
                    color: var(--color-text);
                }
            }
        }
    }
</style>