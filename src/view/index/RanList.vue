<template>
    <el-skeleton :loading="!info.songList" animated :count="4">
    <template #template>
        <div class="ske-item">
            <el-skeleton-item variant="h3" style="width: 40%;display: block;" />
            <el-skeleton-item variant="text" style="width: 70%;margin:10px 0;" />
            <div class="ske-info" v-for="item in info.num" :key="item">
                <el-skeleton-item class="ske-image" variant="image"/>
                <div class="ske-txt">
                    <el-skeleton-item class="ske-text" variant="text" style="width: 50%" />
                    <el-skeleton-item class="ske-text" variant="text" style="width: 70%" />
                </div>
            </div>
        </div>
    </template>
    <template #default>
        <div class="ran">
            <div class="item" v-for="top in info.topList" :key="top.id">
                <div class="title">{{top.name}}</div>
                <div class="time"><span>最近更新：</span><span>{{getUpData(top.updateTime)}}</span><span>（{{top.updateFrequency}}）</span></div>
                <div class="info" v-for="item in info.songList[top.id]" :key="item.id">
                    <el-image :src="item.album.picUrl" @click="jumpSong(item.id)"></el-image>
                    <div class="songinfo">
                        <div class="txt name">{{item.name}}</div>
                        <div class="txt singerName">{{item.singerName}}</div>
                        <div class="songoperate" v-if="item.license">
                            <i class="iconfont icon-add" title="添加到列表"></i>
                            <i class="iconfont icon-fav" title="添加到收藏"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    </el-skeleton>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive } from "vue"
import { useRouter } from "vue-router"

    const info = reactive({
        topList:[],
        songList: {},
        limit:6,
        num:6
    })

    const {proxy} = getCurrentInstance()
    const router = useRouter()

    const getRanList = async() =>{
        const {data:res} = await proxy.$http.topList()
        if(res.code !== 200){
            return proxy.$http.error("请求失败")
        }
        info.topList = res.list.splice(0,4)
        info.topList.forEach(async({id})=>{
            const {data:res} = await proxy.$http.playlistDetail({id})
            info.songList[id] = res.playlist.tracks && res.playlist.tracks.splice(0,info.limit).map((item,index)=>{
                return{
                        id: item.id,
                        name: proxy.$utils.getStringByte(item.name)>30?item.name.substring(0,14)+'...':item.name,
                        mvId: item.mv,
                        singer: item.ar,
                        singerName:proxy.$utils.getSingerName(item.ar),
                        album: item.al,
                        albumName: proxy.$utils.getStringByte(item.al.name)>30?item.al.name.substring(0,14)+'...':item.al.name,
                        alia: item.alia,
                        vip: item.fee === 1,
                        publishTime:proxy.$utils.formatMsgTime(item.publishTime),
                        license:islicense(id,item.id,index),//版权
                        duration: proxy.$utils.formatSongTime(item.dt),
                        url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
                }
            })
        })
    }

    const getUpData = publishTime =>{
        return proxy.$utils.formatMsgTime(publishTime)
    }

     //版权
    const islicense = async (listId,id,index) =>{
        const {data:res} = await proxy.$http.checkMusic(id)
        info.songList[listId][index].license = res.success
    }

    const jumpSong = id =>{
        router.push({path:'/song',query:{id:id}})
    }

    onMounted(()=>{
        getRanList()
    })

</script>

<style lang="less" scoped>
    
    .ran{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 40px;
        .item{
            flex: 25%;
            padding: 30px 20px 20px 20px;
            max-width: calc(100% / 4 - 60px);
            background: #fff;
            border-radius: 10px;
            .title{
                color: var(--color-text-main);
                font-size: 25px;
            }
            .time{
                font-size: 50%;
                color: var(--color-text);
            }
            .info{
                margin: 15px 0;
                display: flex;
                justify-content: left;
                overflow: hidden;
                .el-image{
                    flex: 1 ;
                    border-radius: 10px;
                    cursor: pointer;
                }
                .songinfo{
                    position: relative;
                    flex:5;
                    font-size: 70%;
                    padding: 0 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    .singerName{
                        color: var(--color-text);
                    }
                    .name{
                        transition: all .5s ease-in;  
                        -webkit-transition: all 0.5s ease-in; 
                    }
                    .songoperate{
                        display: none;
                        position: absolute;
                        top: 35%;
                        right: 0;
                        i{
                            margin-left: 10px;
                            cursor: pointer;
                        }
                    }
                }

                &:hover{
                    .songoperate{
                        display: block;
                    }
                    .name{
                        transform: translate(10%, 0);
                    }
                }
            }
        }
    }

    .el-skeleton{
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        .ske-item{
            flex: 25%;
            width: auto;
            max-width: calc(100% / 4 - 60px);
            background: #fff;
            border-radius: 10px;
            padding: 30px 20px 20px 20px;
            .ske-info{
                display: flex;
                justify-content: left;
                margin: 10px 0;
                .ske-image{
                    flex: 1;
                    height: 50px;
                }
                .ske-txt{
                    padding: 5px 20px;
                    flex: 4;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
            }
        }
    }


</style>