define(function(require, exports, module) {
    'use strict';
    require('//zhuanti.diandong.com/zt/common/web/js/swiper/2.7.5/swiper');
    var tip = require('/zt/common/web/js/tip/tip');
    var obj;
    var pageObj = {
        main: '#main',
        page: '.page',
        // 智能新感觉
        intelContent: '.intel-content',
        intelNav: '.intel-nav',
        intelDes: '.intel-des',
        perfoFirst: '.perfo-first-content>ul',
        perfoSwitch: '.perfo-first-nav',
        perforHover: 'perforHover',
        pageNext: '.page-next',
        slide: '.swiper-container',
        ltPrev: '.swiper-btn-prev',
        gtNext: '.swiper-btn-next',
        prop: '.active-prop',
        off: '.active-off',
        activeShow: '.active-xz-show',
        video: '.video-main>video',
        hide: 'fn-hide'
    }
    // 立即试驾表单
    var form = {
        driveForm: '.drive-form',
         // 选择省份
        selectPovince: '.sec-province',
        //城市
        selectCity: '.sec-city',
        name: '.car-name',
        tel: '.car-tel',
        telReg: /^1[3,5,7,8]\d{9}$/,
        getVerify: '.car-get-verify',
        getedVerify: 'getedVerify',
        writeVerify:'.car-write-verify',
        verifyTimer: 60,
        member: '.drive-member',
        carSucc: '.car-succ',
        carClose: '.car-succ-close',
        submit: '.car-baming',

    }
    var tips = {
        telNone: '请输入手机号码',
        telRet: '请输入正确的手机号码',
        nameNone: '请输入真实姓名',
        verifyNone: '请输入验证码',
        provinceNone: '请选择省份',
        cityNone: '请选择城市'
    }

    var GETPROVINCE = '//item.diandong.com/passport/ark/getProvince';
    var GETCITY = '//item.diandong.com/passport/ark/getCity';
    var SUBMIT = '//item.diandong.com/passport/ark/joinTestDirve';
    var GETVERIFY = '//item.diandong.com/passport/ark/sendVerifyCode';

    var provinceVal = '',
        cityVal = '',
        nameVal = '',
        telVal = '',
        verifyVal = '',
        timers;
    var active = {
        opt: {
            provinceId: '',
            cityId: ''
        },
        init: function(opts) {
            var that = this;
            if (opts && Object.prototype.toString.call(opts) != '[object Object]') {
                opts = {
                    opts
                }
            }
            obj = $.extend(opts, pageObj, form, tips);
            that.perfoFn();
            that.bindEvent();
            that.video();
            that.getProvince();
            that.submitFrom();
            // that.getVerify();
            var slideLen = $(obj.slide).length;
            for (var i = 0; i < slideLen; i++) {
                that.slidePic(i + 1);
            }
        },
        bindEvent: function() {
            $(obj.prop).on('click', obj.off, function() {
                $(obj.prop).addClass(obj.hide)
            })
            $(obj.activeShow).on('click', function() {
                $(obj.prop).removeClass(obj.hide)
            })
        },
        perfoFn: function() {
            var index, intelIndex;
            $(obj.perfoSwitch).find('li').eq(0).addClass(obj.perforHover)
            $(obj.perfoFirst).find('li').eq(0).removeClass(obj.hide)
            $(obj.intelContent).find('li').eq(0).addClass(obj.hide)
            $(obj.perfoSwitch).on('mouseover', 'li', function() {
                index = $(this).index();
                $(obj.perfoSwitch).find('li').removeClass(obj.perforHover);
                $(obj.perfoFirst).find('li').addClass(obj.hide)
                $(obj.perfoFirst).find('li').eq(index).removeClass(obj.hide);
                $(this).addClass(obj.perforHover)
            })
            // 智能
            $(obj.intelNav).on('mouseover', 'li', function() {
                intelIndex = $(this).index();
                $(obj.intelDes).addClass(obj.hide);
                $(obj.intelContent).find('li').addClass(obj.hide);
                $(obj.intelContent).find('li').eq(intelIndex).removeClass(obj.hide);
            })
            $(obj.intelNav).on('mouseout', 'li', function() {
                $(obj.intelContent).find('li').eq(intelIndex).addClass(obj.hide);
            })
        },
        // 轮播图
        slidePic: function(index) {
            var swiper = new Swiper('.swiper-container' + index, {
                autoplay: 3000,
                autoplayDisableOnInteraction: false,
                loop: true,
                pagination: '.pagination' + index,
                paginationClickable: true,
            });
            var el = '.swiper-container' + index;
            var prev = obj.ltPrev + index;
            var next = obj.gtNext + index;
            $(el).hover(function() {
                swiper.stopAutoplay();
            }, function() {
                swiper.startAutoplay();
            })
            $(prev).click(function() {
                swiper.swipePrev();
            });
            $(next).click(function() {
                swiper.swipeNext();
            });

        },
        video: function() {
            var Media = document.getElementById("video");
            // Media.play(); //播放
            // Media.pause(); //暂停
            $(obj.video).on('click', function() {
                if (Media.paused) {
                    Media.play()
                } else {
                    Media.pause();
                }
            })
        },
        getProvince: function() {
            var that = this;
            $.ajax({
                url: GETPROVINCE,
                type: 'get',
                success: function(res) {
                    if (res.code == 0) {
                        res.data.forEach(function(el) {
                            var option = '<option data-provinceId="' + el.province_id + '" value="' + el.province_id + '">' + el.name + '</option>'
                            $(obj.selectPovince).append(option)
                        })
                        // that.getCity();
                    } else {
                        tip.info(res.message);
                    }
                },
                beforeSend: function() {

                },
                complete: function() {

                }
            });
            $(obj.selectPovince).on('change', function() {
                that.opt.provinceId = $(this).val();
                // console.log( that.opt.provinceId)
                that.getCity();
            })

        },
        getCity: function() {
            var that = this;
            var opt = {
                province_id: that.opt.provinceId
            }
            $.ajax({
                url: GETCITY,
                data: opt,
                type: 'get',
                success: function(res) {
                    if (res.code == 0) {
                       $(obj.selectCity).html("<option>选择城市</option>")
                        res.data.forEach(function(el) {
                            var option = '<option value="' + el.city_id + '">' + el.name + '</option>'
                            $(obj.selectCity).append(option)
                        })

                    } else {
                        tip.info(res.message);
                    }
                },
                beforeSend: function() {

                },
                complete: function() {

                }
            });
            $(obj.selectCity).on('change', function() {
                that.opt.cityId = $(this).val();
            })
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
        telJudge: function() {
            var that = this,
                telRet;
            telVal = $.trim($(obj.tel).val());
            if (!telVal) {
                tip.info(obj.telNone);
                return false;
            }
            telRet = obj.telReg.test(telVal);
            if (!telRet) {
                tip.info(obj.telRet);
                return false;
            }
            return true;
        },
        // 验证码倒计时
        verifyTimer: function(times) {
            var timer;
            timer = times;
            timer--;
            clearInterval(timers);
            $(obj.getVerify).html(timer + 's');
            $(obj.getVerify).addClass(obj.getedVerify);
            timers = setInterval(func, 1000);

            function func() {
                timer--;
                if (timer <= 0) {
                    timer = 0;
                    $(obj.getVerify).removeAttr('disabled');
                    $(obj.getVerify).html('获取验证码');
                     $(obj.getVerify).removeClass(obj.getedVerify);
                    clearInterval(timers);
                    return;
                }
                
                $(obj.getVerify).html(timer + 's');
            }
        },
        getVerify: function() {
            var that = this;
            $(obj.getVerify).on('click', function() {
                var self = this;
                var t = that.telJudge();
                if (!t) return false;
                var opt = {
                    mobile: telVal
                }
                $.ajax({
                    url: GETVERIFY,
                    data: opt,
                    type: 'GET',
                    dataType: 'jsonp',
                    success: function(res) {
                        if (res.code == 0) {
                            that.verifyTimer(obj.verifyTimer);
                            tip.info(res.data.res);
                        } else {
                            $(obj.getVerify).removeAttr('disabled');
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
           $(obj.selectPovince).val('选择省份');
           $(obj.selectCity).html("<option>选择城市</option>");
            // $(obj.getVerify).removeAttr('disabled');
            // $(obj.getVerify).removeClass(obj.getedVerify);
            // $(obj.getVerify).html('获取验证码');
            $(obj.name).val('');
            // $(obj.writeVerify).val('');
            $(obj.tel).val('');
            // clearInterval(timers);
        },
        submitFrom: function() {
            var that = this,param;
            $(obj.driveForm).on('click', obj.submit, function() {
                var self = this;
                nameVal = $.trim($(obj.name).val());
                // verifyVal = $.trim($(obj.writeVerify).val());
                if(!that.opt.provinceId) {
                    tip.info(obj.provinceNone);
                    return false;
                }
                if(!that.opt.cityId) {
                    tip.info(obj.cityNone);
                    return false;
                }
                var n = that.empty(nameVal, obj.nameNone);
                if(!n) return false;
                var t = that.telJudge();
                if(!t) return false;
                // var v = that.empty(verifyVal, obj.verifyNone);
                // if(!v) return false;
                param = {
                    province_id: that.opt.provinceId,
                    city_id: that.opt.cityId,
                    name: nameVal,
                    mobile: telVal
                }
                that.cep();
                 $.ajax({
                    url: SUBMIT,
                    data: param,
                    type: 'GET',
                    success: function(res) {
                        if (res.code == 0) {
                            // that.verifyTimer();
                            $(obj.carSucc).removeClass(obj.hide);
                            $(obj.carClose).on('click', function() {
                                $(obj.carSucc).addClass(obj.hide);
                            })
                            that.initSubmit();
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
                        $(self).removeAttr("disabled");
                        $(self).css("pointer-events", "auto");
                    }
                });
                
            })
        },
        cep: function() {
            var cep_url= '//cep.saicmg.com';
            var current_url = window.location.href.split('#')[0];
            function a(){
                var d = {
                    act:'5',
                    username: nameVal,
                    mobile: telVal,
                    activity_num: 1218070501,
                    brand:'3362',//荣威3361，MG3362
                    cartype:'4200',//发起时写入
                    track_id:'100557',//填写id
                    url: current_url,//当前网址
                    terminal_type:'0',
                    lauch_id: '100557'
                };
                $.getJSON(cep_url+ '/cep/saic-sis-api?act=5&callback=?',
                    d,function(ret){
                        if(ret['status']=='ok'){
                            //alert("成功");
                        }
                })
            }
            a();
        }
    }         

    module.exports = active;

})