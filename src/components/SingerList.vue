<template>
  <div>
    <el-skeleton :loading="!SingerList" animated :count="15">
      <template #template>
        <div class="skeleton-item">
            <el-skeleton-item class="image" variant="image"/>
            <div class="skeleton-info">
                <el-skeleton-item variant="h3" style="width: 100%" />
                <el-skeleton-item variant="text" style="margin-right: 16px;width: 70%" />
                <el-skeleton-item variant="text" style="width: 30%" />
            </div>
        </div>
      </template>
      <template #default>
        <div class="singer">
            <div class="singer-item" v-for="item in SingerList" :key="item.id">
                <em class="caril"><em class="item"></em></em>
                <div class="singer">
                    <el-image :src="item.picUrl" @click="jumpSinger(item.id)"></el-image>
                    <diav class="singer-info">
                        <div class="singer-name"><span  @click="jumpSinger(item.id)">{{linmitByte(item.name,10)}}</span><i class="iconfont icon-collect"></i></div>
                        <div class="singer-size">
                            <span><em>专辑</em>{{item.albumSize}}</span>
                            <span><em>MV</em>{{item.mvSize}}</span>
                        </div>
                    </diav>
                </div>
            </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script>
import { getCurrentInstance } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
export default {
    props:{
        SingerList:Array
    },
    setup(){
        const {proxy} = getCurrentInstance()
        const router = useRouter()
        const jumpSinger = id =>{
            router.push({path:'/artist/singer',query:{id:id}})
        }
        const linmitByte =(str,num)=>{
            return proxy.$utils.linmitByte(str,num)
        }
        return{
            jumpSinger,
            linmitByte
        }
    }
}
</script>

<style lang="less" scoped>
.singer{
    display: flex;
    flex-wrap: wrap;
    .singer-item{
        position: relative;
        width: 33%;
        flex: 33%;
        max-width: calc(100% / 3 - 20px);
        margin: 0px 20px 20px 0px;
        height: 130px;
        background:linear-gradient(135deg,  #ffffff 20%,rgb(240, 237, 237) 100%); 
        border-radius: 12px;
        transition: all .5s linear;
        .singer{
                display: flex;
                justify-content: left;
                width: 100%;
                .el-image{
                    width: 110px;
                    height: 110px;
                    margin: 10px 0px 0px 0px;
                    border-radius: 10%;
                    cursor: pointer;
                    transition: all .5s linear;
                }
                .singer-info{
                    padding: 20px;
                    .singer-name{
                        font-size: 120%;
                        span,i{
                            cursor: pointer;
                        }
                    }
                    .singer-size{
                        width: 100px;
                        font-size: 70%;
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        margin-top: 20%;
                        span{
                            em{
                                display: block;
                                color: var(--color-text);
                            }
                        }
                    }
                }
        }
        .caril{
            position: absolute;
            display: block;
            width: 20px;
            height: 20px;
            right: 10px;
            top: 5%;
            border-radius: 100%;
            background-color: #fafafa;

            .item{
                position: absolute;
                display: block;
                width: 10px;
                height: 10px;
                right: 25%;
                top: 25%;
                border-radius: 100%;
                background-color: #ddd;
            }
        }
        &:hover{
            border-radius: 60px 12px 12px 60px;
            background: linear-gradient(135deg,  #ffffff 20%,#ffb08e 100%);
            .el-image{
                border-radius:100%;
                margin-left: 2%;
            }
        }
    }
}


.el-skeleton{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: left;
    .skeleton-item{
        flex: 33%;
        width: auto;
        max-width: calc(100% / 3 - 20px);
        margin: 0px 20px 20px 0px;
        display: flex;
        justify-content: left;
        flex-direction: row;
        height: 130px;
        background-color: #fff;
        .image{
            flex: 2;
            height: 100%;
        }
        .skeleton-info{
            flex: 3;
            padding: 14px;
        }
    }
}

</style>