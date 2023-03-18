<template>
  <header class="header">
    <div class="menu"></div>
    <Search/>
    <div :class="isLogin ? 'user-avatar' : 'login'">
      <div class="logined" v-if="isLogin">
        <el-image :src="userInfo.avatarUrl " class="avatar"></el-image>
        <span class="nickname">{{userInfo.nickname }}</span>
        <!-- <span class="set"><i class="iconfont icon-set"></i></span> -->
        <span class="quit" @click="logout"><i class="iconfont icon-quit"></i></span>
      </div>
      <span v-else class="login-btn" @click="loginDialog">登录</span>
    </div>
  </header>
</template>

<script setup>  
  import Search from './Search.vue';
  import {useStore} from 'vuex'
  import { computed, getCurrentInstance } from 'vue';

  const store = useStore()
  const {proxy} = getCurrentInstance()
  const userInfo = computed(()=>store.getters.userInfo)

  const isLogin =computed(()=> store.getters.isLogin )
  //登录弹窗
  const loginDialog = ()=>store.commit('setloginDialog',true)
  //退出登录
  const logout = async()=>{
    window.localStorage.removeItem("cookie")
    window.localStorage.removeItem("playList")
    window.localStorage.setItem('isLogin',false)
    store.commit('setisLogin',false)
    await proxy.$http.loginOut()
  }
</script>

<style lang="less" scoped>
.header{
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.menu{
  flex: 1;
}
.user-avatar{
  padding: 5px 0 5px 20px;
  text-align: center;
  .avatar{
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 100%;
    overflow: hidden;
    cursor: pointer;
  }
  .logined{
    display: flex;
    align-items: center;
    span{
      display: inline-block;
      height: 24px;
      line-height: 24px;
      font-weight: 300;
      padding: 0 10px;
      cursor: pointer;
    }
  }
}
.login{
  margin: auto;
  padding: 0 20px;
  .login-btn{
    font-size: 18px;
    cursor: pointer;
  }
}


</style>

