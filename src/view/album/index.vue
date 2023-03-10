<template>
  <div class="album">
     <div class="container">
      <div class="header">
        <div class="headerimg">
            <el-image class="image" :src="album.picUrl"></el-image>
        </div>
        <div class="info">
          <div class="info-title">
            <span class="title">{{ album.name }}</span>
            <span class="type">#    {{ album.type }}</span>
          </div>
          <div class="song-info">
            <div class="singer">
                歌手：
                <span v-for="(artist,index) in album.artists" :key="artist.id">
                    {{ index>0? "/"+artist.name : artist.name }}
                </span>
            </div>
            <div class="publishTime">发行时间：{{ $utils.formartDate(album.publishTime,"yyyy-MM-dd") }}</div>
            <div class="company">发行公司：{{ album.company }}</div>
          </div>
          <div class="descs">
            <div class="desc">歌单简介</div>
            <div class="desc-text">{{ album.description }}</div>
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

        <div v-if="total>limit">
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
      <comments :type="type" :id="id"></comments>
    </div>

    <div class="side">
        <div class="title" v-if="album.artist">{{ album.artist.name }}的其他专辑</div>
        <router-link :to="{ path:'/album',query:{id:item.id} }" class="item" v-for="item in hotAlbums" :key="item.id">
          <el-image :src="item.picUrl"></el-image>
          <div class="info">
            <div class="name">{{ item.name }}</div>
            <div class="time">{{ $utils.formartDate(item.publishTime,"yyyy-MM-dd") }}</div>
          </div>
        </router-link>
    </div>
  </div>
</template>

<script>
import SongsList from '@/components/SongsList'
import Comments from '@/components/Comments'
import { useRoute } from 'vue-router'
import { getCurrentInstance, onMounted, reactive, toRefs } from 'vue'
export default {
    components:{ SongsList , Comments },
    setup(){
        const { proxy } = getCurrentInstance()
        const route = useRoute()

        const info = reactive({
            id:route.query.id,
            album:{},
            list:[],
            hotAlbums:[],
            limit:15,
            page:1,
            total:0,
            type: 3, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 视频
        })


        const getsingeralbum = async()=>{
            const {data} = await proxy.$http.artistAlbum({id:info.album.artist.id,limit:5})
            info.hotAlbums = data.hotAlbums
        }

        const getalbum = async()=>{
            const {data} = await proxy.$http.album({id:info.id})
            if(data.code !== 200){
                return proxy.$msg.error("请求失败")
            }
            info.album = data.album
            getsingeralbum()
            info.list = data.songs && data.songs.map((item,index) =>{
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
            info.total = info.list.length

        }
        //版权
        const islicense = async (id,index) =>{
            const {data:res} = await proxy.$http.checkMusic(id)
            info.songList[index].license = res.success
        }

        const currentChange = pageIndex=>{
            info.page =  pageIndex
        }

        onMounted(()=>{
            getalbum()
        })

        return{
            ...toRefs(info),
            currentChange,
        }
    }
}
</script>

<style lang="less" scoped>

.album{
    display: flex;
    gap: 1rem;
    .container{
        flex: 8;
    }
    .side{
        flex: 2;
    }
}

.container{
    .header{
      display: flex;
      flex-direction: row;
      margin-bottom: 40px;

      .headerimg{
        flex: 3;
        .el-image{
            border-radius: 10px;
        }
      }

      .info{
        flex: 9;
        margin-left: 20px;
        background-color: #fff;
        border-radius: 10px;
        padding: 30px 20px 20px 20px;
        display: flex;
        flex-direction: column;
        justify-content: left;
        gap: 40px;

        .info-title{
          .title{
            color: var(--color-text-main);
            font-size: 25px;
            font-weight: 400;
          }

          .type{
            margin-left: 20px;
            font-size: 14px;
            color: var(--color-text-height);
          }

        }
        .song-info{
            font-size: 14px;
            color: var(--color-text);
        }

        .descs{
          font-size: 14px;
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
      margin-bottom: 30px;

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

    .desc-text{
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      color: var(--color-text);
    }

    .PlayLogin{
      display: block;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: #ff641e;
      color: #fff;
      font-size: 14px;
      border-radius: 50px;
      cursor: pointer;
    }
}

.side{
    background: #fff;
    border-radius: 10px;
    padding: 30px 20px;
    height: 100%;
    .title{
        position: relative;
        font-size: 16px;

        &::before{
            content: "";
            display: inline-block;
            background: #ff641e;
            width: 4px;
            height: 16px;
            margin: 3px 5px 0 0 ;
            border-radius: 3px;
            vertical-align: top;
        }
    }
    .item{
        display: flex;
        justify-content: left;
        margin-top: 20px;
        gap: 20px;
        font-size: 14px;
        text-decoration: none;
        cursor: pointer;
        .el-image{
            flex: 1;
            border-radius: 5px;
        }
        .info{
            position: relative;
            flex: 4;
            .name{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                word-break: break-all;
                color: var(--color-text-main);
            }
            .time{
                position: absolute;
                bottom: 0;
                color: var(--color-text);
            }
        }
    }
}
</style>