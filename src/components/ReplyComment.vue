<template>
  <div class="reply" @click="changeonreply">
    <span>我回复@<span class="name">{{param.user.nickname}}</span></span>
    <div class="comment_textarea">
        <textarea class="textarea" name="leave_msg" id="leave_msg" placeholder="期待你的神评论……" v-model="msg"></textarea>
    </div>
    <div class="comment_box_footer">
        <el-button type="primary" color="#ff641e" @click.stop="subReplyComment">评论</el-button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
    props:{
        param:Object
    },
    setup(props,content){
        const msg = ref('')

        const subReplyComment = ()=>{
            content.emit("replycomment",msg.value)
        }

        const changeonreply = ()=>{
            content.emit("changeonreply")
        }

        return{
            msg,
            subReplyComment,
            changeonreply,
        }
    }
}
</script>

<style lang="less" scoped>

.reply{
    .name{
        color:  #a0cfff;
    }
    .comment_textarea{
        position: relative;
        height: 30px;
        margin: 10px 0;
        .textarea{
            position: absolute;
            top: 0;
            left: 0;
            width: calc(100% - 30px);
            height: calc(100% - 20px);
            padding: 10px 15px;
            resize: none;
        }
    }
}

</style>