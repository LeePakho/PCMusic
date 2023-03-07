<template>
  <div class="progress" @click="point" ref="progress">
    <div class="progress-line"></div>
    <div class="progress-box" :style="{width: progressWidth}">
        <div class="progress-btn" @mousedown.self.stop="move"></div>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
export default {
    props:{
        isShowBtn:{
            type:Boolean,
            default:false,
        },
    },
    setup(proxy,{emit}){
        const progress = ref(null)
        const progressWidth = ref("0%")
        //修改播放进度条
        const point = (e)=>{
            const $progress = progress.value
            const OffsetLeft = e.clientX - getOffsetLeft($progress)
            const curProgress = OffsetLeft >= $progress.offsetWidth ? $progress.offsetWidth : (OffsetLeft <= 0 ? 0 : OffsetLeft)
            let width = curProgress / $progress.offsetWidth
            progressWidth.value = (width*100).toString().substring(0,4) + "%"
            emit("setAudiocurrentTime",curProgress / $progress.offsetWidth)
        }

        //计算容器偏移量
        const getOffsetLeft = (obj)=>{
            let oLeft = obj.offsetLeft
            let oParent = obj.offsetParent
            while(oParent !== null){
                oLeft += oParent.offsetLeft
                oParent = oParent.offsetParent
            }
            return oLeft
        }

        const changeProgressWidth = (t)=>{
            if(t === 0){
                return progressWidth.value = "0%"
            }else if(t === 1){
                return progressWidth.value = "100%"
            }
            t =  (t*100).toString()
            progressWidth.value = t.substring(0,t.length>=5?5:t.length) + "%"
        }

        const move = ()=>{
            document.onmousemove = (e)=>{
                point(e)
            }
            document.body.onselectstart = ()=>false;
            
            document.onmouseup = (e)=>{
                point(e)
                document.onmousemove = document.body.onselectstart = document.onmouseup = null
            }
        }

        return{
            progress,
            progressWidth,
            move,
            point,
            changeProgressWidth,
        }
    }   
}
</script>

<style lang="less" scoped>
.progress{
    position: relative;
    width: 100%;
    height: 4px;
    // padding: 4px 0px;
    border-radius: 2px;
    cursor: pointer;

    .progress-line,.progress-box{
        position: absolute;
        height: 4px;
        // top: 4px;
        left: 0;
        box-shadow: 0px 5px 40px -1px rgba(0, 0, 0, 0.2);
    }

    .progress-line{
        width: 100%;
        background-color: #eee;
    }

    .progress-box{
        background: linear-gradient(to right,rgba(247, 117, 24, 0.2),rgba(247, 117, 24,0.8));
        z-index: 6;
    }

    .progress-btn{
        position: absolute;
        width: 4px;
        top: -4px;
        right: -6px;
        height: 4px;
        border:4px solid var(--color-text-height);
        border-radius: 50%;
        background:#fff;
        cursor: grab;
    }
}
</style>
