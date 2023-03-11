<template>
  <audio
    v-if="curSongInfo"
    ref="myAudio"
    preload="auto"
    :src="curSongInfo.url"
    :volume="volume"
    :muted="isMuted"
    @ended="ended"
    @timeupdate="timeupdate"
  >
  </audio>
</template>

<script>
import { computed, getCurrentInstance, nextTick, onBeforeMount, reactive, ref, watch } from "vue"
import { useStore } from "vuex"
export default{
    setup(props,{emit}){
        
        const { proxy } = getCurrentInstance()
        const store = useStore()
        const isPlay = computed(()=>store.getters.isPlay)
        const playList = computed(()=>store.getters.playList)
        const playIndex = computed(()=>store.getters.playIndex)
        const curSongInfo = computed(()=>playList.value[playIndex.value])

        const myAudio = ref(null)
        const isMuted = ref(false)
        const volume=ref(0.6)//声音  0-1  默认为1
        const info = reactive({
            initAudioReady:false,
            playMode:0,// 播放模式  0循环播放、1单曲循环、2随机播放
        })
        
        const timeupdate = ()=>{
            let $myAudio = myAudio.value
            const currentTime = $myAudio.currentTime
            const duration = $myAudio.duration
            proxy.$bus.emit("sendcurrentTime",currentTime)
            emit("setProgressWidth",currentTime/duration)
            emit("changeCurrent",currentTime)
        }

        const setAudiocurrentTime = (val)=>{
            let $myAudio = myAudio.value
            if($myAudio){
                $myAudio.currentTime = val * $myAudio.duration
            }
        }

        const changeIsMuted = (muted)=>{
            isMuted.value = muted
        }

        const ended = ()=>{
            store.commit("setIsPlay",false)
            if(info.playMode === 1){
                startSong()
            }else{
                changeSong()
            }
            store.commit("setIsPlay",true)
        }
        
        const changeSong = ()=>{
            if(playList.value.length > 1){
                if(info.playMode === 0){
                    return store.commit("setPlayIndex",playIndex.value >= playList.value.length - 1 ? 0 : playIndex.value + 1)
                }else if(info.playMode == 2){
                    if(playList.value.length === 2 ){
                        return store.commit("setPlayIndex",playIndex.value === 1 ? 0 : 1)
                    }else{
                        let index = randomNum(playList.value.length - 1)
                        if(index === playIndex.value){
                            index = randomNum(playList.value.length - 1)
                        }
                        return store.commit("setPlayIndex",index)
                    }
                }
            }
            startSong()
        }

        const randomNum = (num)=>{
            return Math.floor(Math.random() * num)
        }

        const changePlayMode = (mode)=>{
            info.playMode = mode
        }

        //修改声音
        const changeVolume = (val)=>{
            volume.value = val
        }

        const startSong = ()=>{
            let $myAudio = myAudio.value
            $myAudio.currentTime = 0
            $myAudio.play()
        }
        //下一首
        const nextSong = ()=>{
            store.commit("setPlayIndex",playIndex.value === playList.value.length - 1 ? 0 : playIndex.value + 1)
            store.commit("setIsPlay",true)
        }
        //上一首
        const previousSong = ()=>{
            store.commit("setPlayIndex",playIndex.value === 0 ? playList.value.length - 1 : playIndex.value - 1)
            store.commit("setIsPlay",true)
        }
        //修改IsPlay
        const changePlayState = ()=>{
            store.commit("setIsPlay",!isPlay.value)
        }

        watch(()=>isPlay.value,(play)=>{
            emit("setIsPlay",play)
            if(!info.initAudioReady){
                return
            }
            nextTick(()=>{
                let $myAudio = myAudio.value
                if($myAudio)
                    play? $myAudio.play() : $myAudio.pause()
            })
        })

        watch(()=>curSongInfo.value,(newSong,oldSong)=>{
            emit("setCurSongInfo",newSong)
            emit("changeVolumeProgressWidth",volume.value)
            if(!newSong || newSong === oldSong){
                return
            }
            info.initAudioReady = true
            nextTick(()=>{
                let $myAudio = myAudio.value
                isPlay.value? $myAudio.play() : $myAudio.pause()
            })
        },{deep:true})

        watch(volume,n=>{
            emit("changeVolumeProgressWidth",n)
        })

        onBeforeMount(()=>{
            store.commit("setIsPlay",false)
        })

        return{
            myAudio,
            isMuted,
            volume,
            curSongInfo,
            ended,
            setAudiocurrentTime,
            timeupdate,
            nextSong,
            previousSong,
            changePlayState,
            changeIsMuted,
            changeVolume,
            changePlayMode,
        }
    }
}



</script>

<style>

</style>