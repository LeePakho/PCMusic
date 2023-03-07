export default{
    formartDate(originVal,fmt){
        const dt = new Date(originVal)
        const opt = {
            yyyy: dt.getFullYear(),
            MM: (dt.getMonth()+1 + '').padStart(2,0),
            dd: (dt.getDay() + '').padStart(2,0),
            HH: (dt.getHours() + '').padStart(2,0),
            mm: (dt.getMinutes() + '').padStart(2,0),
            ss: (dt.getSeconds() + '').padStart(2,0),
        }

        for (const key in opt) {
            const ret = new RegExp('('+key+')').exec(fmt)
            if(ret){
                fmt = fmt.replace(ret[1],opt[key])
            }
        }
        return fmt
    },
    // 歌曲毫秒格式化处理
    formatSongTime(duration = 0){
        duration = duration>=0 ? duration/1000 : 0
        const m = (Math.floor(duration/60) + '').padStart(2,'0')
        const s = (Math.floor(duration%60) + '').padStart(2,'0')
        return  `${m}:${s}`
    } ,
    // 秒转 m:s
    formatTime(duration = 0){
        const m = (Math.floor(duration/60) + '').padStart(2,'0')
        const s = (Math.floor(duration%60) + '').padStart(2,'0')
        return  `${m}:${s}`
    } ,
    // 评论时间格式化处理
    formatMsgTime(duration = 0){
        let result = ''
        const Now = new Date()
        const Past = new Date(duration)

        if(Now.toDateString == Past.toDateString){
            result = this.formartDate(duration,"HH:mm")
        }else if(Now.getFullYear == Past.getFullYear){
            result = this.formartDate(duration,"MM月dd日 HH:mm")
        }else{
            result = this.formartDate(duration,"yyyy年MM月dd日 HH:mm")
        }
        return result
    },
    getSingerName(ar=[]){
        let names = ''
        ar.forEach(item=>{
            names += item.name + "/"
        })
        names = names.substring(0,names.length-1)
        if(names.length >= 15){
            names = names.substring(0,14) + "..."
        }
        return names
    },
    getStringByte(str){
        var num = 0
        str = str.split('')
        str.forEach(item=>{
            if(item.charCodeAt(0) < 299){
                num++
            }else{
                num+=2
            }
        })
        return num
    },
    synthesisPlayList(list = [] , playList = []){
        const arr = [...playList , ...list]
        var map = new Map
        arr.forEach(item=>{
            if(!map.has(item.id)){
                map.set(item.id,item)
            }
        })
        return [...map.values()]
    },
    calculationNum(num = 0){
        var str = num.toString()
        if(str.length>=6){
            str = `${str.substring(0,str.length-4).split("").reverse().join('')}.${str.substring(str.length-4,str.length-3)}万`
            if(str[0] == 0)
                str = str.substring(1,str.length)
        }
        return str
    },
    //限制字符
    linmitByte(str = '',val){
        let _str = str
        const num = this.getStringByte(str)
        if(num>=val){
            _str = str.substring(0,val/2) + "..."
        }
        return _str
    }
}