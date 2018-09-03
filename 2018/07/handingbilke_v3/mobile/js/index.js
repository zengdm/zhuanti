define(function(require, exports, module) {
    'use strict';
   var arr = ['wb', 'wxgzh', 'pcx', 'app', 'wxq', 'qqq', 'wbtw', 'wxqfx'];
    var obj = {
            timer: '.flow-timer>span',
            // 结束时间
            endTime: '2018-07-25 20:59:59'
        },
        timers;
    var args = {
        page: 1,
        pageSize: 13,
        activity_id: 1,
    }
    var article = {
        init: function() {
          	let idfa = this.getUrlQueryString('idfa')
            var userAgent = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
            
            if(!userAgent){
                window.location.href="//zhuanti.diandong.com/zt/2018/07/handingbilke_v3/web/index.html?idfa="+ idfa
             }
            this.timer(this.stamp(obj.endTime));
            this.showEwm();
          
        },

        getUrlQueryString: function(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        showEwm: function() {
            var arr = ['wb','wxgzh','pcx','app','wxq','qqq','wbtw','wxqfx'];
             let pidfa = this.getUrlQueryString('idfa');
             let src;
             src = "./img/default.png";
             arr.forEach(function(el) {
                if(el== pidfa){
                    src = "./img/"+ el+'.png';
                }
             })
             $('.banner>div>img').attr('src',src)
        },
        stamp: function(day) {
            var re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
            return new Date(re[1], (re[2] || 1) - 1, re[3] || 1, re[4] || 0, re[5] || 0, re[6] || 0).getTime();
        },
        
        timer: function(timestamp) {
            var self = this;
            var showTime;
            var countDownTime;

            function blockTime() {
                var nowTime = new Date();
                // 获取时间戳
                var t = timestamp - nowTime.getTime();
                if (t <= 0) {
                   $(obj.timer).html('已结束')
                    $(obj.timer).html(countDownTime)
                    clearInterval(interval);
                    return;
                }
                var day = Math.floor(t / 1000 / 60 / 60 / 24);
                var hour = Math.floor(t / 1000 / 60 / 60 % 24);
                var min = Math.floor(t / 1000 / 60 % 60);
                var sec = Math.floor(t / 1000 % 60);
                if (day < 10) day = "0" + day;
                if (hour < 10) hour = "0" + hour;
                if (min < 10) min = "0" + min;
                if(sec < 10) sec = "0" + sec;
                showTime = day + '天 ' + hour + '小时 ' + min + '分 ' + sec + '秒 '
                $(obj.timer).html(showTime)
            }

            var interval = setInterval(function() {
                blockTime();
            }, 1000);
            blockTime();
        },
     
       

    }

    module.exports = article;

})