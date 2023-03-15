<template>
  <div class="song">
    <div class="content">
        <div class="song-content">
            <div class="song-content-letf">
                <div class="content-letf-top">
                    <div class="song-info">
                        <div class="name">{{ info.song.name }}</div>
                        <div class="singer">
                            <span v-for="(ar,index) in info.song.singer" :key="ar.id">{{ index>=1? "/"+ar.name : ar.name }}</span>
                        </div>
                        <div class="al-publishTime">
                            <span class="al" v-if="info.song.album && info.song.album.id != 0">专辑：{{ info.song.album.name }}</span>
                            <span class="publishTime">发行时间：{{ $utils.formartDate(info.song.publishTime,"yyyy-MM-dd") }}</span>
                        </div>
                    </div>
                    <div class="info-buts">
                        <span class="play-btn" @click.stop="plyaing(info.song)"><i :class="['iconfont', playFontIcon]"></i> 立即播放 </span>
                        <span class="play-btn" @click="showAddList"><i class="iconfont icon-collect"></i> 收藏</span>
                        <span class="play-btn" @click="jumpComment"><i class="iconfont icon-comment"></i> 评论</span>
                    </div>
                </div>
                <div class="other-song">
                    <div class="other-title">相似歌曲</div>
                    <div class="other-main">
                        <div class="other-item" v-for="item in info.othersongs" :key="item.id">
                            <div class="item-info">
                                <div class="item-name">{{ item.name }}</div>
                                <div class="item-singer">
                                    <span v-for="(artist,index) in item.artists" :key="artist.id">{{ index>=1? "/"+artist.name : artist.name }}</span>
                                </div>
                            </div>
                            <div class="item-icon">
                                <i :class="['iconfont', playSimiIcon(item.id)]" @click.stop="plyaing(item)"></i>
                                <i class="iconfont icon-add" title="添加到列表"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="song-content-right">
                <div class="words-song" ref="words" @mouseenter="wordsenter" @mouseleave="wordsleave">
                    <div class="words-scrol">
                        <div :class="['words-item',isacitve(index)]" v-for="(item,index) in info.lyric" :key="index">
                            {{ item.str }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <comments :type=0 :id=info.id></comments>
    </div>
    <div class="side">
        <div class="cover" v-if="info.song.album">
            <em class="lt"></em>
            <em class="rt"></em>
            <em class="lb"></em>
            <em class="rb"></em>
            <div class="cover-img" :class="playImg">
                <img class="stylus" src="@/assets/img/stylus.png"/>
                <el-image :src="info.song.album.picUrl"></el-image>
            </div>
        </div>
        <div class="playlist" v-if="info.playlist">
            <div class="title">包含这首歌的歌单</div>
            <div class="item" v-for="item in info.playlist" :key="item.id">
                <el-image :src="item.coverImgUrl"></el-image>
                <div class="info">
                    <div class="name">{{item.name}}</div>
                    <div class="singer">By:{{item.creator.nickname}}</div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import Comments from '@/components/Comments.vue'
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

    const { proxy } = getCurrentInstance()
    const store = useStore()
    const route = useRoute()

    const words = ref(null)
    const info = reactive({
        id:route.query.id,
        song:{},
        lyric:[],
        othersongs:[],
        playlist:[],
        currentTime:0,
        isScroll:false,
        offset: 0,
    })

    // 当前播放信息
    const playinfo = computed(()=>store.state.playinfo)

    // 当前播放状态
    const playFontIcon = computed(()=>playinfo.value.id == info.id && store.getters.isPlay?'icon-audio-pause' : 'icon-audio-play');

    const playImg = computed(()=>playinfo.value.id == info.id && store.getters.isPlay?'active' : '');

    //其他歌曲播放状态
    const playSimiIcon = computed(()=>{
        return function(id){
            return playinfo.value.id === id && store.getters.isPlay?'icon-audio-pause' : 'icon-audio-play'
        }
    })
    
    //播放歌词行数
    const wordindex = computed(()=>{
        for (let index = 0; index < info.lyric.length; index++) {
            if(info.currentTime <= info.lyric[index].time){
                return --index
            }
        }
        return (+info.lyric.length - 2)
    })

    const isacitve = computed(()=>{
        return  function(index){
            return wordindex.value == index && playinfo.value.id == info.id ? "acitve" : ""
        }
    })

    const wordsheight = computed(()=>+(words.value.clientHeight / 2) )

    const plyaing = (song)=>{
        if(song.id == playinfo.value.id && store.getters.isPlay){
            return  store.commit("setIsPlay",false)
        }
        store.dispatch("searchPlay",new Array(song))
        store.commit("setIsPlay",true)
    }

    const getdata = ()=>{
        getsong()
        getlyr()
        getothersongs()
        getsimiPlaylist()
    }

    const getsong = async()=>{
        const {data} = await proxy.$http.songDetail({ids:info.id})
        if(data.code !== 200){
            return proxy.$msg.error("请求失败")
        }
        info.song = data.songs && data.songs.map(item=>{
            return{
                id: item.id,
                name: item.name,
                mvId: item.mv,
                singer: item.ar,
                singerName:proxy.$utils.getSingerName(item.ar),
                album: item.al,
                alia: item.alia,
                vip: item.fee === 1,
                publishTime:item.publishTime,
                license:item.noCopyrightRcmd?false:true,//版权
                duration: proxy.$utils.formatSongTime(item.dt),
                url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
            }
        })
        info.song = info.song[0]
    }

    const getlyr = async()=>{
        const {data} = await proxy.$http.lyric({id:info.id})
        info.lyric = parselyr(data.lrc.lyric)
    }

    const parselyr = (lyr)=>{
        return lyr.split("\n").filter(item=>item.trim()!=="").map(item=>{
            let timestr = item.split("]")[0].split("[")[1]
            let str = item.split("]")[1]
            return {
                time:parsetime(timestr),
                str
            }
        })
    }

    const parsetime = (timestr) =>{
        let parts = timestr.split(":")
        return +parts[0] * 60 + +parts[1]
    }

    const getothersongs = async()=>{
        const {data} = await proxy.$http.simiSong({id:info.id})
        info.othersongs = data.songs && data.songs.map(item=>{
            return{
                id: item.id,
                name: item.name,
                mvId: item.mvid,
                singer: item.artists,
                singerName:proxy.$utils.getSingerName(item.artists),
                album: item.album,
                alia: item.alias,
                vip: item.fee === 1,
                publishTime:item.album.publishTime,
                license:item.noCopyrightRcmd?false:true,//版权
                duration: proxy.$utils.formatSongTime(item.duration),
                url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
            }
        })
    }

    const getsimiPlaylist = async()=>{
        const {data} = await proxy.$http.simiPlaylist({id:info.id})
        info.playlist = data.playlists
    }

    const shiftwodr = ()=>{
        if(info.isScroll){
            return
        }
        var offset = 0;
        let scrollheight = words.value.firstElementChild.clientHeight
        let childNodes = [...words.value.firstElementChild.childNodes]
        childNodes.filter((node,index)=>(index<=wordindex.value)&&!isNaN(node.clientHeight)).map(item=>offset += item.clientHeight)  
        if(offset>wordsheight.value){
            info.offset = scrollheight-offset>wordsheight.value?offset - wordsheight.value : scrollheight-(2*wordsheight.value)+15
            return words.value.firstElementChild.style.transform= `translateY(-${info.offset}px)`
        }
    }

    const wordsenter = ()=>{
        info.isScroll = true
        words.value.scrollTop = info.offset ? info.offset : 0
        words.value.firstElementChild.style.transition= '0s'
        words.value.firstElementChild.style.transform= `translateY(0px)`
    }

    const wordsleave = ()=>{
        info.isScroll = false
        shiftwodr()
        words.value.scrollTop = 0
        words.value.firstElementChild.style.transition= '.3s'
    }

    let bus = ()=>{
        proxy.$bus.on("sendcurrentTime",(currentTime)=>{
            info.currentTime = currentTime 
            shiftwodr()
        })
        proxy.$bus.on("ended",()=>{
            info.offset = 0
            words.value.firstElementChild.style.transform= `translateY(-${info.offset}px)`
        })
    }
    
    onMounted(()=>{
        getdata()
        bus()
    })

    onBeforeUnmount(()=>{
        bus = null
    })
</script>

<style lang="less" scoped>

.song{
    display: flex;
    justify-content: left;
    gap: 1rem;

    .content{
        flex: 8;
    }

    .side{
        flex: 3;
    }
}

.song-content{
    display: flex;
    justify-content: left;
    gap: 1rem;
    .song-content-letf{
        flex: 4;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 100%;
        .content-letf-top,.other-song{
            background-color: #fff;
            padding: 30px 20px;
            border-radius: 10px;
        }
    }
    .song-content-right{
        flex: 6;
    }

}

.content-letf-top{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 3rem;
    .song-info{
        .name{
            font-size: 30px;
            font-weight: 200px;
            margin-bottom: 10px;
        }
        .singer{
            margin: 10px 0;
            font-size: 16px;
        }
        .al-publishTime{
            margin: 10px 0;
            font-size: 14px;
            .publishTime{
                padding: 0 20px;
            }
        }
    }
    .info-buts{
        display: flex;
        gap: 20px;
        .play-btn{
            font-size: 14px;
            padding: 5px 10px;
            background-color:#f4f4f5;
            border-radius: 14px;
            white-space: nowrap;
            cursor: pointer;
        }
        .play-all{
            background-color:#ff641e;
            color: #fff;
            i{
                color: #fff;
            }
        }
    }
}

.other-song{
    .other-title{
        display: block;
        font-size: 16px;
        font-weight: 400px;
        line-height: 24px;
        &::before{
            content: "";
            display: inline-block;
            width: 4px;
            height: 16px;
            border-radius: 4px;
            margin-right: 5px;
            background-color: #ff641e;
            vertical-align: text-top;
        }
    }
    .other-main{
        font-size: 12px;
        .other-item{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            border-bottom: 1px solid #f4f4f5;
            .item-info{
                .item-name{
                    color: var(--color-text-main);
                    margin-top: 3px;
                }
                .item-singer{
                    color: var(--color-text);
                    margin: 3px 0;
                }
            }
            .item-icon{
                display: flex;
                align-items: center;
                i{
                    font-size: 16px;
                    margin: 0 5px;
                    cursor: pointer;
                }
            }
            &:last-child{
                border: 0;
            }
        }
    }
}

.words-song{
    height: 29rem;
    overflow-y: scroll;
    background-color: #fff;
    border-radius: 10px;
    padding: 0;
    margin: 0;
    .words-scrol{
        padding: 0;
        margin: 0;
        text-align: center;
        transform: translateY(0);
        transition: .3s;
        .words-item{
            padding: 0;
            margin: 0;
            font-size: 16px;
            line-height: 30px;
            color: var(--color-text);
            transition: .3s;
            &.acitve{
                color: var(--color-text-main);
                transform: scale(1.2);
            }
        }
    }
}

.side{
    min-width: 300px;
    max-width: 400px;
    .cover{
        position: relative;
        display: inline-block;
        background: #fff;
        border-radius: 10px;
        padding: 20px 40px;
        margin-bottom: 40px;
        .cover-img{
            position: relative;
            padding: 40px;
            background: url("@/assets/img/disc.png") no-repeat;
            background-size: contain;

            .stylus{
                position: absolute; 
                top: 0;
                right: 1rem;
                transition: all .3s linear;
                transform-origin: 25px 0px 25px;
                transform: rotateZ(-25deg);
            }

            .el-image{
                border-radius: 100%;
                animation: soundPlay 15s linear infinite;
                -webkit-animation: soundPlay 15s linear infinite;
                animation-play-state: paused;
                -webkit-animation-play-state: paused;
            }

            
            &.active{
                .stylus{
                    transform: rotateZ(0);
                }
                .el-image{
                    animation-play-state: running;
                    -webkit-animation-play-state: running;
                }

            }
        }
        em{
            position: absolute;
            display: inline-block;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background: #f4f4f5;
            &::after{
                content: "";
                position: absolute;
                display: inline-block;
                width: 1rem;
                height: 1rem;
                top: calc((2rem - 1rem)/2);
                left: calc((2rem - 1rem)/2);
                border-radius: 50%;
                background: #dedfe0;
            }
        }
        .lt{
            top: 1rem;
            left: 1rem;
        }
        .rt{
            top: 1rem;
            right: 1rem;
        }
        .lb{
            bottom: 1rem;
            left: 1rem;
        }
        .rb{
            bottom: 1rem;
            right: 1rem;
        }
    }
    .playlist{
        padding: 20px 1rem;
        background: #fff;
        border-radius: 10px;
        .title{
            position: relative;
            display: inline-block;
            font-size: 16px;
            line-height: 24px;
            &::before{
                content: "";
                display: inline-block;
                width: 4px;
                height: 16px;
                background: #ff641e;
                vertical-align: text-top;
                border-radius: 2px;
                margin-right: 10px;
            }
        }
        .item{
            display: flex;
            justify-self: left;
            gap: 20px;
            margin: 10px 0;
            .el-image{
                flex: 1;
                border-radius: 10px;
            }
            .info{
                flex: 4;
                font-size: 12px;
                position: relative;
                .name{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                }
                .singer{
                    position: absolute;
                    bottom: 0;
                }
            }
        }
    }
}

@keyframes soundPlay {
    from{
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
    }
}

@-webkit-keyframes soundPlay {
    from{
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
    }
}

</style>