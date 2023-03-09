<template>
  <el-skeleton
        :loading="!playList"
        animated
        :throttle="500"
        :count="6"
      >
        <template #template>
          <div class="skeleton">
            <el-skeleton-item variant="image" class="skeleton-image"/>
            <div class="skeleton-info">
              <el-skeleton-item variant="text" style="margin-right: 16px;width:80%" />
              <el-skeleton-item variant="text" style="margin-right: 16px;;width:60%" />
              <el-skeleton-item variant="text" style="margin-right: 16px;width:30%" />
            </div>
          </div>
        </template>
        <template #default>
            <div class="hot">
                <div class="item" v-for="item in playList" :key="item.id">
                    <div class="image">
                        <router-link :to="{path:'playlist/detail',query:{id:item.id}}">
                            <el-image :src="item.coverImgUrl"></el-image>
                        </router-link>
                        <span class="num">
                            <i class="iconfont icon-playnum"></i>
                            <span>{{item.playCount}}/{{item.trackCount}}首</span>
                        </span>
                    </div>
                    <div class="info">
                        <div class="name">{{item.name}}</div>
                        <div class="type">
                            <span v-for="(tag,index) in item.tags" :key="index">#{{tag}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </el-skeleton>
</template>

<script>
    export default{
        props:{
            playList:Array
        }
    }
</script>

<style lang="less" scoped>
    .hot{
        display: flex;
        flex-direction: row;
        .item{
            flex: calc(100% / 6);
            max-width: calc(100% / 6 - 50px);
            margin-right: 50px;
            .image{
                position: relative;
                width: 100%;
                cursor: pointer;
                .el-image{
                    width: 100%;
                    height: 100%;
                    z-index: 3;
                }
                .num{
                    position: absolute;
                    display: block;
                    color: #fff;
                    transform: scale(0.8);
                    right: 0;
                    top: 0;
                    z-index: 3;
                    background: linear-gradient(to right,rgba(0,0,0,0) 0%,rgba(0,0,0,0.2) 50%,rgba(0,0,0,0.5) 100%);
                    i{
                        color: #fff;
                    }
                }

                &::after,&::before{
                    position: absolute;
                    content: '';
                    width: 100%;
                    top: 0;
                    right: 0;
                    background: var(--color-text);
                    transition: all .5s linear;
                }
                &::after{
                    height: 80%;
                    top: 10%;
                    left: 5px;
                    z-index: 1;
                    opacity: 0.6;
                }
                &::before{
                    height: 50%;
                    top: 25%;
                    left: 10px;
                    z-index: 2;
                    opacity: 0.4;
                }
                
                &:hover{
                    &::after,&::before{
                        background: var(--color-text-height);
                    }
                }
            }
            .info{
                .name{
                    color: var(--color-text-main);
                }
                .type{
                    font-size: 50%;
                    color: var( --color-text-height);
                    padding-top: 10px;
                    span{
                        padding-right: 5px;
                    }
                }
            }
        }
    }

    .el-skeleton{
        display: flex;
        justify-content: left;
        flex-direction: row;
        .skeleton{
        display: flex;
        flex-direction: column;
        flex: calc(100% / 6);
        max-width: calc(100% / 6 - 30px - (20px / 6));
        margin-right: 30px;
        .skeleton-image{
            height: 200px;
        }
        }
    }

</style>