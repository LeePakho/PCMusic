<template>
  <el-skeleton
      :loading="mvList.length == 0"
      animated
      :count="25"
    >
      <template #template>
        <div class="skeleton-item">
            <el-skeleton-item class="skeleton-iamge" variant="image"/>
            <div class="skeleton-txt">
                <el-skeleton-item variant="h3" style="width: 100%" />
                <el-skeleton-item variant="text" style="margin-right: 16px;width: 60%" />
                <el-skeleton-item variant="text" style="width: 30%" />
            </div>
        </div>
      </template>
      <template #default>
        <div class="mv">
            <div class="item" v-for="item in mvList" :key="item.id">
                <div class="mv-image" @click="jumpMv(item.id)">
                    <i class="iconfont icon-video-play"></i>
                    <el-image :src="item.cover" lazy @click="jumpMv(item.id)"></el-image>
                </div>
                <div class="mv-info">
                    <div class="name">{{linmitByte(item.name,30)}}</div>
                    <div class="artistName">{{item.artistName}}</div>
                    <div class="duration"><i class="iconfont icon-mvlist"></i><span class="duration-num">{{calculation(item.playCount)}}</span></div>
                </div>
            </div>
        </div>
      </template>
    </el-skeleton>
</template>

<script>
import { getCurrentInstance } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
export default {
    props:{
        mvList:Array
    },setup(){
        const {proxy} = getCurrentInstance()
        const router = useRouter()
        const calculation = num =>{
            return proxy.$utils.calculationNum(num)
        }
        const linmitByte =(str,num)=>{
            return proxy.$utils.linmitByte(str,num)
        }
        const jumpMv = id=>{
            router.push({path:'/mv',query:{id}})
        }
        return{
            calculation,
            linmitByte,
            jumpMv,
        }
    }
}
</script>

<style lang="less" scoped>

.mv{
    display: flex;
    flex-wrap: wrap;
    .item{
        flex: 16%;
        max-width: calc(100% / 6 - 10px);
        margin:0 10px 10px 0;
        .mv-info{
            margin-top: calc(100 / 24);
            font-size: 80%;
        }
        .mv-image{
            position: relative;
            width: 100%;
            height: 90px;
            overflow: hidden;
            cursor: pointer;
            .el-image{
                transition: all .5s linear;
                -webkit-transition: all .5s linear;
                // z-index: 2;
            }
            i{
                color: #fff;
                display: block;
                position: absolute;
                z-index: 1;
                top: 45%;
                left: calc(100% / 2 - 8px);
                opacity: 0;
                transition: all .5s linear;
                -webkit-transition: all .5s linear;
            }
            &:hover{
                .el-image{
                    transform: scale(1.2);
                }
                i{
                    opacity: 1;
                    transform: scale(3.5);
                }
            }
        }
    }
    .name,.duration{
        color: var(--color-text-main);
    }
    .artistName{
        color: var(--color-text);
    }
    .duration{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        i{
            display: block;
        }
        span{
            display: block;
            margin-left: calc(100% / 24);
        }
    }
}

.el-skeleton{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: left;
    flex-wrap: wrap;
    .skeleton-item{
        flex: 16%;
        width: auto;
        height: 200px;
        max-width: calc(100% / 6 - 20px);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-right: 20px;
        .skeleton-iamge{
            width: 100%;
            height: 140px;
        }
        .skeleton-txt{
            margin-top: 5%;
        }
    }
}

</style>