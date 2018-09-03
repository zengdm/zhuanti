define(function(require, exports, module) {
    'use strict';
    require('/zt/common/mobile/js/swiper/2.7.5/swiper');
    var tip = require('/zt/common/mobile/js/tip/tip');
    var arr = ['wb', 'wxgzh', 'pcx', 'app', 'wxq', 'qqq', 'wbtw', 'wxqfx'];
    var obj = {
            timer: '.car-timer>span',
            bargain: '.car-bargain',
            // 结束时间
            endTime: '2018-07-17 20:59:59',
            prev: '.swiper-btn-prev',
            next: '.swiper-btn-next',
            name: '.car-name',
            mobile: '.car-tel',
            carType: '.car-type',
            verify: '.car-write-verify',
            verifyBtn: '.car-get-verify',
            sumitForm: '.car-baming',
            telReg: /^1[3,5,7,8]\d{9}$/,
            getedVerify: 'car-geted-verfiy',
            submitBefore: 'car-get-submitBefore',
            verifyTime: 60,
            verfiBool: [{
                cx: false
            }, {
                cx: false
            }],
            unloaded: false,
            pageBg: 'page-bg',
            tint: 'tint'
        },
        telVal, nameVal, typeVal, timers, pageTotal;
    var args = {
        page: 1,
        pageSize: 13,
        activity_id: 1,
    }
    var GET_VERIFY = '//item.dd-img.com/passport/ark/sendVerifyCode';
    var SUBMIT_FORM = '//item.dd-img.com/passport/ark/joinbmkj';
    var SUBMIT_FORM_YX = '//item.dd-img.com/passport/clientapi/wishadd';
    var TOPENERGYLIST = '//item.dd-img.com/globals/wsjoin/top';
    var article = {
        init: function() {
            var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?62ef90385ce203604aa0360102389278";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
           let idfa = this.getUrlQueryString('idfa')
   
            var userAgent = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
            
              if(!userAgent){        		 		 window.location.href="//zhuanti.diandong.com/zt/2018/07/handingbilke/web/index.html?idfa="+ idfa
   
               
             }
            this.timer(this.stamp(obj.endTime));
            this.slidePic();
            this.verifyAjax();
            this.submitFrom();
            this.ddwxQRcode();
            this.showEwm();
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
        // 轮播图
        slidePic: function() {
            var swiper = new Swiper('.swiper-container', {
                autoplay: 3000,
                autoplayDisableOnInteraction: false,
                loop: true,
                pagination: '.pagination'
            });
            $('.swiper-container').hover(function() {
                swiper.stopAutoplay();
            }, function() {
                swiper.startAutoplay();
            })
            $(obj.prev).click(function() {
                swiper.swipePrev();
            });
            $(obj.next).click(function() {
                swiper.swipeNext();
            });

        },
        // 验证码倒计时
        verifyTimer: function(times, idx) {
            var timer;
            timer = times;
            timer--;
            $(obj.verifyBtn).eq(idx).html(timer + 's');
            $(obj.verifyBtn).eq(idx).addClass(obj.getedVerify);
            $(obj.verifyBtn).eq(idx).attr('disabled');
            timers = setInterval(func, 1000);

            function func() {
                timer--;
                if (timer <= 0) {
                    timer = 0;
                    $(obj.verifyBtn).eq(idx).removeAttr('disabled');
                    $(obj.verifyBtn).eq(idx).removeClass(obj.getedVerify);
                    $(obj.verifyBtn).eq(idx).html('获取');
                    clearInterval(timers);
                    return;
                }
                $(obj.verifyBtn).eq(idx).html(timer + 's');
            }
        },
        empty: function(val, tips) {
            var v = val;
            if (!v) {
                tip.info(tips);
                return false;
            }
            return true;
        },
        // 手机号
        telJudge: function(idx) {
            var that = this,
                telRet;
            telVal = $.trim($(obj.mobile).eq(idx).val());
            var res = that.empty(telVal, '请输入手机号码');
            if (!res) {
                return;
            }
            telRet = obj.telReg.test(telVal);
            if (!telRet) {
                tip.info('请输入正确的手机号码');
                return;
            }
            return true;
        },
        ddwxQRcode: function() {
            var ddwxQRcodehtml = '<div class="ddwxQRcode">' +
                '<div class="ddwxQRcodegif">' +
                '<img src="//i1.dd-img.com/assets/image/1527735560-35793006ea84e5a4-60w-100h.gif">' +
                '</div>' +
                '<div class="ddwxQRcodetxt">' +
                '更多新能源汽车资讯<em></em>' +
                '</div>' +
                '<div class="ddwxQRcodeimg">' +
                '<img src="//i1.dd-img.com/assets/image/1527673418-6c206659e68ebb70-90w-100h.png"/>' +
                '</div>' +
                '</div>';
            $('.footer-g').before(ddwxQRcodehtml)

            var childone = $(".news-article-footer").children("div").eq(0).children("img")

            if (childone) {
                childone.attr('src', '//i2.dd-img.com/assets/image/1527844988-5942b25634c8fc8e-800w-180h.png')
            }
        },
        // 获取验证码
        verifyAjax: function() {
            var that = this;
            $(obj.verifyBtn).on('click', function() {
                var self = this,
                    carType, par, i;
                par = $(this).parents(obj.bargain);
                i = par.data('idx');
                nameVal = $.trim($(obj.name).eq(i).val());
                carType = par.find(obj.carType);
                if (carType.length) {
                    typeVal = $.trim(carType.val());
                    var m = that.empty(typeVal, '请输入您的意向车型');
                    if (!m) {
                        return false;
                    }
                }
                var s = that.empty(nameVal, '请输入您的姓名');
                if (s) {
                    var v = that.telJudge(i);
                    if (!v) return false;
                } else {
                    return;
                }
                var opt = {
                    mobile: telVal
                }
                $.ajax({
                    url: GET_VERIFY,
                    data: opt,
                    type: 'GET',
                    dataType: 'jsonp',
                    success: function(res) {
                        if (res.code == 0) {
                            obj.verfiBool[i].cx = true;
                            that.verifyTimer(obj.verifyTime, i);
                            tip.info(res.data.res);
                        } else {
                            $(obj.verifyBtn).eq(i).removeAttr('disabled');
                            tip.info(res.description);
                        }
                    },
                    beforeSend: function() {
                        $(self).attr({
                            disabled: "true"
                        });
                        $(self).css("pointer-events", "none");
                    },
                    complete: function() {
                        $(self).css("pointer-events", "auto");
                    }
                });
                return false;
            });

        },
        initSubmit: function(i) {
            $(obj.verifyBtn).eq(i).removeAttr('disabled');
            $(obj.verifyBtn).eq(i).removeClass(obj.getedVerify);
            $(obj.verifyBtn).eq(i).html('获取');
            $(obj.name).eq(i).val('');
            $(obj.verify).eq(i).val('');
            $(obj.mobile).eq(i).val('');
             $(obj.sumitForm).removeClass(obj.submitBefore)
            clearInterval(timers);
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
             let pidfa = this.getUrlQueryString('idfa');
             let src;
             src = "./images/default.png";
             arr.forEach(function(el) {
                if(el== pidfa){
                    src = "./images/"+ el+'.png';
                }
             })
             $('.car-banner>div>img').attr('src',src)
        },
        // 报名砍价
        submitFrom: function() {
            var that = this,
                verifyVal, pidfa, isPidfa;;
            $(obj.sumitForm).on('click', function() {
                var self = this,
                    carType, par, i;
                pidfa = that.getUrlQueryString('idfa');
                //isPidfa = arr.indexOf(pidfa);
                //if (isPidfa == '-1') {
                   // pidfa = "normal"
                //}
                par = $(this).parents(obj.bargain);
                i = par.data('idx');
                carType = par.find(obj.carType);
                var verfiSend = obj.verfiBool[i].cx;
                if (verfiSend) {
                    verifyVal = $.trim($(obj.verify).eq(i).val())
                    var m = that.empty(verifyVal, '验证码不能为空');
                    if (!m) return false;
                } else {
                    if (carType.length) {
                        typeVal = $.trim(carType.val());
                        var m = that.empty(typeVal, '请输入您的意向车型');
                        if (!m) {
                            return false;
                        }
                    }
                    nameVal = $.trim($(obj.name).eq(i).val());
                    var s = that.empty(nameVal, '请输入您的姓名');
                    if (s) {
                        var v = that.telJudge(i);
                        if (!v) {
                            return false;
                        } else {
                            verifyVal = $.trim($(obj.verify).eq(i).val())
                            var m = that.empty(verifyVal, '验证码不能为空');
                            if (!m) return false
                        }
                    } else {
                        return false;
                    }
                }

                var opt = {
                    name: nameVal,
                    mobile: telVal,
                    code: verifyVal,
                    idfa: pidfa,
                }
                // 意向车型
                if (carType.length) {
                    opt.wish = typeVal;
                    $.ajax({
                        url: SUBMIT_FORM_YX,
                        data: opt,
                        type: 'GET',
                        success: function(res) {
                            if (res.code == 0) {
                                that.initSubmit(i);
                                carType.val('');
                                tip.info('报名成功')
                            } else {
                                tip.info(res.message);
                            }
                        },
                        beforeSend: function() {
                            $(self).attr({
                                disabled: "true"
                            });
                            $(self).css("pointer-events", "none");
                        },
                        complete: function() {
                            $(self).removeAttr('disabled');
                            $(self).css("pointer-events", "auto");
                        }
                    });
                    return;
                }
                return false;
            })
        }

    }

    module.exports = article;

})