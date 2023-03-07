<template>
  <div class="rank">
    <div class="rank-container">
      <div class="rank-header">
        <el-image class="rank-image" :src="playlist.coverImgUrl"></el-image>
        <div class="rank-info">
          <div class="title">
            <span class="rank-title">{{ playlist.name }}</span>
            <span class="updatetime">( {{ $utils.formartDate(playlist.updateTime,'MM月dd日') }} 更新 )</span>
          </div>
          <div class="time" v-if="playlist.creator">
            <el-image class="time-image" :src="playlist.creator.avatarUrl"></el-image>
            <span class="rank-name">{{ playlist.creator.nickname }}</span>
            <span class="rank-time">{{ $utils.formartDate(playlist.createTime,'yyyy-MM-dd') }}</span>
          </div>
          <div class="rank-digital">
            <span class="rank-playCount"><i class="iconfont icon-playnum"></i> {{ calculationNum(playlist.playCount) }}次</span>
            <span class="rank-collect"><i class="iconfont icon-collect"></i> {{ calculationNum(playlist.subscribedCount) }}</span>
            <span class="rank-comment"><i class="iconfont icon-comment"></i> {{ calculationNum(playlist.commentCount) }}</span>
          </div>
          <div class="rank-desc">
            <div class="desc">歌单简介</div>
            <div class="desc-text">{{ playlist.description }}</div>
          </div>
        </div>
      </div>
      <div class="rank-main">
        <div class="rank-song">
          <div class="song-title">
            <span class="rank-song-title">歌曲列表</span>
            <span class="rank-song-count">{{total}}首歌</span>
          </div>
          <div class="song-but">
            <el-button round  @click="wholePlay()"><i class="iconfont icon-audio-play"></i> 播放全部</el-button>
            <el-button round><i class="iconfont icon-collect"></i> 收藏</el-button>
          </div>
        </div>
        <songs-list :limit="20" :offset="page - 1" :songList="list.slice((page - 1) * limit , page * limit)"></songs-list>
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
    <div class="rank-aside">
      <div class="aside-menu">
        <span :class="type === 'Top' ? 'active' : ''" @click="changeType('Top')"><em>TOP榜</em></span>
        <span :class="type === 'Feature' ? 'active' : ''" @click="changeType('Feature')"><em>特色榜</em></span>
        <span :class="type === 'Other' ? 'active' : ''" @click="changeType('Other')"><em>场景榜</em></span>
      </div>
      <div class="list-main">
        <div class="list-item" :class="{'acitve': listIndex === index}" @click="changeIndex(index)" v-for="(item,index) in listData" :key="item.id">
          <div class="item-txt">
            <div class="item-title">{{ $utils.linmitByte(item.name,16) }}</div>
            <div class="item-time">{{ $utils.linmitByte(item.updateFrequency,16) }}</div>
          </div>
          <el-image :src="item.coverImgUrl"></el-image>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SongsList from '@/components/SongsList'
import { reactive, toRefs } from '@vue/reactivity'
import { getCurrentInstance, onMounted, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'
export default {
  components: { SongsList },
  setup(){
    const { proxy } = getCurrentInstance()

    const store = useStore()

    const info = reactive({
      listTop:[],//top榜
      listFeature:[],//特色榜
      listOther:[],//场景榜
      type:'Top',//Top:top榜,Feature:特色榜,Other:场景榜
      listData:[],
      listIndex:0,
      coverName:'',
      coverImgUrl:'',
      updateFrequency:'',
      total:0,
      rid:0,
      limit:20,
      page:1,
      list:[],
      playlist:{},
    })

    const getListDetail = async ()=>{
      const {data:res} = await proxy.$http.topListDetail()
      if(res.code !== 200){
        return proxy.$msg.error("请求失败")
      }
      info['listTop'] = res.list.filter(item=> item.ToplistType)
      info['listFeature'] = res.list.filter(item=> !item.ToplistType && item.name.indexOf("云音乐")>=0 )
      info['listOther'] = res.list.filter(item=> !item.ToplistType && item.name.indexOf("云音乐")<0 )
      info.rid = info[`list${info.type}`][info.listIndex].id
    }

    const formatTime = time =>{
      return proxy.$utils.formatMsgTime(time)
    }

    const calculationNum = num =>{
      return proxy.$utils.calculationNum(num)
    }

    const wholePlay = ()=>{
      store.commit("setPlayList",info.list)
      store.commit("setPlayIndex",0)
      store.commit("setIsPlay",true)
    }

    const getList = async ()=>{
      const {data:res} = await proxy.$http.playlistDetail({id:info.rid})
      info.listData = info[`list${info.type}`]
      info.playlist = res.playlist
      info.list = res.playlist.tracks&&res.playlist.tracks.map( item =>{
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
            license:'',//版权
            duration: proxy.$utils.formatSongTime(item.dt),
            url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
        }
      })
      info.total = res.playlist.tracks.length
      islicense()
    }

    // 版权
    const islicense = async()=>{
      for (const key in info.list) {
        let id = info.list[key].id
        const {data:res} = await proxy.$http.checkMusic(id)
        info.list[key].license = res.success
      }
    }

    const changeType = (type)=>{
      if(info.type === type)
      return
      info.type = type
      info.listIndex = 0
      info.rid = info[`list${info.type}`][info.listIndex].id
    }

    const changeIndex = index =>{
      if(info.listIndex === index)
      return
      info.listIndex = index
      info.rid = info[`list${info.type}`][info.listIndex].id
    }

    const currentChange = page=>{
      info.page = page
    }

    watch(()=>info.rid,()=>getList())

    onMounted(()=>{
      getListDetail()
    })

    return{
      ...toRefs(info),
      islicense,
      changeType,
      changeIndex,
      formatTime,
      calculationNum,
      currentChange,
      wholePlay,
    }
  }
}
</script>

<style lang="less" scoped>

  .rank{
    // width: 70%;
    display: flex;
    .rank-container{
      flex: 7;
    }

    .rank-aside{
      flex: 3;
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 0 20px;
      .aside-menu{
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        span{
          position: relative;
          flex: 1 ;
          padding: 20px;
          font-size: 80%;
          border-radius: 10px;
          max-width: calc(100% / 3 - 50px);
          color: var(--color-text-main);
          cursor: pointer;
          background-color: #fff;
          text-align: center;

          &.active{
            color: #fff;
            background-color: #ff641e;
            opacity: .5;
          }
        }
      }

      .list-main{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 20px;

        .list-item{
          flex: 50%;
          display: flex;
          flex-direction: row;
          max-width: calc(100% / 2 - 50px);
          background-color: #fff;
          border-radius: 10px;
          padding: 20px;
          cursor: pointer;
          .item-txt{
            flex: 7;
            font-size: 80%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .item-title{
              color: var(--color-text-main);
            }
            .item-time{
              color: var(--color-text);
            }
          }

          .el-image{
            flex: 2;
            border-radius: 10px;
          }
          

          &.acitve{
            background-image: linear-gradient(110deg,#fff 20%,#ff641e 100%);
          }
        }
      }
    }

    .rank-header{
      display: flex;
      flex-direction: row;
      margin-bottom: 40px;

      .rank-image{
        flex: 3;
        border-radius: 10px;
      }

      .rank-info{
        flex: 9;
        margin-left: 20px;
        background-color: #fff;
        border-radius: 10px;
        padding: 30px 20px 20px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .title{
          .rank-title{
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

          .rank-name{
            flex: 2;
          }

          .rank-time{
            flex: 13;
          }
        }

        .rank-digital{
          .rank-collect,.rank-comment{
            margin-left: 2%;
          }
        }

        .rank-desc{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 90%;
          .desc{
            color: var(--color-text-main);
          }
          .desc-text{
            color: var(--color-text);
          }
        }
      }
    }

    .rank-main{
      background-color: #fff;
      border-radius: 10px;
      padding: 40px 20px 20px 20px;

      .rank-song{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        
        .song-title{
          display: flex;
          flex-direction: row;
          justify-content: left;
          align-items: flex-end;
          gap: 20px;
          .rank-song-title{
            color: var(--color-text-main);
            font-size: 25px;
          }
          .rank-song-count{
            font-size: 90%;
            color: var(--color-text);
          }
        }
      }
    }
  }

</style>