<template>
  <div class="mvlist">
    <div class="list">
      <mv-list :mvList='info.mvlist' ref="myScrollbar"></mv-list>
    </div>
    <div class="mv-aside">
      <el-affix target=".mv-aside" :offset="140">
        <div class="asidemain">
          <dv class="sort">
            <div class="title">排序</div>
            <div class="item">
              <div :class="{'active':info.orderIndex === index}" v-for="(item,index) in info.mvorder" :key="index"><span @click="changeIndex('order',index)">{{item}}</span></div>
            </div>
          </dv>
          <div class="region">
            <div class="title">区域</div>
            <div class="item">
              <div :class="{'active':info.areaIndex === index}" v-for="(item,index) in info.mvarea" :key="index"><span @click="changeIndex('area',index)">{{item}}</span></div>
            </div>
          </div>
          <div class="type">  
            <div class="title">类型</div>
            <div class="item">
              <div :class="{'active':info.typeIndex === index}" v-for="(item,index) in info.mvtype" :key="index"><span @click="changeIndex('type',index)">{{item}}</span></div>
            </div>
          </div>
        </div>
      </el-affix>
    </div>
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<script setup>
import MvList from '@/components/MvList.vue'
import { getCurrentInstance, onBeforeUnmount, onMounted, reactive } from '@vue/runtime-core'

const { proxy } = getCurrentInstance()
const info = reactive({
  mvarea:['全部','内地','港台','欧美','日本','韩国',],
  mvtype:['全部','官方版','原生','现场版','网易出品',],
  mvorder:['上升最快','最热','最新',],
  areaIndex:0,
  typeIndex:0,
  orderIndex:0,
  total:0,
  mvlist:[],
  params:{
    area:'',
    type:'',
    order:'',
    limit:36,
    offset:0,
  },
})

const getmvlist = async (params)=>{
  const {data:res} = await proxy.$http.mv(params)
  if(res.code !== 200){
    console.log(info.mvlist)
    return proxy.$msg.error("请求失败")
  }
  info.total = res.count || info.total
  if(info.mvlist){
    info.params.offset+=info.params.limit
  }
  info.mvlist = [...info.mvlist,...res.data]
}

const roll = () =>{
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  let timer = setInterval(()=>{
    document.documentElement.scrollTop = document.body.scrollTop = scrollTop -=50
    if(scrollTop <= 0){
      clearInterval(timer)
      info.mvlist = []
      getmvlist(info.params)
    }
  },10)
}

const changeIndex = (type,index) =>{
  info[`${type}Index`] = index
  info.params[`${type}`] = info[`mv${type}`][index]
  info.params.offset = 0
  roll()
  // getmvlist(info.params)
}

const createScroll = () =>{
  window.addEventListener("scroll",()=>{
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      if(scrollTop+windowHeight>=scrollHeight - 5){
        getmvlist(info.params)
      }
  })
}

let scroll = createScroll()

onMounted(()=>{
  getmvlist(info.params)
  scroll
})

onBeforeUnmount(()=>scroll=null)

</script>

<style lang="less" scoped>

.mvlist{
  display: flex;
  flex-direction: row;
  .list{
    flex: 7;
  }
  .mv-aside{
    flex: 2;
    .el-affix{
      height: 10%;
    }
  }
}



.asidemain{
  background-color: #fff;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .title{
    color: var(--color-text-main);
    font-size: 20px;
  }
  .item{
    font-size: 14px;
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: left;
    flex-wrap: wrap;
    gap: 20px;
    div{
      display: inline-block;
      position: relative;
      cursor: pointer;
      color: var(--color-text);
        &.active{
          span{
              &::before{
                position: absolute;
                content: "";
                bottom: 0;
                height: 30%;
                width: 100%;
                background-color: var(--color-text-height);
                opacity: .4 ;
              }
          }
        }
    }
  }
}

</style>