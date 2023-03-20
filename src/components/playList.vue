<template>
     <el-skeleton
      :loading="loading"
      animated
      :count="18"
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
        <div class="play">
            <div class="item" v-for="item in sheetList" :key="item.id">
                <div class="play-image">
                    <el-image :src="item.coverImgUrl" @click="jumpSheet(item.id)"></el-image>
                    <div class="play-hear">
                        <i class="iconfont icon-playnum"></i><div>{{calculationNum(item.playCount)}}/{{item.trackCount}}首</div>
                    </div>
                </div>
                <div class="info">
                    <div class="play-name">{{item.name}}</div>
                    <div class="trags" v-if="item.tags">
                        <span class="trag" v-for="(trag,index) in item.tags" :key="index">#{{trag}}</span>
                    </div>
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
        sheetList:Array,
        loading:{
                type:Boolean,
                default:true,
            }
    },
    setup(){
        const {proxy} = getCurrentInstance()
        const router = useRouter()

        const calculationNum = num =>{
            return proxy.$utils.calculationNum(num)
        }

        const linmitString = (str = '',val)=>{
            let _str = str
            const num = proxy.$utils.getStringByte(str)
            if(num>=val){
                _str = str.substring(0,val/2) + "..."
            }
            return _str
        }

        const jumpSheet = id =>{
            router.push({path:'/playlist/detail',query:{id}})
        }
        return{
            jumpSheet,
            calculationNum,
            linmitString,
        }
    }
}
</script>

<style lang="less" scoped>

.play{
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    .item{
        max-width: calc(100% / 6 - 40px);
        flex: calc(100% / 6);
        padding: 0px 40px 20px 0px;
        .play-image{
            position: relative;
            .el-image{
                z-index: 3;
                cursor: pointer;
            }
            .play-hear{
                display: inline-flex;
                gap: 10px;
                font-size: 12px;
                padding: 3% 5px ;
                text-align: center;
                color: white;
                gap: 10px;
                position: absolute;
                top: 0;
                right: 0;
                background: linear-gradient(to right,rgba(0, 0, 0,0) 10%,rgba(0,0,0,.2) 20%,rgba(0,0,0,.5) 100%);
                i{
                    color: white;
                }
            }
            &::after,&::before{
                content: "";
                position: absolute;
                right: 0;
                width: 100%;
                background: #909090;
            }
            &::after{
                top: 10%;
                transform: translateX(5px);
                height: 80%;
                opacity: .4;
            }
            &::before{
                top: 20%;
                transform: translateX(10px);
                height: 60%;
                opacity: .2;
            }
            &:hover{
                &::after,&::before{
                    background: #ff641e;
                }
            }
        }
        .info{
            .play-name{
                font-size: 16px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                padding: 5% 0 ;
            }
            .trags{
                display: flex;
                color: #ff641e;
                gap: 3%;
            }
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