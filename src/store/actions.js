import utils from '@/utils/utils'
// import {checkMusic} from '@/api/index'
//合成playList 去除无版权
const filterPlayList = (list,playList = [])=>{
    return utils.synthesisPlayList(list.filter(item=>item.license),playList)
}
//返回下表
const findIndex = (list,playList = [])=>{
    return playList.findIndex(item => item.id === list[0].id )
}

export default{
    searchPlay({commit,state},list){
        const playList = filterPlayList(list,state.playList)
        commit('setPlayList',playList)
        commit('setPlayIndex',findIndex(list,playList))
        commit('setIsPlay',true)
    },
    addList({commit,state},list){
        const playList = filterPlayList(list,state.playList)
        commit('setPlayList',playList)
    },
    removeList({commit,state},list){
        const index = findIndex(list,state.playList)
        commit('removeList',index)
    },
    changeIndex({commit,state},list){
        const index = findIndex([list],state.playList)
        commit('setPlayIndex',index)
    }
}