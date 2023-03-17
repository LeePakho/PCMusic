<template>
    <div class="search-main">
        <span class="sousuo">搜索结果</span><span class="txt">({{ info.total }}{{ info.typeList[typeIndex].t }})</span>
        <div class="search-tab">
            <div class="tab-item" :class="{'active':info.type==item.k}" v-for="item in info.typeList" @click="changeType(item.k)" :key="item.k">
                {{item.v}}
            </div>
        </div>
        <div class="list" >
            <songs-list v-if="info.type==1" :limit="info.limit" :offset="info.offset" :songList="info.songList"></songs-list>
            <album-list v-if="info.type==10" :albumList="info.albumList"></album-list>
            <singer-list  v-if="info.type==100" :SingerList='info.SingerList'></singer-list>
            <play-list v-if="info.type==1000" :sheetList='info.sheetList'></play-list>
            <mv-list v-if="info.type==1004" :mvList='info.mvList'></mv-list>
        </div>
        <el-pagination
            v-show="ispagination"
            @current-change='currentChange'
            :page-size="info.limit"
            :pager-count="5"
            layout="prev, pager, next"
            :total='info.total'
            :current-page="info.page"
        />
    </div>
</template>

<script setup>
    import { computed, getCurrentInstance, onMounted, reactive } from 'vue'
    import { useRoute } from 'vue-router'   
    import SongsList from '@/components/SongsList.vue'
    import AlbumList from '@/components/AlbumList.vue'
    import SingerList from '@/components/SingerList.vue'
    import PlayList from '@/components/playList.vue'
    import MvList from '@/components/MvList'

    const {proxy} = getCurrentInstance()
    const sotre = useRoute()
    const info = reactive({
        type:1,
        keywords:sotre.query.keywords||'',
        limit:20,
        page:1,
        offset:0,
        total:0,
        loading:false,
        songList:[],//单曲
        albumList:[],//专辑
        SingerList:[],//歌手
        sheetList:[],//歌单
        mvList:[],//MV
        typeList:[
                {k: 1, limit: 20, v: '单曲', t: '首单曲'},
                {k: 10, limit: 24, v: '专辑', t: '张专辑'},
                {k: 100, limit: 15, v: '歌手', t: '个歌手'},
                {k: 1000, limit: 30, v: '歌单', t: '个歌单'},
                {k: 1004, limit: 30, v: 'MV', t: '个MV'},
            ],
    })
    
    //修改type
    const changeType = (k)=>{
        info.type = k
        info.limit = info.typeList[typeIndex.value].limit
        info.offset = 0
        info.page = 1
        cloudSearch()
    }

    const ispagination = computed(()=>info.total>info.limit)

    const typeIndex = computed(()=>{
        for(var i = 0; i < info.typeList.length; i++){
            if(info.type === info.typeList[i].k)
                return i
        }
        return -1
    })

    //数据获取 
    const cloudSearch = async()=>{
        info.loading = true
        const {data:res} = await proxy.$http.cloudsearch({keywords:info.keywords,limit:info.limit,offset:info.offset*info.limit,type:info.type})
        if(res.code !== 200){
            return proxy.$msg.error("数据请求失败")
        }
        if(info.type == 1){
                info.songList = res.result.songs && res.result.songs.map((item,index)=>{
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
                info.total = res.result.songCount || 0;
        }else if(info.type == 10){
            info.albumList = res.result.albums && res.result.albums.map(item=>{
                return {
                    name:proxy.$utils.getStringByte(item.name)>10? item.name.substring(0,4)+'...' : item.name,
                    albumId:item.id,
                    picUrl:item.picUrl,
                    Singer:item.artist.name || '',
                    type:item.type,
                }
            })
            info.total = res.result.albumCount
        }else if(info.type == 100){
            info.SingerList = res.result.artists || []
            info.total = res.result.artistCount || 0
        }else if(info.type == 1000){
            info.sheetList = res.result.playlists
            info.total = res.result.playlistCount || 0
        }else if(info.type == 1004){
            info.mvList = res.result.mvs
            info.total = res.result.mvCount || 0
        }
        info.loading = false
    }

    const currentChange = (page)=>{
        info.page = page
        info.offset = page - 1
        cloudSearch()
    }
    //版权
    const islicense = async (id,index) =>{
        const {data:res} = await proxy.$http.checkMusic(id)
        info.songList[index].license = res.success
    }

    onMounted(()=>{
        cloudSearch()
    })
</script>

<style lang="less" scoped>
.sousuo{
    display: block;
    width: 150px;
    transform: scale(1.5);
    margin-bottom: 15px;
    text-align: center;
}
.txt{
    position: absolute;
    display: inline-block;
    top: 22px;
    left: 150px;
    // transform: scale();
}
.search-main{
    margin: 0 auto;
    padding: 20px 20px; 
    width: 70%;
    position: relative;
    background-color: #fff;
    border-radius: 20px 20px 20px 20px;
    min-height: 700px;
}
.search-tab{
    position: absolute;
    right: -80px;
    .tab-item{
        width: 80px;
        height: 40px;
        margin: 20px 0px;
        color: #000;
        background: #fff;
        line-height: 40px;
        text-align: center;
        border-radius: 0% 10px 10px 0%;
        overflow: auto;
        cursor: pointer;
        &.active{
            color: #fff;
            background: var(--color-text-height);
        }
    }
}
.el-pagination{
    margin-top: 30px;
}

</style>