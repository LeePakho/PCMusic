import api from '@/api/request'
//账号密码登录
const Phonelogoin = ({phone = '',password = '',realIP = '43.241.243.255'})=>{
    return api.post('/login/cellphone',{phone,password,realIP})
}
//邮箱登录
const emailLogin = ({email = '',password = ''})=>{
    return api.post('/login',{email:`${email}@163.com`,password})
}
//游客登录
const touristLogin = ()=>{
    return api.get('/register/anonimous',{})
}
//二维码登录生成KEY
const loginKey = ({timerstamp = ''})=>{
    return api.get(`/login/qr/key?timerstamp=${timerstamp}`,{})
}
//二维码生成返回base64 和二维码信息
const logincreate = ({key = '' , qrimg = true,timerstamp=""}) => {
    return api.get(`/login/qr/create?key=${key}&qrimg=${qrimg}&timerstamp=${timerstamp}`,{})
}
//二维码检测扫码状态接口
const logincheck = ({key = '',timerstamp = ''})=>{
    return api.get(`/login/qr/check?key=${key}&timerstamp=${timerstamp}`,{})
}
//cookie更新状态
const loginStatus = ({timerstamp,cookie='',realIP='116.25.146.177'}) =>{
    return api.post(`/login/status?timerstamp=${timerstamp}&realIP=${realIP}`,{cookie})
}
//退出登录
const loginOut = ()=>{
    return api.get('/logout')
}
//用户详细
const getUserDetail = ({uid=''})=>{
    return api.get(`/user/detail?uid=${uid}`)
}
//热门搜索
const searchHot = () => { return api.get('/search/hot', {}) }
//搜索建议
const searchSuggest = (val) => {return api.get(`/search/suggest?keywords=${val}`)}
//多重匹配
const searchMultimatch = (KeyWords) => api.get(`/search/multimatch?keywords=${KeyWords}`)
//搜索 索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户 
//limit : 返回数量 , 默认为 30 offset : 偏移数量，用于分页 
//offset 偏移数量
//type 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合, 2000:声音
const cloudsearch = ({keywords,limit=20,offset=0,type=1})=>{
    return api.get(`/cloudsearch?keywords=${keywords}&limit=${limit}&offset=${offset}&type=${type}`,{})
}
//音乐url
const musicUrl = ({id})=>{
    return api.get(`/song/url?id=${id}`,{})
}
//音乐是否可用
const checkMusic = (id)=>{
    return api.get(`/check/music?id=${id}`)
}
//轮播图
const getBanner = ()=>{
    return api.get('/banner')
}
//热门歌单分类
const playListHot = ()=>{
    return api.get('/playlist/hot')
}
//新碟上架
const topAlbum = (area) =>{
    return api.get(`/top/album?area=${area}`)
}
//所以榜单
const topList = (() =>{
    return ()=> api.get('/toplist')
})()
//获取歌单详情
const playlistDetail = ({id})=>{
    return api.get(`/playlist/detail?id=${id}`)
}
//歌单 ( 网友精选碟 )
//order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
//cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
//limit: 取出歌单数量 , 默认为 50   offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
const playList = ({order,cat,limit,offset=0})=>{
    return api.get(`/top/playlist?order=${order}&cat=${cat}&limit=${limit}&offset=${offset}`)
}
//最新MV
const mvFirst = ({area,limit}) =>{
    return api.get(`/mv/first?limit=${limit}&area=${area}`)
}
//热门电台
const djHot = ({limit}) => {
    return api.get(`/dj/hot?limit=${limit}`)
}
//热门歌手
const topArtists = ({limit=20,offset=0})=>{
    return api.get(`/top/artists?offset=${offset}&limit=${limit}`)
}
//所有榜单内容摘要
const topListDetail = ()=>{
    return api.get('/toplist/detail')
}
//发送验证码
 const captchaSent = ({timerstamp,phone})=>{
    return api.get(`/captcha/sent?timerstamp=${timerstamp}&phone=${phone}`)
 }
 //验证验证码
 const captchaVerify = ({timerstamp,phone,captcha,realIP="116.25.146.177"})=>{
    return api.get(`/captcha/sent?timerstamp=${timerstamp}&phone=${phone}&captcha=${captcha}&realIP=${realIP}`)
 }
 //歌单分类
 const playlistCatlist = (()=>{
    return () => api.get('/playlist/catlist')
 })()
 //全部 mv
 const mv = ({area,type,order,limit,offset})=>{
    return api.get(`/mv/all?area=${area}&type=${type}&order=${order}&limit=${limit}&offset=${offset}`)
 }
 //歌手分类列表
 //initial 返回内容将以 name 字段开头为 b 或者拼音开头为 b 为顺序排列, 热门传-1,#传 0
 const artistList = ({ limit, offset, initial, type, area })=>{
    return api.get(`/artist/list?type=${type}&area=${area}&initial=${initial}&limit=${limit}&offset=${offset}`)
 }
export{
    Phonelogoin,
    searchHot,
    searchSuggest,
    emailLogin,
    touristLogin,
    loginOut,
    getUserDetail,
    loginKey,
    logincreate,
    logincheck,
    loginStatus,
    searchMultimatch,
    cloudsearch,
    musicUrl,
    checkMusic,
    getBanner,
    playListHot,
    playList,
    topAlbum,
    topList,
    playlistDetail,
    mvFirst,
    djHot,
    topArtists,
    topListDetail,
    captchaSent,
    captchaVerify,
    playlistCatlist,
    mv,
    artistList,
}