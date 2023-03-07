<template>
    <div class="sheetlist">
        <singer-list class="singer" :SingerList='info.sheetlist'></singer-list>
        <div class="aside">
          <el-affix target=".aside" :offset="140">
            <div class="asidemain">
              <div class="initial">
                <span :class="{'active':info.params.initial === item.val}" v-for="item in info.initial" :key="item.val" @click="changParams('initial',item.val)">{{item.label}}</span>
              </div>
              <div class="area">
                  <span :class="{'active':info.params.area === item.val}" v-for="item in info.area" :key="item.val" @click="changParams('area',item.val)">{{item.label}}</span>
              </div>
              <div class="type">  
                <span :class="{'active':info.params.type === item.val}" v-for="item in info.type" :key="item.val" @click="changParams('type',item.val)">{{item.label}}</span>
              </div>
            </div>
          </el-affix>
        </div>
    </div>
</template>

<script setup>
import SingerList from '@/components/SingerList'
import { getCurrentInstance, onBeforeUnmount, onMounted, reactive } from "@vue/runtime-core"

const { proxy } = getCurrentInstance()

const info = reactive({
    sheetlist:[],
    type: [{ label: '全部', val: -1 }, { label: '男歌手', val: 1 }, { label: '女歌手', val: 2 }, { label: '乐队', val: 3 }],
    area: [{ label: '全部', val: -1 }, { label: '华语', val: 7 }, { label: '欧美', val: 96 }, { label: '日本', val: 8 }, { label: '韩国', val: 16 }, { label: '其他', val: 0 }],
    initial: [{ label: '热门', val: -1 }, { label: '#', val: 0 }],
    typeIndex:0,
    areaIndex:0,
    initialIndex:0,
    params:{
        limit:18,
        offset:0,
        initial:-1,
        type:-1,
        area:-1,
    }   
})

const changParams = (label,val) =>{
  info.params[label] = val
  roll()
}

const renderInitial = ()=>{
    let array = []
    for (let index = 0; index < 26; index++) {
        array.push({
            label:String.fromCharCode(65 + index),
            val:String.fromCharCode(97 + index)
        })
    }
    info.initial = [info.initial[0],...array,info.initial[1]]
}

const getlist = async (params) =>{
    const {data:res} = await proxy.$http.artistList(params)
    console.log(res)
    if(res.code !== 200){
      return proxy.$msg.error("请求失败")
    }
    info.sheetlist = [...info.sheetlist,...res.artists]
}

const roll = () =>{
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  let timer = setInterval(()=>{
    document.documentElement.scrollTop = document.body.scrollTop = scrollTop -=50
    if(scrollTop <= 0){
      clearInterval(timer)
      info.sheetlist = []
      info.params.offset = 0
      setTimeout(() => {
        getlist(info.params)
      }, 1000);
    }
  },10)
}

const createScroll = () =>{
  window.addEventListener("scroll",()=>{
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      if(scrollTop+windowHeight>=scrollHeight - 5){
        info.params.offset += info.params.limit
        getlist(info.params)
      }
  })
}

let scroll = createScroll()

onMounted(()=>{
    renderInitial()
    getlist(info.params)
    scroll
})

onBeforeUnmount(()=>scroll=null)

</script>

<style lang="less" scoped>

  .sheetlist{
    display: flex;
    justify-content: left;
    flex-direction: row;
    .singer{
      flex: 7;
    }
    .aside{
      flex: 2;
    }
  }

  .el-affix{
    height: 10%;
  }

  .asidemain{
    width: 100%;
    background-color: #fff;
    border-radius: 14px;
    font-size: 14px;
    padding: 30px 20px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap:20px;
    .initial,.area,.type{
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      justify-content: left;
      gap: 5px;
      span{
        padding: 5px;
        border-radius: 5px;
        text-align: center;
        cursor: pointer;
        &.active{
          color: #fff;
          background-color: var(--color-text-height);
        }
      }
    }
    .initial{
      span{
        flex: calc(100% / 7);
        max-width: calc(100% / 7 - 15px);
      }
    }
  }

</style>>
