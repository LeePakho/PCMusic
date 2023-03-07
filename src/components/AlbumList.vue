<template>
  <el-skeleton :loading="albumList.length==0" animated :count="12">
      <template #template>
        <div class="ke-item">
            <el-skeleton-item variant="image" class="ske-img" />
            <div class="ke-info">
                <el-skeleton-item variant="h3" class="ske-name" style="width: 100%"/>
                <el-skeleton-item variant="h3" class="ske-name" style="width: 50%" />
                <el-skeleton-item variant="text" class="ske-text" style="width: 30%" />
            </div>
        </div>
      </template>
      <template #default>
        <div class="album">
            <div class="item" v-for="(item,index) in albumList" :key="index" @click="jumpAlbum(item)">
                <div class="album-img">
                    <el-image :src="item.picUrl" lazy></el-image>
                </div>
                <div class="info">
                    <div class="album-type">{{ item.type }}</div>
                    <div class="album-name">{{ item.name }}</div>
                    <div class="album-Singer">{{ item.Singer }}</div>
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
        albumList:Array
    },
    setup(){
        const router = useRouter()
        const jumpAlbum = (item)=>{
            router.push({path:'/album',query:{
                id:item.id
            }})
        }
        return{
            jumpAlbum
        }
    }
}
</script>

<style lang="less" scoped>

.album{
    display: flex;
    justify-content: left;
    flex-direction: row;
    flex-wrap: wrap;
    color: #000;
    padding-bottom: 20px;
    margin: 0 -10px;
    .item{
        flex: 25%;
        max-width: calc(100% / 4 - 20px);
        margin: 20px 10px 0;
        display: flex;
        border-radius: 4px;
        background: #f0f0f0;
        overflow: hidden;
        .album-img{
            flex: 2;
            border-radius: 4px;
            height: 100%;
            position: relative;
            &::after{
                position: absolute;
                content: "";
                width: 100%;
                height: 100%;
                background: url('@/assets/img/disc.png') no-repeat;
                background-size: contain;
                top: 0;
                right: -20px;
                transition: all .5s linear;
            }
            &:hover{
                &::after{
                    transform: rotate(50deg);
                    right: -30px;
                }
            }
        }
        .info{
            flex: 3;
            position: relative;
            margin-left: 40px;
            .album-type{
                position: absolute;
                top: 8%;
                right: -10%;
                width: 50%;
                background-color: var(--color-text-height);
                color: #f0f0f0;
                text-align: center;
                transform: rotate(45deg);
            }
            .album-name{
                padding: 15% 0;
                font-size: 16px;
                color: var(--color-text-main);
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .album-Singer{
                font-size: 14px;
                color: var(--color-text);
            }
        }

        &:hover{
            .album-name{
                    color: red;
            }
        }
    }
    
    .el-image{
        height: 100%;
        z-index: 3;
    }
}

/** 
.album{
    display: flex;
    justify-content: left;
    flex-direction: row;
    flex-wrap: wrap;
    color: #000;
    .item{
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 80px;
        max-width: calc(100% / 4 - 20px);
        background: #f0f0f0;
        margin: 20px 10px 0 10px;
        overflow: hidden;
        border-radius: 4px;
        cursor: pointer;

        &:hover{
            .album-Singer{
                color: var(--color-text-height);
            }
        }

        .album-img{
            display: block;
            position: relative;
            max-width: 80px;
            max-height: 80px;
            &::after{
                display: inline-block;
                position: absolute;
                width: 100%;
                height: 100%;
                content: '';
                top: 0;
                right: -50%;
                background: url('@/assets/img/disc.png') no-repeat;
                background-size: contain;
                transition: all .4s linear;
            }
        }
        &:hover{
            .album-img::after{
                right: -60%;
                transform: rotate(80deg);
            }
        }
        .el-image{
            border-radius: 4px;
            z-index: 2;
        }
        .info{
            transform: scale(0.8);
            width: 40%;
            display: flex;
            flex-direction: column;
            .album-type{
                position: relative;
                display: block;
                color: #fff;
                width: 100px;
                left: 35%;
                text-align: center;
                transform: rotate(45deg);
                flex: 1;
                background: var(--color-text-height);
            }
            .album-name{
                flex: 2;
            }
            .album-Singer{
                flex: 1;
            }
        }
    }
}
*/


.el-skeleton{
    display: flex;
    width: auto;
    flex-wrap: wrap;
    flex-direction: row;
    justify-self: left;
    padding-bottom: 40px;
    margin: 0 -10px;
    font-size: 0;
    .ke-item{
        display: flex;
        flex: 25%;
        max-width: calc(100%/4 - 10px);
        margin: 20px 10px 0 0;
    }
    .ske-img{
        display: block;
        position: relative;
        width: 120px;
        height: 120px;
        line-height: 150px;
        text-align: center;
    }
    .ke-info{
        position: relative;
        flex: 1;
        margin: 10% 0 0 10%;
        overflow: hidden;
        .ske-name{
            margin: 5px 0;
        }
        .ske-text{
            display: block;
            margin-top: 10px;
            width: 10%;
        }
    }
}
</style>