<template>
  <div class="song">
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
                    <span :class="['play-btn','play-all', songDisable]" @click.stop="plyaing(info.song)"><i :class="['iconfont', playFontIcon]"></i> 立即播放 </span>
                    <span class="play-btn play-collect" @click="showAddList"><i class="iconfont icon-collect"></i> 收藏</span>
                    <span class="play-btn play-comment" @click="jumpComment"><i class="iconfont icon-comment"></i> 评论</span>
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
    <div class="side">
        <div class="cover">

        </div>
        <div class="playlist">

        </div>
    </div>
  </div>
</template>

<script setup>
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
        info.offset = offset
        if(offset>wordsheight.value&&((scrollheight-offset)>wordsheight.value)){
            return words.value.firstElementChild.style.transform= `translateY(-${offset - wordsheight.value}px)`
        }

       /** 
        let scrollheight = document.querySelector(".words-scrol").clientHeight
        let child = words.value.firstElementChild.childNodes
        for (let index = 0; index <= wordindex.value; index++) {
            let childHeight = child[index].clientHeight
            if(!isNaN(+childHeight) && scrollheight-offset>wordsheight.value){
                offset += childHeight
            }
            console.log(offset)
        }
        info.offset = offset
        if(offset>wordsheight.value){
            return document.querySelector(".words-scrol").style.transform= `translateY(-${offset - wordsheight.value}px)`
        } 
        */
    }

    const wordsenter = ()=>{
        info.isScroll = true
        words.value.scrollTop = info.offset - wordsheight.value
        words.value.firstElementChild.style.transition= '0s'
        words.value.firstElementChild.style.transform= `translateY(0px)`
    }

    const wordsleave = ()=>{
        info.isScroll = false
        shiftwodr()
        words.value.scrollTop = 0
        words.value.firstElementChild.style.transition= '.3s'
    }

    let bus = proxy.$bus.on("sendcurrentTime",(currentTime)=>{
        info.currentTime = currentTime 
        shiftwodr()
    })
    
    onMounted(()=>{
        getdata()
        bus
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

    .song-content{
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
        flex: 5;
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
        flex: 5;
        background-color: #fff;
        border-radius: 10px;
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
    overflow-y: auto;
    .words-scrol{
        text-align: center;
        transform: translateY(0);
        transition: .3s;
        .words-item{
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
    background: #fff;
    border-radius: 10px;
}

</style>