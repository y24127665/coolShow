{
    function getTime(time) {
        // 转换为式分秒
        let h = parseInt(time / 60 / 60 % 24)
        h = h < 10 ? '0' + h : h
        let m = parseInt(time / 60 % 60)
         m = m < 10 ? '0' + m : m
        let s = parseInt(time % 60)
         s = s < 10 ? '0' + s : s
        // 作为返回值返回
        return [h, m, s]
    }
    console.log(getTime(122));
}


window.onbeforeunload = function (e) {
        e = e || window.event
        
        if (e) {
            e.returnValue = '置忙时间记录刷新后会重置，建议记录下当前的置忙时间。'
        }
        return '置忙时间记录刷新后会重置，建议记录下当前的置忙时间。'
    }
