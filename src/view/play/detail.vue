<template>
  <div class="play">
    <detall
      :flex="8"
      :limit="limit"
      :total="total"
      :list="list"
      :playlist="playlist"
    ></detall>
    <div class="aside">
      <div class="recommend"  v-if="related.length>0">
        <div class="title">相关歌单推荐</div>
        <div class="item" v-for="item in related" :key="item.id" @click="skip(item.id)">
          <el-image :src="item.coverImgUrl"></el-image>
          <div class="info">
            <div class="name">{{item.name}}</div>
            <div class="singer">By:{{item.creator.nickname}}</div>
          </div>
        </div>
      </div>
      <div class="comment" v-if="hotComments.length>0">
        <div class="title">歌单热门评论</div>
        <div class="item" v-for="item in hotComments" :key="item.user.userId">
          <el-avatar :size="50" :src="item.user.avatarUrl"/>
          <div class="info">
            <div class="name-time">
              <span class="singer">{{item.user.nickname}}</span>
              <span class="time"></span>
            </div>
            <el-dropdown >
              <div class="name">{{item.content}}</div>
              <template #dropdown>
                <div class="dropdown">{{item.content}}</div>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Detall from "@/components/detall.vue"
import { computed, getCurrentInstance, onMounted, reactive, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
export default {
  components: { Detall },
  setup(){
    
    const { proxy } = getCurrentInstance()
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const isLogin = computed(()=>store.getters.isLogin)

    const info = reactive({
      id:route.query.id,
      commentLimit:10,
      limit:20,
      total:0,
      list:[],
      playlist:{},
      related:[],
      hotComments:[],
    })
    
    const getlist = async()=>{
      const {data} = await proxy.$http.playlistDetail({id:info.id})
      if(data.code !== 200 ){
        proxy.$msg.error("请求失败")
      }
      info.playlist = data.playlist
      info.list = data.playlist.tracks && data.playlist.tracks.map((item,index) =>{
        return{
          id: item.id,
          name: item.name,
          mvId: item.mv,
          singer: item.ar,
          singerName:proxy.$utils.getSingerName(item.ar),
          album: item.al,
          albumName: item.al.name || "",
          alia: item.alia,
          vip: item.fee === 1,
          license:islicense(item.id,index),//版权
          duration: proxy.$utils.formatSongTime(item.dt),
          url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
        }
      })
      info.total = data.privileges.length
    }

    const skip = id =>{
      router.push({parent:'playlist/detail',query:{id}})
    }

    const gethotComments = async()=>{
      const {data} = await proxy.$http.commentPlaylist({id:info.id})
      info.hotComments = data.hotComments
    }

    const getrelated = async()=>{
      const {data} = await proxy.$http.relatedPlaylist({id:info.id})
      info.related = data.playlists
    }

    //版权
    const islicense = async (id,index) =>{
      const {data:res} = await proxy.$http.checkMusic(id)
      info.songList[index].license = res.success
    }

    onMounted(()=>{
      getlist()
      gethotComments()
      getrelated()
    })

    watch(isLogin,(n)=>{
      if(n){
        getlist()
      }
    })

    return{
      ...toRefs(info),
      getlist,
      skip,
    }
  }
}
</script>

<style lang="less" scoped>

.play{
  display: flex;
  gap: 1rem;
  .aside{
    flex: 2;
  }
}

.recommend,.comment{
  padding: 30px 20px;
  background: #ffffff;
  border-radius: 10px;
  margin-bottom: 40px;
  color: var(--color-text-main);

  .title{
    position: relative;
    display: block;
    font-size: 16px;
    line-height: 24px;
    &::before{
      content: "";
      display: inline-block;
      width: 4px;
      height: 16px;
      margin: 3px 5px 0 0 ;
      border-radius: 3px;
      background: #ff641e;
      vertical-align: top;//与父元素对齐
    }
  }

  .item{
    display: flex;
    justify-content: left;
    flex-direction: row;
    margin-top: 20px;
    font-size: 12px;
  }
}

.recommend{
  .item{
    cursor: pointer;

    .el-image{
      flex: 1;
      border-radius: 5px;
    }

    .info{
      flex: 4;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20px;

      .name{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre-wrap;
        display: -webkit-box;
        -webkit-line-clamp: 1;//限制容器行数
        -webkit-box-orient: vertical;//从顶部向底部垂直布置子元素
        word-break: break-all;
      }
      .singer{
        color: #909090;
      }
    }
  }
}

.comment{
  .item{
    // font-size: 12px;
    .el-avatar{
      flex: 1;
    }
    .info{
      flex: 4;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20px;
      .name{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre-wrap;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-break: break-all;
        background:  #f5f5f5;
        line-height: 24px;
        padding: 0 10px;
        border-radius: 5px;
        color: #666;
      }
    }
  }
}

.dropdown{
  background:  #f5f5f5;
  max-width: 300px;
  white-space: pre-wrap;
}
</style>