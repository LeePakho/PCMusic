<template>
    <div class="side-main">
        <router-link to="/"><img src="@/assets/img/logo.jpg"/></router-link>
        <ul class="nav">
            <li :class="{'active' : menuActive.indexOf(item.path) >=0 }" v-for="(item,index) in menuList" :key="index" @click="selectMenu(item.path)">
                <i :class="['iconfont',`icon-${item.path || undefined}`]"></i>
                <span>{{ item.name }}</span>
            </li>
        </ul>
        <div class="address">
            <p>githun地址</p>
            <p></p>
        </div>
    </div>
</template>

<script setup>

    import { computed, reactive } from 'vue'
    import { useRoute, useRouter } from 'vue-router'   

    const menuList = reactive([{
            name: '首页',
            path: 'index'
        }, {
            name: '排行榜',
            path: 'rank'
        }, {
            name: '歌单',
            path: 'playlist'
        }, {
            name: 'MV',
            path: 'mvlist'
        }, {
            name: '歌手',
            path: 'artist'
        }, {
            name: '我的音乐',
            path: 'my'
        }])
    //计算当前路径
    const route = useRoute()
    let menuActive = computed(()=> route.path)
    //跳转路由
    const router = useRouter()
    const selectMenu = (path)=>router.push({path:`/${path}`})
</script>

<style lang="less" scoped>
.side-main {
    padding: 0;
    text-align: center;
}
.nav{
    padding-top: 30px;
    border-top: 1px solid #f5f5f5;

    li {
        display: block;
        padding: 10px 16px;
        color: var(--color-text-main);
        border-radius: 8px;
        text-align: left;
        font-weight: 300;
        cursor: pointer;

        &.active{
            font-weight: 400;
            background-color: #fff;
            box-shadow: 0 20px 27px rgb(0 0 0 / 5%);

            .iconfont{
                color: #fff;
                background-color: var(--color-text-height);
            }
            span{
                background-color: #fff;
            }
        }
        span{
            display: inline-flex;
            line-height: 32px;
        }
    }

    .iconfont {
        display: inline-flex;
        width: 32px;
        height: 32px;
        background-color: #fff;
        box-shadow: 0 4px 6px rgb(0 0 0 / 12%);
        border-radius: 6px;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        font-size: 18px;
        color: var(--color-text);
        vertical-align: top;
    }
}
</style>