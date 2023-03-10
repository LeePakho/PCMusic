<template>
  <div class="comments">
    <div class="comment">
        <div class="comment-title">
            <span class="title">评论</span>
            <span class="num">共{{total}}条评论</span>
        </div>
        <div class="comment-box">
            <div class="comment-textarea">
                <textarea
                    class="textarea"
                    v-model="textarea"
                    name="textarea"
                    placeholder="期待您的神评论......"
                />
            </div>
            <div class="comment-box-but">
                <span class="box-but" @click="sendcomment">评论</span>
            </div>
        </div>
        <div class="comment-area">
            <template v-if="comments.length">
                <div class="item" v-for="item in comments" :key="item.commentId">
                    <div class="comment-img">
                        <el-image :src="item.user.avatarUrl"></el-image>
                    </div>
                    <div class="commentinfo">
                        <div class="nickname">{{ item.user.nickname }}</div>
                        <div class="content">{{ item.content }}</div>
                        <div class="beReplieds" v-if="item.beReplied.length">
                            <div class="beReplieds-item" v-for="beReplied in item.beReplied" :key="beReplied.beRepliedCommentId">
                                <span class="nickname">{{beReplied.user.nickname}}：</span><span class="content">{{beReplied.content}}</span>
                            </div>
                        </div>
                        <div class="commenttime">
                            <div class="time">{{ $utils.formartDate(item.time,"MM-dd HH:mm:ss")  }}</div>
                            <div class="oper">
                                <span>({{item.likedCount}})</span>
                                <i class="iconfont icon-comment" @click="replycomment(item.commentId)"></i>
                                <i v-if="userInfo.userId == item.user.userId" @click.stop="removecomment(item.commentId)" class="iconfont icon-del"></i>
                            </div>
                        </div>
                         <transition name="reply">
                            <reply-comment 
                                v-if="isreply && replyCommentId === item.commentId"
                                :param="item"
                                @changeonreply="changeonreply" 
                                @reply="reply"
                            ></reply-comment>
                         </transition>
                    </div>
                </div>
                <el-pagination
                    :page-size="limit"
                    @current-change='currentChange'
                    :pager-count="5"
                    :curren-page='page'
                    layout="prev, pager, next"
                    :total="total"
                    />
            </template>
            <template v-else>
                <div class="status">
                    <div class="loading" v-if="isLoding">评论加载中...</div>
                    <div class="empty" v-else>
                        <div><i class="iconfont icon-empty-main"></i></div>
                        <div>暂无留言</div>
                    </div>
                </div>
            </template>
        </div>
    </div>
    <div class="info">

    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onBeforeMount, onMounted, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import ReplyComment from '@/components/ReplyComment.vue'
export default {
  components: { ReplyComment },
    props:{
        type:Number,
        id:Number,
    },
    setup(props){
        const info = reactive({
            commenttype:'',
            limit:20,
            offset:0,
            page:0,
            before:0,
            total:0,
            comments:[],
            textarea:'',
            isLoding:false,
            isreply:false,
            replyCommentId:0,
            onreply:false,
        })
        const store = useStore()
        const { proxy } = getCurrentInstance()
        const userInfo = computed(()=>store.getters.userInfo)
        const getcommenttype = ()=>{
            info.isLoding = true
            switch(props.type){
                case 0 : info.commenttype = "commentMusic"; break;
                case 1 : info.commenttype = "commentMv"; break;
                case 2 : info.commenttype = "commentPlaylist"; break;
                case 3 : info.commenttype = "commentAlbum"; break;
                case 4 : info.commenttype = "commentvideo"; break;
            }
            getcomment()
            info.isLoding = false
        }

        const getcomment = async()=>{
            const {data} = await proxy.$http[info.commenttype]({id:props.id,limit:info.limit,offset:info.offset,before:info.before})
            info.comments = data.comments
            info.total = data.total
        }

        const currentChange = ()=>{
            info.offset+=1
            getcommenttype()
        }
        //发送
        const sendcomment = ()=>{
            if(!store.getters.isLogin){
                return store.commit("setloginDialog",true)
            }

            return commentHandler(1,info.textarea)
        }
        //删除
        const removecomment = (commentId)=>{
            commentHandler(0,"",commentId)
        }
        //回复
        const replycomment = (commentId)=>{
            info.isreply = true
            info.replyCommentId = commentId
            changeonreply()
        }
        //emit
        const reply = (msg)=>{
            commentHandler(2,msg,info.replyCommentId)
        }
        //评论
        const commentHandler = async(t,content,commentId)=>{
            const params = {
                t,
                type:props.type,
                id:props.id,
                content,
                commentId,
            }
            const {data} = await proxy.$http.comment(params)
            if(data.code !== 200){
                return props.$msg.error("请求失败");
            }
            getcommenttype()
            switch(t){
                case 0:props.$msg.success("删除成功");break
                case 1:props.$msg.success("发送成功");break
                case 2:
                    props.$msg.success("回复成功");
                    info.isreply=false;
                    info.replyCommentId = 0
                    break
            }
            info.textarea = info.replytextarea = ''
        }

        const changereply = (e)=>{
            if(!e){
                info.isreply = false
            }
        }

        const changeonreply = ()=>{
            info.onreply = true
        }

        const windosOn = ()=>{
            window.addEventListener('click',()=>{
                if(info.isreply && !info.onreply){
                    console.log("111")
                    changereply()
                }
                info.onreply = false
            })
        }

        let replychange = windosOn()

        onBeforeMount(()=>{
            replychange = null
        })

        onMounted(()=>{
            getcommenttype()
            replychange
        })

        return{
            reply,
            userInfo,
            ...toRefs(info),
            currentChange,
            sendcomment,
            removecomment,
            replycomment,
            changereply,
            changeonreply,
        }
    }
}
</script>

<style lang="less" scoped>

.comment-title{
    vertical-align: bottom;
    margin-bottom: 20px;
    .title{
        font-size: 25px;
        color: var(--color-text-main);
    }
    .num{
        margin-left: 20px;
        font-size: 16px;
    }
}

.comment-box{
    margin-bottom: 20px;
    .comment-textarea{
        position: relative;
        width: 100%;
        height: 80px;
        margin-bottom: 20px;
        .textarea{
            position: absolute;
            left: 0;
            top: 0;
            width: calc(100% - 30px);
            height: calc(100% - 20px);
            resize: none;
            padding: 10px 15px;
            margin: 0;
            border: 0;
            border-radius: 0;
            box-shadow: none;
            overflow: hidden;
        }
    }
    .box-but{
        margin: 20px 0;
        padding: 10px;
        background: #ff641e;
        color: #fff;
        border-radius: 5px;
        cursor: pointer;
    }
}

.comment-area{
    .item{
        display: flex;
        justify-content: left;
        padding: 30px 20px;
        background: #fff;
        border-radius: 5px;
        margin-top: 20px;
        .comment-img{
            width: 40px;
            height: 40px;
            .el-image{
                border-radius: 50%;
            }
        }
        .commentinfo{
            font-size: 14px;
            padding-left: 20px;
            width: 100%;
            .nickname{
                color: var(--color-text);
                line-height: 24px;
            }
            .content{
                line-height: 28px;
            }
            .commenttime{
                display: flex;
                justify-content: space-between;
                color: var(--color-text);
                line-height: 28px;
                .oper{
                    vertical-align: bottom;
                    i{
                        padding: 0 10px;
                        cursor: pointer;
                        color: #000;
                    }
                }
            }
            .beReplieds{
                .beReplieds-item{
                    padding: 10px 20px;
                    background:#f4f4f5;
                    .nickname{
                        color:#c8c9cc;
                    }
                    .content{
                        color: #b1b3b8;
                    }
                }
            }
        }
    }
}

.reply-enter-active, .reply-leave-active {
    transition: all .3s ease-in-out;
}
.reply-enter-from, .reply-leave-to {
    opacity: 0;
}

</style>