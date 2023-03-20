<template>
  <div class="banner">
    <el-skeleton
      :loading="!info.bannerList.length"
      animated
    >
      <template #template>
        <el-skeleton-item class="skeleton-item" variant="image"/>
        <el-skeleton-item class="skeleton-item" variant="image"/>
        <el-skeleton-item class="skeleton-item" variant="image"/>
        <el-skeleton-item class="skeleton-item" variant="image"/>
      </template>
      <template #default>
        <Swiper
            :slides-per-view='4'
            :autoplay="{delay:3000,disableOnInteraction:false}"
            :pagination="{clickable :false, dynamicBullets: true, dynamicMainBullets: 1}"
            :modules='modules'
        >
            <SwiperSlide v-for="item in info.bannerList" :key="item">
                <el-image :src="item.imageUrl" @click="jump(item)"> </el-image>
            </SwiperSlide>
        </Swiper>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>

import { getCurrentInstance, onMounted, reactive } from '@vue/runtime-core'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper'
import 'swiper/css'
import "swiper/css/pagination";
import { useRouter } from 'vue-router';

    const router = useRouter()
    const {proxy} = getCurrentInstance()
    const info = reactive({
        bannerList:[]
    })
    
    const modules = [Pagination,Autoplay]

    const getBanner=async()=>{
        const {data:res} = await proxy.$http.getBanner()
        if(res.code !== 200 )
        {
            proxy.$msg.erroe("请求失败")
        }
        info.bannerList = res.banners && res.banners.map(item=>{
            return{
                id:item.targetId,
                type:item.targetType,
                imageUrl:item.imageUrl,
                url:item.url
            }
        })
    }

    const jump = item =>{
        switch (item.type) {
            case 1: // 单曲
                router.push({ path: '/song', query: { id: item.id } })
                break
            case 10: // 专辑
                router.push({ path: '/album', query: { id: item.id } })
                break
            case 1000: // 歌单
                router.push({ path: '/playlist', query: { id: item.id } })
                break
            case 1004: // MV
                router.push({ path: '/mv', query: { id: item.id } })
                break
            case 3000: // 外链
                window.open(item.url, '_blank')
                break
        }
    }

    onMounted(()=>{
        getBanner()
    })

</script>

<style lang="less" scoped>

    .banner{
        padding-bottom: 40px;
    }
    .swiper{
        padding-bottom: 30px;
        .swiper-slide{
            max-width: calc(100% / 4 - 20px);
            margin-right: 20px;
            .el-image{
                cursor: pointer;
            }
        }
    }
    .el-image{
        width: 100%;
        height: 100%;
        border-radius: 10px;
        margin-right: 10%;
    }
    .el-skeleton{
        display: flex;
        justify-content: space-between;
        padding: 20px 0;
        .skeleton-item {
            flex: calc(100% / 4);
            width: auto;
            max-width: calc(100% / 4 - 20px);
            height: 100px;
        }
    }
</style>