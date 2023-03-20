<template>
        <el-dialog v-if="loginDialogVisible" model-value title="登录" width="20%" @close="close" draggable close-delay=150 open-delay=10>
            <div v-if="!isQRlogin">
                <div class="dialog">
                    <span>手机号: </span>
                    <el-input class="input" v-model="user.phone" placeholder=" 请输入手机号" />
                </div> 
                <div class="dialog">
                    <span>验证码: </span>
                    <el-input class="input" v-model="user.captcha" placeholder="请输入验证码">
                        <template #append>
                            <el-button class="send-out" :disabled='isSend' @click.stop="verification(user.phone)">{{ send_out }}</el-button>
                        </template>
                    </el-input>
                </div>
            </div>
            <div class="qr" v-else>
                <el-image fit="cover" :src="qr.qrimg"></el-image>
                <span>请使用网易云APP进行扫码</span>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button text plain @click="QRlogin">{{ !isQRlogin ? '二维码登录' : '邮箱登录' }}</el-button>
                    <el-button text v-if="!isQRlogin" type="primary" @click="dialogVisible">登录</el-button>
                </span>
            </template>
        </el-dialog>
</template>

<script setup>
// import QrcodeVue from 'qrcode.vue'
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';

    const {proxy} = getCurrentInstance()
    const store = useStore()


    const send_out = ref("发送")
    const isSend = ref(false)

    const verification = async(userPhone)=>{
        const phone = /^1[34578]\d{9}$/ //手机号正则
        const timerstamp = Date.now()
        if(phone.test(userPhone)){
            const {data:res} = await proxy.$http.captchaSent({timerstamp,phone:userPhone})
            if(res.code !== 200 && !res.data){
                return proxy.$msg.error("请求失败")
            }
            return countDown()
        }else{
            return proxy.$msg.error("手机号嘛有误")
        }
    }

    const countDown = ()=>{
        new Promise(()=>{
            var time = 60
            isSend.value = true 
            var timer = setInterval(()=>{
                if(time>0){
                    send_out.value = --time
                }else{
                    send_out.value = "重新发送"
                    isSend.value = false 
                    clearInterval(timer)
                }
            },1000)
        })
    }

    const isQRlogin = ref(false)
    const user = reactive({
        phone:'',
        captcha:'',
    })
    const qr = reactive({
        key:'',
        qrimg:'',
        cookie:'',
    })

    const loginDialogVisible = computed(()=>store.state.loginDialogVisible)
    //关闭弹窗
    const close = ()=>{
        // isQRlogin.value = false
        isQRlogin.value = true
        user.phone = user.captcha = ""
        store.commit('setloginDialog',false)
    }
    //二维码登录
    const QRlogin = async()=>{
        isQRlogin.value = !isQRlogin.value
        let timerstamp = Date.now()
        if(isQRlogin){
            const {data} = await proxy.$http.loginKey({timerstamp})
            const {data:res} = data
            if(res.code === 200){
                qr.key = res.unikey
                base64(qr.key)  
                setTimeout(() => {
                    check(qr.key)
                }, 1000);
            }
        }
    }
    //获取二维码base64
    const base64 = async(key)=>{
        let timerstamp = Date.now()
        const {data:base64} = await proxy.$http.logincreate({key,qrimg:true,timerstamp})
        if(base64.code === 200){
            qr.qrimg = base64.data.qrimg
        }
    }
    // 二维码检测扫码状态接口
    const check = (key)=>{
        setTimeout(async() => {
            let timerstamp = Date.now()
            const {data:res} = await proxy.$http.logincheck({key,timerstamp})
            if(store.state.loginDialogVisible){
                switch(res.code){
                    case 800: 
                        proxy.$msg.warning(res.message)
                        close()
                    break;
                    case 801: 
                            check(qr.key)
                    break;            
                    case 802: 
                            check(qr.key)
                    break;
                    case 803: 
                        status(res.cookie)
                        window.localStorage.setItem('cookie',res.cookie)
                        store.commit("setUserCookit",res.cookie)
                        close()
                    break;
                }
            }
        }, 5000)
    }
    //cookie更新用户状态
    const status = async(cookie)=>{
        let timerstamp = Date.now()
        const loginStatus = await proxy.$http.loginStatus({timerstamp,cookie})
        if(loginStatus.data.data.code !== 200){
            return proxy.$msg.error("请求失败")
        }
        let userInfo = loginStatus.data.data.profile
        // window.localStorage.setItem("userInfo",JSON.stringify(userInfo))
        window.localStorage.setItem('isLogin',true)
        store.commit('setUserInfo',userInfo)
        store.commit('setisLogin',true)
    }
    
    const dialogVisible = async ()=>{
        const timerstamp = Date.now()
        const {data:res} = await proxy.$http.captchaVerify({timerstamp,phone:user.phone,captcha:user.captcha})
        if(!res.data){
            return proxy.$msg.error("验证码有误")
        }
        if(res.code === 405){
            return proxy.$msg.error(res.message)
        }
        const {data:status} = await proxy.$http.loginStatus({timerstamp})
        window.localStorage.setItem('isLogin',true)
        store.commit('setisLogin',true)
        getUserInfo(status.data.account.id)
        close()
    }
    //用户信息
    const getUserInfo = async (uid)=>{
        const {data:res} = await proxy.$http.getUserDetail({uid})
            console.log(res)
        if(res.code ===200){
            window.localStorage.setItem("userInfo",JSON.stringify(res.profile))
            store.commit('setUserInfo',res.profile)
        }
    }

    onMounted(()=>{
        base64()
        const cookie = window.localStorage.getItem('cookie')
        if(cookie){
            status(cookie)
        }
    })

</script>

<style lang="less" scoped>
.dialog{
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    span{
        flex: 1;
        margin: auto;
    }
    .input{
        flex: 5;
        
        .send-out{
            color:  #79bbff;
        }
    }
}
.qr{
    text-align: center;
    span{
        display: block;
    }
}
</style>