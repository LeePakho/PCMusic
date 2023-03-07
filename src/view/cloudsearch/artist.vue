<template>
    <div>
        <template v-if="!isLoading">
            <SingerList :SingerList='SingerList'></SingerList>
        </template>
        <template v-else>
            <Loading></Loading>
        </template>
    </div>
</template>

<script>
import Loading from '@/components/loading.vue'
import SingerList from '@/components/SingerList'

export default {
    props:{
        SingerList:Array,
        loading:Boolean,
    },components:{
        Loading,
        SingerList,
    },setup(){

    }
}
</script>

<style>

</style>