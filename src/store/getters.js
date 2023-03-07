export default{
    isLogin(state){
        return state.isLogin || JSON.parse(window.localStorage.getItem('isLogin'))
    },
    userInfo(state){
        return state.userInfo || JSON.parse(window.localStorage.getItem('userInfo')) || {}
    },
    isPlay(state){
        return state.isPlay
    },
    playList(state){
        return state.playList || JSON.parse(window.localStorage.getItem('playList')) || []
    },
    playIndex(state){
        return state.playIndex
    }
}