<template>
  <div class="mv" v-if="videoInfo.src">
    <div class="mv-mian">
      <div class="mv-info-hd">
        <div class="info-name"><i class="iconfont icon-mv"></i>{{ mvDetail.name }}</div>
        <div class="info-artists">
          <span class="artist" v-for="(artist,index) in mvDetail.artists" :key="index">
            {{ index>=1? "/" +  artist.name : artist.name }}
          </span>
        </div>
      </div>
      <div class="video">
        <video-play
          style="max-height: 500px;"
          :src="videoInfo.src"
          :volume="0.6"
          :poster="videoInfo.cover"
          :title="mvDetail.name"
          width="100%"
          height="100%"
        >
        </video-play>
      </div>
      <div class="comment">
        <comments
          :type="type"
          :id="id"
        >
        </comments>
      </div>
    </div>
    <div class="mv-aside">
      <div class="mv-info">
        <div class="info-title">mv简介</div>
        <div class="info-duration">发布时间：{{ $utils.formartDate(mvDetail.duration,"yyyy-MM-dd") }}</div>
        <div class="info-playCount">播放量：{{ $utils.calculationNum(mvDetail.playCount) }}</div>
        <div class="info-content">{{ mvDetail.desc ?  mvDetail.desc : "暂无简介"}}</div>
      </div>
      <div class="simi-mv" v-if="simiMvs">
        <div class="simi-title">
          相似MV
        </div>
        <div class="simi-item" v-for="mv in simiMvs" :key="mv.id">
            <router-link class="simi-imag" :to="{ path:'/mvlist/mv',query:{id:mv.id} }">
              <i class="iconfont icon-play"></i>
              <el-image :src="mv.cover"></el-image>
            </router-link>
            <div class="simi-info">
              <div class="simi-name">{{ mv.name }}</div>
              <div class="simi-artistName">{{ mv.artistName }}</div>
              <div class="simi-playCount"><i class="iconfont icon-mvlist"></i>{{ $utils.calculationNum(mv.playCount) }}</div>
              <div class="simi-duration">发布时间：{{ $utils.formartDate(mv.duration,"yyyy-MM-dd") }}</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import 'vue3-video-play/dist/style.css'
import { videoPlay } from 'vue3-video-play'
import Comments from '@/components/Comments'
export default {
  components:{
    videoPlay,
    Comments
  },
  setup(){
    
    const { proxy } = getCurrentInstance()
    const route = useRoute()

    const info = reactive({
      id:route.query.id,
      type:1,
      mvDetail:{},
      simiMvs:[],
      videoInfo:{
        src:"",
        cover:"",
      }
    })

    const getmvdetail = async()=>{
      const {data:res} = await proxy.$http.mvDetail({id:info.id})
      if(res.code !== 200){
        return proxy.$msg.error("请求失败")
      }
      info.mvDetail = res.data
      info.videoInfo.cover = res.data.cover
    }

    const getmvurl = async()=>{
      const {data:res} = await proxy.$http.mvUrl({id:info.id})
      if(res.code !== 200){
        return proxy.$msg.error("请求失败")
      }
      info.videoInfo.src = res.data.url
    }

    const getsimimv = async()=>{
      const {data:res} = await proxy.$http.simiMv({id:info.id})
      if(res.code !== 200){
        return proxy.$msg.error("请求失败")
      }
      info.simiMvs = res.mvs
    }

    onMounted(()=>{
      getmvdetail()
      getmvurl()
      getsimimv()
    })

    return{
      ...toRefs(info)
    }

  }
}
</script>

<style lang="less" scoped>

.mv{
  display: flex;
  .mv-mian{
    flex: 8;
  }
  .mv-aside{
    flex: 2;
    padding-left: 20px;
  }
}

.mv-info-hd{
  display: flex;
  padding: 0 0 20px 0;
  .info-name{
    font-size: 24px;
    font-weight: 400px;
    height: 24px;
    line-height: 24px;
    padding-right: 20px;
    .icon-mv{
      color: var(--color-text-height);
      background: #fff;
      margin-right: 5px;
      vertical-align: top;
    }
  }
  .info-artists{
    font-size: 12px;
    line-height: 24px;
  } 
}

.video{
  position: relative;
  max-height: 500px;
  margin-bottom: 40px;
  border-radius: 10px;
}

.mv-info{
  background: #fff;
  border-radius: 10px;
  padding: 20px 10px;
  .info-title{
    position: relative;
    color: var(--color-text-main);
    font-size: 16px;
    font-weight: 400px;
    &::before{
      content: "";
      display: inline-block;
      width: 4px;
      height: 16px;
      border-radius: 4px;
      background: #ff641e;
      vertical-align: text-top;
      margin-right: 5px;
    }
  }
  .info-duration{
    color: var(--color-text);
    font-size: 12px;
    margin-top: 10px;
  }
  .info-playCount{
    color: var(--color-text);
    font-size: 12px;
    margin-bottom: 10px;
  }
  .info-content{
    font-size: 14px;
    word-break: break-all;
    color: var(--color-text-main);
  }
}

.simi-mv{
  margin-top: 20px;
  .simi-title{
    background: #fff;
    padding: 20px 10px;
    border-radius: 10px;
    color: var(--color-text-main);
    font-size: 16px;
    font-weight: 400px;
    &::before{
      content: "";
      display: inline-block;
      width: 4px;
      height: 16px;
      border-radius: 4px;
      background: #ff641e;
      vertical-align: text-top;
      margin-right: 5px;
    }
  }
  .simi-item{
    margin: 10px 0;
    padding: 20px 20px;
    background: #fff;
    border-radius: 10px;
    .simi-imag{
      display: block;
      position: relative;
      overflow: hidden;
      &:hover{
        .icon-play{
          opacity: 1;
          transform: scale(5);
        }
        .el-image{
          transform: scale(1.3);
        }
      }
    }
    .icon-play{
      position: absolute;
      top: 45%;
      left: 45%;
      z-index: 1;
      transition: all .3s linear;
      opacity: 0;
    }
    .el-image{
      border-radius: 10px;
      transition: all .3s linear;
    }
    .simi-info{
      font-size: 12px;
      .simi-artistName,.simi-playCount{
        color: var(--color-text);
      }
      .icon-mvlist{
        vertical-align: text-top;
        margin-right: 10px;
      }
    }
  }
}

</style>