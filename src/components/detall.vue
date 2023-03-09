<template>
    <div class="container" :style="{flex:flex}">
      <div class="header">
        <el-image class="image" :src="playlist.coverImgUrl"></el-image>
        <div class="info">
          <div class="info-title">
            <span class="title">{{ playlist.name }}</span>
            <span class="updatetime">( {{ $utils.formartDate(playlist.updateTime,'MM月dd日') }} 更新 )</span>
          </div>
          <div class="time" v-if="playlist.creator">
            <el-image class="time-image" :src="playlist.creator.avatarUrl"></el-image>
            <span class="name">{{ playlist.creator.nickname }}</span>
            <span class="time-time">{{ $utils.formartDate(playlist.createTime,'yyyy-MM-dd') }}</span>
          </div>
          <div class="digital">
            <span class="playCount"><i class="iconfont icon-playnum"></i> {{ $utils.calculationNum(playlist.playCount) }}次</span>
            <span class="collect"><i class="iconfont icon-collect"></i> {{ $utils.calculationNum(playlist.subscribedCount) }}</span>
            <span class="comment"><i class="iconfont icon-comment"></i> {{ $utils.calculationNum(playlist.commentCount) }}</span>
          </div>
          <div class="descs">
            <div class="desc">歌单简介</div>
            <div class="desc-text">{{ playlist.description }}</div>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="song">
          <div class="song-title">
            <span class="title">歌曲列表</span>
            <span class="count">{{total}}首歌</span>
          </div>
          <div class="song-but">
            <el-button round  @click="wholePlay()"><i class="iconfont icon-audio-play"></i> 播放全部</el-button>
            <el-button round><i class="iconfont icon-collect"></i> 收藏</el-button>
          </div>
        </div>
        <songs-list :limit="limit" :offset="page - 1" :songList="list.slice((page - 1) * limit , page * limit)"></songs-list>
        <div>
          <el-pagination
              :page-size="limit"
              @current-change='currentChange'
              :pager-count="5"
              :curren-page='page'
              layout="prev, pager, next"
              :total="total"
            />
        </div>
      </div>
    </div>
</template>

<script>
import SongsList from '@/components/SongsList'
import { useStore } from 'vuex'
import { ref } from 'vue'
export default {
  components: { SongsList },
  props:{
    flex:{  //设置容器大小
        type:Number,
        default:0,
    },
    list:{  //歌曲数据
        type:Array,
        default:new Array
    },
    playlist:{  //歌单数据
        type:Array,
        default:new Array
    },
    limit:{
        type:Number,
        default:12
    },
    total:{
        type:Number,
        default:0
    }
  },
  setup(props){
    const page = ref(1)
    const store = useStore()
    const currentChange = pageIndex=>{
      page.value =  pageIndex
    }
    const wholePlay = ()=>{
      store.commit("setPlayList",props.list)
      store.commit("setPlayIndex",0)
      store.commit("setIsPlay",true)
    }
    return{
        page,
        currentChange,
        wholePlay
    }
  }

}
</script>

<style lang="less" scoped>

    .header{
      display: flex;
      flex-direction: row;
      margin-bottom: 40px;

      .image{
        flex: 3;
        border-radius: 10px;
      }

      .info{
        flex: 9;
        margin-left: 20px;
        background-color: #fff;
        border-radius: 10px;
        padding: 30px 20px 20px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .info-title{
          .title{
            color: var(--color-text-main);
            font-size: 25px;
            font-weight: 400;
          }

          .updatetime{
            margin-left: 10px;
            color: var(--color-text);
            font-size: 80%;
          }
        }

        .time{
          display: flex;
          justify-content: left;
          align-items: center;
          gap: 20px;
          font-size: 90%;

          .time-image{
            flex: 1;
            border-radius: 50%;
          }

          .name{
            flex: 2;
          }

          .time-time{
            flex: 13;
          }
        }

        .digital{
          .collect,.comment{
            margin-left: 2%;
          }
        }

        .descs{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 90%;
          .desc{
            color: var(--color-text-main);
          }
          .text{
            color: var(--color-text);
          }
        }
      }
    }

    .main{
      background-color: #fff;
      border-radius: 10px;
      padding: 40px 20px 20px 20px;

      .song{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        
        .song-title{
          display: flex;
          flex-direction: row;
          justify-content: left;
          align-items: flex-end;
          gap: 20px;
          .title{
            color: var(--color-text-main);
            font-size: 25px;
          }
          .count{
            font-size: 90%;
            color: var(--color-text);
          }
        }
      }
    }

</style>