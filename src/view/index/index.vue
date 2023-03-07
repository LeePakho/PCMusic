<template>
  <div class="hot-main">
    <banner></banner>
    <div class="hot all">
      <div class="info">
        <div class="title">热门推荐</div>
        <div class="txt">
          <div class="txt-item" :class="{'active':playListHot_info.playListIndex === index}" @click="changePlayListIndex(index)" v-for="(tags,index) in playListHot_info.playListTags" :key="index">{{tags.name}}</div>
        </div>
      </div>
      <hot-recommend :playList='playListHot_info.playList'></hot-recommend>
    </div>
    <div class="album all">
      <div class="info">
        <div class="title">新碟上架</div>
        <div class="txt">
          <div class="txt-item" :class="{'active':new_album_info.albumIndex === index}" @click="changeAlbumIndex(index)" v-for="(tags,index) in new_album_info.albumType" :key="index">{{tags.name}}</div>
        </div>
      </div>
      <album-list :albumList='new_album_info.albumList'></album-list>
    </div>
    <div class="toplist">
      <ran-list></ran-list>
    </div>
    <div class="mv all">
      <div class="info">
        <div class="title">最新MV</div>
        <div class="txt">
          <div class="txt-item" :class="{'active':mv_info.mvIndex === index}" @click="changeMvIndex(index)" v-for="(tags,index) in mv_info.mvType" :key="index">{{tags}}</div>
        </div>
      </div>
      <mv-list :mvList="mv_info.mvList"></mv-list>
    </div>
    <div class="dj-artist">
      <div class="dj">
        <div class="info">
          <div class="title">热门电台</div>
        </div>
        <dj-list></dj-list>
      </div>
      <div class="artist">
        <div class="info">
          <div class="title">热门歌手</div>
        </div>
        <artist-list></artist-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import Banner from '@/view/index/Banner'
import HotRecommend from '@/view/index/HotRecommend'
import AlbumList from '@/components/AlbumList'
import RanList from '@/view/index/RanList'
import MvList from '@/components/MvList'
import DjList from '@/view/index/DjList'
import ArtistList from '@/view/index/ArtistList'

import playlisthot from '@/assets/js/hot_recom'
import playlistalbum from '@/assets/js/new_album'
import playlistmv from '@/assets/js/new_mv'

  const { playListHot_info, changePlayListIndex } = playlisthot()
  const { new_album_info, changeAlbumIndex } = playlistalbum()
  const { mv_info, changeMvIndex } = playlistmv()

</script>

<style lang="less" scoped>
  .dj-artist{
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    .dj{
      flex: 5;
      margin-right: 20px;
    }
    .artist{
      flex: 3;
    }
    .info{
      padding: 30px 40px 20px 0;
    }
  }


  .all,.dj,.artist{
    background-color: #FFF;
    border-radius: 15px;
    padding: 0 20px 20px 20px;
    margin-bottom: 40px;
  }

  .hot{
    padding-bottom: 30px;
    display: flex;
    flex-direction: column;
  }
  .title{
    display: block;
    color: var(--color-text-main);
    font-size: 25px;
    padding: 0 40px 0 0;
  }
  .info{
    display: flex;
    flex-direction: row;
    padding: 30px 40px 20px 0;

    .txt{
      display: flex;
      justify-content: left;
      align-items: flex-end;
      .txt-item{
        margin-right: 30px;
        color: var(--color-text);
        cursor: pointer;
        &.active{
          position: relative;
          &::after{
            position: absolute;
            content: '';
            left: 0;
            top: 60%;
            width: 100%;
            height: 6px;
            opacity: 0.3;
            background-color: var(--color-text-height);
            z-index: 1;
          }
        }
      }
    }
  }

</style>>