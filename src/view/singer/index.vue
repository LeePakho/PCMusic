<template>
  <div class="singer">
      <div class="detail">
        <el-image class="image" :src="detail.cover"></el-image>
        <div class="info">
          <div class="info-name">
            <span class="name">{{ detail.name }}</span>
            <span class="alias" v-if="isAlias">
              ( <span class="alia" v-for="(alia,index) in detail.alias" :key="index">{{ index >= 1? "、"+alia : alia }}</span> )
            </span>
            <div class="count">
              <span class="musicSize" v-if="detail.musicSize">单曲数:{{ detail.musicSize }}</span>
              <span class="albumSize" v-if="detail.albumSize">专辑数:{{ detail.albumSize }}</span>
              <span class="mvSize" v-if="detail.mvSize">MV数:{{ detail.mvSize }}</span>
            </div>
          </div>
          <div class="descs" >
            <div class="desc">歌手简介：</div>
            <div class="desc-text">{{ briefDesc || "暂无简介" }}</div>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="select">
          <div class="song" v-if="artists.length" :class="{'active':type==0}" @click="changeType(0)">热门作品</div>
          <div class="albums" v-if="albums.length" :class="{'active':type==1}" @click="changeType(1)">热门专辑</div>
          <div class="mv" v-if="mvs.length" :class="{'active':type==2}" @click="changeType(2)">相关mv</div>
        </div>
        <div class="content">
          <songs-list v-if="type === 0" :songList="artists"></songs-list>
          <album-list v-if="type === 1" :albumList="albums"></album-list>
          <mv-list v-if="type === 2" :mvList="mvs"></mv-list>
        </div>
      </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import SongsList from '@/components/SongsList'
import AlbumList from '@/components/AlbumList'
import MvList from '@/components/MvList'
export default {
  components:{
    SongsList,
    AlbumList,
    MvList,
  },
  setup(){
    const route = useRoute()
    const { proxy } = getCurrentInstance()

    const info = reactive({
      param:{
        id:route.query.id,
        limit:30,
        offset:0,
      },
      type:0,
      detail:{},
      briefDesc:"",
      mvs:[],
      albums:[],
      artists:[],
      isAlias:false
    })

    const changeType = (index)=>{
      info.type = index
    }

    const getDetail = async()=>{
      const {data:res} = await proxy.$http.artistDetail(info.param)
      if(res.code !== 200){
        return proxy.$msg.error("请求失败")
      }
      info.detail = res.data.artist
      info.isAlias = res.data.artist.alias.length
    }

    const getDesc = async()=>{
      const {data:res} = await proxy.$http.artistDesc(info.param)
      if(res.code !== 200){
        return proxy.$msg.error("请求失败")
      }
      info.briefDesc = res.briefDesc
    }

    const getMv = async()=>{
      const {data:res} = await proxy.$http.artistMv(info.param)
      if(res.code !== 200){
        return proxy.$msg.error("请求失败")
      }
      info.mvs = res.mvs
    }

    const getAlbum = async()=>{
      const {data:res} = await proxy.$http.artistAlbum(info.param)
      if(res.code !== 200){
        return proxy.$msg.error("请求失败")
      }
      info.albums = res.hotAlbums
    }

    const getArtist = async()=>{
      const {data:res} = await proxy.$http.artists(info.param)
      if(res.code !== 200){
        return proxy.$msg.error("请求失败")
      }
      info.artists = res.hotSongs && res.hotSongs.map((item,index)=>{
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
            license:islicense(item.id,index),//版权
            duration: proxy.$utils.formatSongTime(item.dt),
            url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
        }
    })
    }

    //版权
    const islicense = async (id,index) =>{
        const {data:res} = await proxy.$http.checkMusic(id)
        info.artists[index].license = res.success
    }

    onMounted(()=>{
      getDetail()
      getDesc()
      getMv()
      getAlbum()
      getArtist()
    })

    return{
      ...toRefs(info),
      changeType,
    }
  }
}
</script>

<style lang="less" scoped>

  .singer{
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .detail{
    display: flex;
    gap: 1rem;
    .el-image{
      flex: 2;
      border-radius: 10px;
    }
    .info{
      flex: 8;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      gap: 1rem;
      background: #fff;
      border-radius: 10px;
      padding: 20px;
    }
    .info-name{
      display: inline-block;
      .name{
        font-size: 24px;
        color: var(--color-text-main);
      }
      .alias{
        font-size: 16px;
        color: var(--color-text);
      }
    }
    .count{
      margin-top: 1rem;
      display: flex;
      gap: 1rem;
      font-size: 16px;
    }
    .descs{
      vertical-align: bottom;
      .desc{
        font-size: 16px;
        color: var(--color-text-main);
      }
      .desc-text{
        display: -webkit-box;
        font-size: 14px;
        color: var(--color-text);
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 7;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
    }
  }

  .main{
    background: #fff;
    border-radius: 10px;
  }

  .select{
    padding: 0 20px;
    height: 40px;
    display: flex;
    div{
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      cursor: pointer;
      &.active{
        background:#f4f4f5;
      }
    }
  }

  .content{
    padding: 0 1rem;
  }
</style>