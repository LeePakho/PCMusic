<template>
    <div class="loading">
        <div class="loader"></div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>

.loading{
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 70%;
    min-width: 30%;
    .loader{
        position: absolute;
        width: 2.5em;
        height: 2.5em;
        background: rgba(111, 202, 220, 0.75);
        box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
        
    }
}


</style>