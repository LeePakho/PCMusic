<template>
  <el-skeleton
      :loading="loading"
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
        <div class="mvlist">
            <div class="item" v-for="item in mvList" :key="item.id">
                <div class="mvlist-image" @click="jumpMv(item.id)">
                    <i class="iconfont icon-video-play"></i>
                    <el-image :src="item.cover || item.imgurl"></el-image>
                </div>
                <div class="mvlist-info">
                    <div class="name">{{item.name}}</div>
                    <div class="artistName">{{item.artistName}}</div>
                    <div class="duration"><i class="iconfont icon-mvlist"></i>{{$utils.calculationNum(item.playCount)}}</div>
                </div>
            </div>
        </div>
      </template>
    </el-skeleton>
</template>

<script>
import { useRouter } from 'vue-router'
export default {
    props:{
        mvList:Array,
        loading:{
            type:Boolean,
            default:true
        }
    },setup(){
        const router = useRouter()
        const jumpMv = id=>{
            router.push({path:'/mvlist/mv',query:{id}})
        }
        return{
            jumpMv,
        }
    }
}
</script>

<style lang="less" scoped>

.mvlist{
    display: flex;
    justify-content: left;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 0 -10px;
    .item{
        flex: calc(100% / 6);
        max-width: calc(100% / 6 - 20px);
        margin: 10px 10px 0;
        border-radius: 4px;
        cursor: pointer;
    }

    .mvlist-image{
        display: block;
        position: relative;
        width: 100%;
        height: 130px;
        overflow: hidden;
        &:hover{
            
            .icon-video-play{
                opacity: 1;
                transform: scale(1);
            }

            .el-image{
                transform: scale(1.1);
            }
        }
    }

    .icon-video-play{
        display: inline-block;
        position: absolute;
        top: 50%;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 3;
        margin-top: -30px;
        font-size: 60px;
        text-align: center;
        color: #fff;
        opacity: 0;
        transform: scale(.5);
        transition: all .4s linear;
        text-shadow: 2px 2px 10px #000;
    }

    .el-image{
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        z-index: 2;
        transition: all .4s linear;
    }

    .mvlist-info{
        position: relative;
        font-size: 14px;
        padding: 15px 0;

        .name{
            display: block;
            height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .artistName,.duration{
            display: block;
            height: 20px;
            color: #909090;
        }

        .icon-mvlist{
            margin-right: 3px;
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