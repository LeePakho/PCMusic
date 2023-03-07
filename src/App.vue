<template>
    <el-container>
      <el-aside width="200px">
        <Sidebar/>
      </el-aside>
      <el-container>
        <el-header>
          <Header/>
        </el-header>
        <el-main style="text-align: left;">
          <router-view :key="key"></router-view>
        </el-main>
      </el-container>
    <Login/>
    <PlayBar></PlayBar>
    </el-container>
</template>

<script>
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Login from '@/components/Loginn.vue'
import PlayBar from '@/components/PlayBar/PlayBar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  components: {
    Sidebar,
    Header,
    Login,
    PlayBar,
  },
  setup(){
    const route = useRoute()
    const key = computed(()=>route.fullPath)

    return{
      key
    }
  }
}
</script>

<style>
::-webkit-scrollbar{
  width: 0px;
}
.el-main{
  margin-bottom: 20px;
}
body{
  padding: 0;
  margin: 0;
  background: rgb(227, 224, 224);
}
#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
