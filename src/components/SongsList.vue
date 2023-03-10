<template>
    <div class="song-box">
        <el-row class="song-title">
            <el-col class="song-index" :span="2">序号</el-col>
            <el-col class="song-text" :span="8">音乐标题</el-col>
            <el-col class="song-text" :span="6">歌手</el-col>
            <el-col class="song-text" :span="6">专辑</el-col>
            <el-col class="song-text" :span="2">时长</el-col>
        </el-row>
        <el-row class="song-context" :class="[{'active':index%2==0},{'icon-active':isPlay&&item.id==musicInfo.id}]"  v-for="(item,index) in songList" :key="item.id">
            <el-col :class="songLicense(item.license,'song-index')" :span="2">
                <div class="song-txt">{{indexMethod(index)}}</div>
                <div class="icon">
                    <div class="cloum" style="animation-delay: 1s;"></div>
                    <div class="cloum"></div>
                    <div class="cloum" style="animation-delay: 1.6s;"></div>
                    <div class="cloum" style="animation-delay: 1.4s;"></div>
                    <div class="cloum" style="animation-delay: 1.2s;"></div>
                </div>
                <i :class="playIcon(item)" @click="currentSong(item)"></i>
            </el-col>
            <el-col class="song-text" :span="8"><span class="song-title">{{item.name}}</span></el-col>
            <el-col class="song-text" :span="6">{{item.singerName}}</el-col>
            <el-col class="song-text" :span="6"><span class="song-albumName">{{item.albumName}}</span></el-col>
            <el-col :class="songLicense(item.license,'song-text')" :span="2">
                <div class="song-duration">{{item.duration}}</div>
                <div class="icon-duration">
                    <i class="iconfont icon-add" title="添加到列表" v-if="!mapPlayList.get(item.id)" @click="addList(item)"></i>
                    <i class="iconfont icon-collect"></i>
                    <i class="iconfont icon-del" title="删除" v-if="mapPlayList.get(item.id)" @click="removeList(item)"></i>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'

export default{
    props:{
        songList:Array,
        limit:Number,
        offset:Number,
    },setup(props){
        // const {proxy} = getCurrentInstance()
        const store = useStore()
        const isPlay = computed(()=>store.getters.isPlay)
        const playList = computed(()=>store.getters.playList)//歌单列表 array
        const playIndex = computed(()=>store.getters.playIndex)//当前播放歌单下表
        const musicInfo = computed(()=>playList.value[playIndex.value] || [])//当前播放歌单信息
        const mapPlayList = computed(()=>{//歌单列表 map
            var map = new Map()
            if(playList.value){
                playList.value.forEach(item => {
                    map.set(item.id,item)
                });
            }
            return map
        })

        const indexMethod = index=>{
            if(props.offset > 0){
                return props.offset * props.limit + index + 1
            }else{
                return index + 1
            }
        }
        //样式
        const playIcon = item =>{
            return ['iconfont', isPlay.value && item.id === musicInfo.value.id ? 'icon-pause' : 'icon-play']
        }
        //样式
        const songLicense = (license,str)=>!license?'song-license':str

        const currentSong = item =>{
            if(!isPlay.value || musicInfo.value.id !== item.id){
                store.dispatch('searchPlay',new Array(item))
                store.commit('setIsPlay',true)
            }else{
                store.commit('setIsPlay',false)
            }
        }

        const addList = item =>{
            store.dispatch('addList',new Array(item))
        }

        const removeList = item=>{
            store.dispatch('removeList',new Array(item))
        }

        return{
            isPlay,
            musicInfo,
            mapPlayList,
            indexMethod,
            playIcon,
            currentSong,
            songLicense,
            addList,
            removeList,
        }
    }
}
</script>

<style lang="less" scoped>

.song-text{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.song-box{
    margin: 10px 0px;
    color: rgb(110, 105, 105);
    .song-context{
        height: 40px;
        .iconfont{
            display: none;
        }
        &.active{
            background:  rgb(245, 242, 242);
        }
        &:hover{
            background:  rgb(218, 214, 214);
            .song-index{
                .song-txt{
                    text-align: center;
                    display: none;
                }
                .iconfont{
                    display: block;
                    color: red;
                }
                .icon{
                    display: none;
                }
            }
            .song-text{
                .song-duration{
                    display: none;
                }
                .icon-duration{
                    display: flex;
                    .iconfont{
                        display: flex;
                        justify-content: start;
                        cursor: pointer;
                    }
                }
            }
            .song-txt{
                .icon-duration{
                    display: flex;
                    justify-items: first baseline;
                    .iconfont{
                        display: block;
                        cursor: pointer;
                    }
                }
            }
            .song-license{
                .song-duration{
                    display: block;
                }
                .icon-duration{
                    display: none;
                }
            }
            
        }
        .icon-duration{
            display: none;
        }
        .icon{
            display: none;
            width: 20px;
            height: 13px;
            justify-content: space-between;
            overflow: hidden;
            .cloum{
                width: 2px;
                height: 100%;
                background-color: var(--color-text-height);
                animation: play .9s linear infinite alternate;
                -webkit-animation: play .9s linear infinite alternate;
            }
        }
    }
    .icon-active{
        .song-index{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .song-txt{
                display: none;
            }
            .icon{
                display: flex;
            }
        }
    }
    .song-index,.song-text,.song-license{
        line-height: 40px;
    }
    .song-txt,.song-index,.icon{
        text-align: center;
    }
    .song-index{
        cursor: pointer;
    }
    .song-text{
        text-align: left;
        .song-title,.song-albumName{
            cursor: pointer;
        }
    }
}

@-webkit-keyframes play{
    0%{
        -webkit-transform:translateY(0);
        transform: translateY(0);
    }
    to{
        -webkit-transform:translateY(75%);
        transform: translateY(75%);
    }
}

@keyframes play{
    0%{
        -webkit-transform:translateY(0);
        transform: translateY(0);
    }
    to{
        -webkit-transform:translateY(75%);
        transform: translateY(75%);
    }
}
</style>