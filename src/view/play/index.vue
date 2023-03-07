<template>
  <div class="playlist" ref="scroll">
    <div class="playheader">
      <div class="headeritem" v-for="(categorie,index) in info.categories" :key="index">
        <div class="itemtitle">{{categorie.name}}</div>
        <div class="contextitem">
          <span :class="['box-item',item === info.select? 'acitve':'']" v-for="item in categorie.childern.slice(0,8)" :key="item.id"><span class="name" @click="changeSelect(item)">{{item.name}}</span></span>
          <el-popover
            v-if="categorie.childern.length>9"
            width="auto"
            trigger="click"
          >
            <template #reference>
              <span :class="['box-item','more',{'acitve':info.moreIndex == index}]"><span v-text="info.moreIndex == index?info.more:'更多'"></span><i v-show="info.moreIndex != index" class="iconfont icon-arrow"></i></span>
            </template>
            <div class="box-drop">
              <span :class="['box-item',item === info.select? 'acitve':'']" v-for="item in categorie.childern.slice(9,categorie.childern.length-1)" :key="item.id"><span class="name" @click="changeSelect(item,index)">{{item.name}}</span></span>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="playmain">
      <div class="playtitle">
        <div class="name"><span v-text="info.select?info.select.name:'全部歌单'"></span><i @click="changeSelect(null)" v-show="info.select" class="iconfont icon-closed"></i></div>
        <div class="type">
          <span :class="{'active':info.params.order == 'hot'}" @click="changeType('hot')">热门</span>
          <span :class="{'active':info.params.order == 'new'}" @click="changeType('new')">最新</span>
        </div>
      </div>
      <play-list :sheetList='info.sheetList'></play-list>
      <el-backtop :bottom="100" :visibilityHeight="600">
        <div
          style="
            height: 100%;
            width: 100%;
            background-color: var(--el-bg-color-overlay);
            box-shadow: var(--el-box-shadow-lighter);
            text-align: center;
            line-height: 40px;
            color: #1989fa;
            border-radius: 50%;
          "
        >
          UP
        </div>
      </el-backtop>
    </div>
  </div>
</template>

<script setup>
import playList from '@/components/playList.vue'
import { getCurrentInstance, onBeforeUnmount, onMounted, reactive } from 'vue'

const info = reactive({
  categories:[],
  sub:[],
  select:null,
  more:undefined,
  moreIndex:0,
  sheetList:[],
  isBaseline:false,
  params:{
    order:'hot',
    cat:'',
    limit:30,
    offset:0,
  }
})

const { proxy } = getCurrentInstance()

const getcatlist = async()=>{
  const {data:res} = await proxy.$http.playlistCatlist()
  if(res.code !== 200){
    return proxy.$msg.error("请求失败")
  }
  for (const k in res.categories) {
    const params = {name:res.categories[k]}
    params.childern = res.sub.filter(item=> item.category == k)
    info.categories.push(params)
  }
}

const changeSelect = (item,index=-1)=> {
  info.select = item
  info.params.offset = 0
  if(index>=0){
    info.more = item.name.substring(0,1) + '...'
    info.moreIndex = index
  }else{
    info.more = undefined
  }
  info.params.cat = item? item.name : ''
  getlist(info.params)
}

const getlist = async(params)=>{
  const {data:res} = await proxy.$http.playList(params)
  info.sheetList = info.params.offset !==0 ? [...info.sheetList,...res.playlists] : res.playlists
}

const changeType = type => {
  info.params.offset = 0
  info.params.order = type
  getlist(info.params)
}

const srcoll = ()=>{
 window.addEventListener("scroll",()=>{
  const srcollTop = document.documentElement.scrollTop || document.body.scrollTop
  const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  if(srcollTop + windowHeight >= scrollHeight){
    info.params.offset+=info.params.limit
    getlist(info.params)
  }
 })
}

let createSrcoll = srcoll()

onMounted(()=>{
  getcatlist()
  getlist(info.params)
  createSrcoll
})
onBeforeUnmount(()=>{ createSrcoll = null})
</script>

<style lang="less" scoped>

@m-b:25px;
.playlist{
  font-size: 14px;
  
}

.box-drop{
  .box-item{
    display: inline-block;
    padding: 0 20px;
    line-height: 26px;
    cursor: pointer;
  }
  .acitve{
    .name{
      color: #fff;
      background-color: gray;
    }
  }
}
.more{
  &.acitve{
    span{
      color: #fff;
      background-color: var(--color-text-height);
      opacity: .7;
    }
  }
}

.playheader{
  background: #fff;
  display: flex;
  padding: 40px 20px 20px 20px;
  margin-bottom: @m-b;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgba(0, 0, 0, .1);
  .headeritem{
    flex: 2;
    border-left: 1px solid #f5f5f5;
    padding-left: 35px;

    .itemtitle{
      color: var(--color-text-main);
    }
    .contextitem{
      display: flex;
      flex-wrap: wrap;
      justify-content: left;
      color: var(--color-text);

      .box-item{
        flex: calc(100% / 3);
        margin-top: 5%;
        cursor: pointer;

        &.acitve{
          .name{
            color: #fff;
            background-color: var(--color-text-height);
            opacity: .7;
          }
        }
      }

    }

    &:first-child{
      flex: 1;
      padding-left: 0;
      border-left: none;
      .box-item{
        flex: calc(100% / 2);
      }
    }
  }
}
.playmain{
  .playtitle{
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 50px;
    margin-bottom: @m-b;
    .name{
      color: var(--color-text-main);
      font-size: 25px;
      position: relative;
      i{
        position: absolute;
        top: 0;
        right: -30%;
        font-size: 15px;
        cursor: pointer;
      }
    }
    .type{
      display: flex;
      gap: 20px;
      span{
        position: relative;
        cursor: pointer;
        &.active{
          &::before{
            position: absolute;
            content: '';
            bottom: 0;
            width: 100%;
            height: 30%;
            background: var(--color-text-height);
            opacity: .3;
          }
        }
      }
    }
  }
}

</style>