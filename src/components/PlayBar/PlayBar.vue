<template>
    <div class="play-bar-main">
      <div :class="['play-bar',lockName]" v-if="curSongInfo" @mouseleave="setLockName('')">
        
        <div class="fold" @mouseenter.stop="setLockName('active')"></div>

        <progress-bar
            class="bar"
            ref="progressInfo"
            @setAudiocurrentTime='setAudiocurrentTime'
        ></progress-bar>
        <div class="wrapper">
          <div class="bar-l">
            <el-image
              :src="curSongInfo.album.picUrl"
              :fit="fit">
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>  
            </el-image>
            <div class="info">
              <div class="songtitle">{{curSongInfo.name}}</div>
              <div class="singer">{{curSongInfo.singerName}}</div>
            </div>
            <div class="time">
              <span class="current">{{$utils.formatTime(currentTime)}}</span>
              <span>/</span>
              <span class="assemble">{{songTime}}</span>
            </div>
          </div>
          <div class="bar-m">
              <i class="iconfont icon-audio-prev" title="上一首" @click.stop="previousSong"></i>
              <i class="m" :class="['iconfont', playIcon]" @click.stop="changePlayState"></i>
              <i class="iconfont icon-audio-next" title="下一首" @click.stop="nextSong"></i>
          </div>
          <div class="bar-r">
            <div class="sound">
              <i :class="['iconfont', mutedIcon]" title="音量" @click.stop="volumeHandler"></i>
              <progress-bar
                  class="volume-line"
                  ref="volumeInfo"
                  @setAudiocurrentTime="setVolumeWidth"
                  ></progress-bar>
            </div>
            <i class="iconfont" :class="modeIcon.className" :title="modeIcon.title" @click="changePlayMode"></i>
          </div>
        </div>
      </div>
      <audio-box 
        ref="audioInfo" 
        @setIsPlay="setIsPlay"
        @setProgressWidth="setProgressWidth"
        @setCurSongInfo="setCurSongInfo"
        @changeCurrent="changeCurrent"
        @changePlayState="changePlayState"
        @changeVolumeProgressWidth="changeVolumeProgressWidth"
        ></audio-box>
    </div>
</template>

<script setup>
import AudioBox from '@/components/PlayBar/AudioBox.vue'
import ProgressBar from '@/components/PlayBar/ProgressBar'
import { ref } from '@vue/reactivity'
import { computed, nextTick, watch } from 'vue'

//播放器显示
const lockName = ref("")

const audioInfo = ref(null)
const volumeInfo = ref(null)
const progressInfo = ref(null)  
const curSongInfo = ref(null)
const currentTime = ref("0:00")
const songTime = computed(()=>curSongInfo.value.duration)
const isPlay = ref(false)
const isMuted= ref(false) // 是否禁音
const volumeProgressWidth = ref(0)
const playMode = ref(0)
const playIcon = computed(() => !isPlay.value ? 'icon-audio-play' : 'icon-audio-pause');

const setCurSongInfo = (obj)=>  curSongInfo.value = obj

const setIsPlay = (Play)=>  isPlay.value = Play

const setAudiocurrentTime = (t)=>{
  audioInfo.value.setAudiocurrentTime(isNaN(t)?0:t)
}
const setVolumeWidth = (volume)=>{
  audioInfo.value.changeVolume(volume)
}
//静音
const volumeHandler = ()=>{
  isMuted.value = !isMuted.value
  audioInfo.value.changeIsMuted(isMuted.value)
}
// 播放模式
const modeIcon = computed(() => {
    const params = [{
        className: 'icon-loop',
        title: '循环模式'
    }, {
        className: 'icon-single-cycle',
        title: '单曲循环'
    }, {
        className: 'icon-shuffle',
        title: '随机播放'
    }]
    return params[playMode.value]
});

const mutedIcon = computed(()=>{
  return isMuted.value ? 'icon-volume-active' : 'icon-volume';
})

const setLockName = (val)=>{
  if(val === 'active'){
    return lockName.value = val
  }else{
    return setTimeout(()=>{
      lockName.value = val
    },3000)
  }
}

//下一首
const nextSong = ()=>{
  audioInfo.value.nextSong()
}
//上一首
const previousSong = ()=>{
  audioInfo.value.previousSong()
}

const changePlayMode = ()=>{
  playMode.value >=2 ? playMode.value=0 :  playMode.value+=1
  audioInfo.value.changePlayMode(playMode.value)
}

const changeVolumeProgressWidth = (volume)=>{
  volumeProgressWidth.value = volume
  nextTick(()=>{
    if(volumeInfo.value){
      volumeInfo.value.changeProgressWidth(volume)
    }
  })
}

const changePlayState = ()=>{
  audioInfo.value.changePlayState()
}

const changeCurrent = (t)=>{
  currentTime.value = isNaN(t)? 0 : t
}

const setProgressWidth = (t)=>{
  progressInfo.value.changeProgressWidth(isNaN(t)?0:t)
}

watch(isMuted,n=>{
  if(n){
    nextTick(()=>{
      if(volumeInfo.value){
        volumeInfo.value.changeProgressWidth(0)
      }
    })
  }else{
    volumeInfo.value.changeProgressWidth(volumeProgressWidth.value)
  }
})

</script>

<style lang="less" scoped>
.iconfont{
  cursor: pointer;
}

.bar-l{
  display: flex;
  flex-direction: row;
  justify-content: left;
  gap: 20px;
  height: 100%;
  .el-image{
    border-radius: 5px;
    flex: 1;
  }
  .info{
    flex: 3;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .songtitle,.singer{
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .time{
    flex: 2;
    display: flex;
    align-items: center;
  }
}
.bar-m{
  display: flex;
  justify-content: space-between;
  align-items: center;
  i{
    font-size: 2rem;
  }
  .m{
    font-size: 3rem;
    color: var(--color-text-height);
  }
}
.bar-r{
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 1rem;
  .sound{
    // flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
}
.volume-line{
  width: 150px ;
}

.wrapper{
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  padding: 10px 0px;
  .bar-l,.bar-m,.bar-r{
    width: 300px;
  }
}

.play-bar{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background-color: #fff;
    z-index: 5;
    box-shadow: 0 5px 40px -1px rgba(2,10,18,.1);
    transition: all .4s ease-in-out;
    transform: translateY(100%);
    .bar{
      margin-top:-3px;
    }
    &.active{
      transform: translateY(0);
      .bar{
        margin-top:0;
      }
    }
}

.fold{
  position: absolute;
  top: -30px;
  left: 0px;
  width: 100%;
  height: 30px;
  z-index: 3;
  opacity: 0;
}

</style>