define(function(require, exports, module) {
    'use strict';
    require('//zhuanti.diandong.com/zt/common/mobile/js/swiper/2.7.5/swiper.js');
    var tip = require('//zhuanti.diandong.com/zt/common/mobile/js/tip/tip');
    // 立即试驾表单
    var obj;
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
        writeVerify: '.car-write-verify',
        verifyTimer: 60,
        member: '.drive-member',
        submit: '.car-baming',
        submitSucess: '.driver-box-succ',
        hide: 'fn-hide'

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
    var coupe = {
        elements: {
            intelligenTabBtn: $('.performance-tab-btn-item'),
            intelligenTabCnt: $('.performance-tab-cnt')
        },
        opt: {
            provinceId: '',
            cityId: ''
        },
        init: function(opts) {
            if (opts && Object.prototype.toString.call(opts) != '[object Object]') {
                opts = {
                    opts
                }
            }
            obj = $.extend(opts, form, tips);
            this.bindEvent();
            this.coupeSwiper();
            this.performanceTopSwiper();
            this.performanceSwiper();
            this.intelligenSwiper();
            this.internetSwiper();
            this.configurationSwiper();
            this.getProvince();
            this.submitFrom();
            // this.getVerify();
            this.performanceTab();
        },

        bindEvent: function() {

            var that = this;

            $('.activities-win-detail').on('click', function() {
                $('.activities-win-rule').removeClass('fn-hide');
                $("body").css("position", "fixed");
            });
            $('.activities-win-rule-close').on('click', function() {
                $('.activities-win-rule').addClass('fn-hide');
                $("body").css("position", "static");
            });

            $('.activities-win-rule-close').on('click', function() {
                $('.activities-win-rule').addClass('fn-hide');
                $("body").css("position", "static");
            });

          $('.activities-win-left,.activities-win-right').on('click', function() {
                var app = that.getUrlQueryString('fromApp');
                if(app){
                  if($(this).hasClass('activities-win-left')){
                        $(this).attr('href','ddb://diandong.com/testDriver')
                     }else{
                        $(this).attr('href','ddb://diandong.com/getRedPackage')
                     }
                      return;
                }

            });

        },

        getUrlQueryString: function(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
         },

        // 轿跑新感爵
        coupeSwiper: function() {
            var myCoupeSwiper = new Swiper('.coupe-swiper-container', {
                // autoplay:3000,
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'coupe-swiper-wrapper',
                slideClass: 'coupe-swiper-slide',
                pagination: '.coupe-pagination',
                paginationClickable: true
            })
        },

        // 性能新感爵Top
        performanceTopSwiper: function() {
            var myPerformanceTopSwiper = new Swiper('.performance-top-swiper-container', {
                // autoplay:3000,
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'performance-top-swiper-wrapper',
                slideClass: 'performance-top-swiper-slide',
                pagination: '.performance-top-pagination',
                paginationClickable: true
            })
        },

        // 性能新感爵
        performanceSwiper: function() {
            var myPerformanceSwiper = new Swiper('.performance-swiper-container', {
                // autoplay:3000,
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'performance-swiper-wrapper',
                slideClass: 'performance-swiper-slide',
                pagination: '.performance-pagination',
                paginationClickable: true
            })
        },

        // 智能新感爵
        intelligenSwiper: function() {
            var myIntelligenSwiper = new Swiper('.intelligen-swiper-container', {
                // autoplay:3000,
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'intelligen-swiper-wrapper',
                slideClass: 'intelligen-swiper-slide',
                pagination: '.intelligen-pagination',
                paginationClickable: true
            })
        },


        // 互联新感爵
        internetSwiper: function() {
            var myInternetSwiper = new Swiper('.internet-swiper-container', {
                // autoplay:3000,
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'internet-swiper-wrapper',
                slideClass: 'internet-swiper-slide',
                pagination: '.internet-pagination',
                paginationClickable: true
            })
        },

        // 车型配置
        configurationSwiper: function() {
            var myConfigurationSwiper = new Swiper('.configuration-swiper-container', {
                // autoplay:3000,
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'configuration-swiper-wrapper',
                slideClass: 'configuration-swiper-slide'
            });

            $('.left').on('click', function(e) {
                e.preventDefault()
                myConfigurationSwiper.swipePrev()
            })
            $('.right').on('click', function(e) {
                e.preventDefault()
                myConfigurationSwiper.swipeNext()
            })
        },

        // 性能新感爵tab
        performanceTab:function(){
             var context = this;

            this.elements.intelligenTabBtn.on('click', function() {

                var index = context.elements.intelligenTabBtn.index(this);
                if ($(this).hasClass('current')) {
                    return;
                } else {
                    context.elements.intelligenTabBtn.removeClass('current');
                    context.elements.intelligenTabBtn.eq(index).addClass('current');
                    context.elements.intelligenTabCnt.addClass('fn-hide');
                    context.elements.intelligenTabCnt.eq(index).removeClass('fn-hide');
                }

            });
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
                        $(obj.selectCity).html("<option>选择城市</option>");
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
            clearInterval(timers)
            $(obj.getVerify).html(timer + 's');
            $(obj.getVerify).addClass(obj.getedVerify)
            timers = setInterval(func, 1000);

            function func() {
                timer--;
                if (timer <= 0) {
                    timer = 0;
                    $(obj.getVerify).removeAttr('disabled');
                    $(obj.getVerify).html('获取验证码');
                    $(obj.getVerify).removeClass(obj.getedVerify)
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
            $(obj.selectPovince).val('');
           $(obj.selectCity).html("<option>请选择</option>");
            // $(obj.getVerify).removeAttr('disabled');
            // $(obj.getVerify).removeClass(obj.getedVerify);
            // $(obj.getVerify).html('获取验证码');
            $(obj.name).val('');
            // $(obj.writeVerify).val('');
            $(obj.tel).val('');
            // clearInterval(timers);
        },
        submitFrom: function() {
            var that = this,
                param;
            $(obj.submit).on('click', function() {
                var self = this;
                nameVal = $.trim($(obj.name).val());
                // verifyVal = $.trim($(obj.writeVerify).val());
                if (!that.opt.provinceId) {
                    tip.info(obj.provinceNone);
                    return false;
                }
                if (!that.opt.cityId) {
                    tip.info(obj.cityNone);
                    return false;
                }
                var n = that.empty(nameVal, obj.nameNone);
                if (!n) return false;
                var t = that.telJudge();
                if (!t) return false;
                // var v = that.empty(verifyVal, obj.verifyNone);
                // if (!v) return false;
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
                            $(obj.submitSucess).removeClass(obj.hide);
                            $('.driver-box-succ-close').on('click',function(){
                                $(obj.submitSucess).addClass(obj.hide);
                                that.initSubmit();
                            })
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

                return false;

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
                    track_id:'100556',//填写id
                    url: current_url,//当前网址
                    terminal_type:'1',
                    lauch_id: '100556'
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

    };


    module.exports = coupe;

})