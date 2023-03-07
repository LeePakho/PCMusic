export default{
    setisLogin(state,val){
        state.isLogin = val
    },
    setloginDialog(state,val){
        state.loginDialogVisible = val
    },
    setUserInfo(state,val){
        state.userInfo = val
    },
    setIsPlay(state,val){
        state.isPlay = val
    },
    setPlayList(state,val){
        state.playList = val
        window.localStorage.setItem('playList',JSON.stringify(val))
    },
    setPlayIndex(state,val){
        state.playIndex = val
    },
    removeList(state,index){
        let playIndex = state.playIndex
        state.playList.splice(index,1)
        if(index < playIndex){
            state.playIndex-=1
        }else if(index == playIndex){
            state.isPlay = false
        }
    }
}