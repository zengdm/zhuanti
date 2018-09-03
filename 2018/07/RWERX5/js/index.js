define(function(require, exports, module) {
    // var cookie = require('cookie');
    // var user = require('user')
    require('swiper');
    var Header = require('header');
    var tip = require('tip');
    // var Page = require('page_v3');

    // var page = new Page({
    //     topbar: {
    //         status: false
    //     },
    //     // header: {
    //     //     status: true
    //     // },
    //     nav: {
    //         status: false
    //     },
    //     toolbar: {
    //         status: false
    //     }
    // });
    var mapObj;
    var markerArr = [];
    var lawFlag = true;
    var Rwzt = function(opt) {
        this.init(opt);
    };

    Rwzt.prototype = {
        elements: {
            lastName: $('#last-name'),
            mobile: $('#mobile'),
            carlist: $('#carlist'),
            dealer: $('#dealer'),
            day: $('#time-day'),
            minute: $('#time-minute'),
        },
        init: function(opt) {
            this.bindEvent();
            this.slideFun();
        },
        slideFun: function() {
            var self = this;
            var displaySwiper = new Swiper('.focus-swiper-container', {
                loop: true,
                grabCursor: true,
                setWrapperSize: true,
                autoplayDisableOnInteraction: false,
                wrapperClass: 'focus-swiper-wrapper',
                slideClass: 'focus-swiper-slide',
            });
            $('.leftbtn').click(function() {
                displaySwiper.swipePrev();

            })
            $('.rightbtn').click(function() {
                displaySwiper.swipeNext();
            })

        },
        bindEvent: function() {
            var context = this;

            $('.rw-banner-main-card-item-more a').on('click',function(){
                $('.dh-dialog-rule').removeClass('fn-hide');
            });
            $('.dh-dialog-close-rule').on('click',function(){
                $('.dh-dialog-rule').addClass('fn-hide');
            });

            /*表单提交*/
            $('.card-form-sel-button').on('click', function() {
                // var nickname = $("input[name='genderdis']:checked").val();
                var owner = $("input[name='owner-type']:checked").val();
                // var name = context.elements.lastName.val() + context.elements.firstName.val();
                var name = context.elements.lastName.val();
                var mobile = context.elements.mobile.val();
                var carlist = context.elements.carlist.val();
                var dealer = $('#dealer option:selected').val();
                var area = $('#area').val();
                var day = context.elements.day.val() || $('input[name="drive_date"]').val();
                var minute = context.elements.minute.val() || $('input[name="drive_time"]').val();
                var is_order = 0;
                if($('#checkbox-id').is(':checked')) {
                    is_order = 1;
                }
                // console.log(dealer)
                    // var city = $('#city').val();
                    // var jxsid = $('#jxsid').val();

                if (area == 0) {
                    tip.info('请选择地区');
                    return false;
                }
                if (dealer == 0) {
                    tip.info('请选择经销商');
                    return false;
                }
                if (context.elements.lastName.val() === '') {
                    tip.info('请输入真实姓名');
                    return false;
                }

                if (mobile === '') {
                    tip.info('请输入手机号码');
                    return false;
                }
                // console.log(is_order);

                var jsonData = {
                    // pid: $('input[name="pid"]').val(),
                    // prid: $('input[name="prid"]').val(),
                    // cxid: $('input[name="cxid"]').val(),
                    // pzid: $('input[name="pzid"]').val(),
                    // city: city,
                    // drive_date: day,
                    // drive_time: minute,
                    // jxsid: jxsid,
                    // owner: owner,
                    // type: '1'
                    // gender: nickname,
                    name: name,
                    mobile: mobile,
                    is_order:is_order,
                    activity_id:'2',
                    jxsid: dealer
                }

                $.ajax({
                    url: '//item.diandong.com/passport/ark/joinTestDirve',
                    data: jsonData,
                    // dataType: 'jsonp',
                    type: 'POST',
                    success: function(result) {
                        console.log(result)
                        if (result.code == 0) {
                           $('.page-container-success').removeClass('fn-hide');
                           $('form')[0].reset();
                           $('.page-container-success-close').on('click',function(){
                                $('.page-container-success').addClass('fn-hide');
                            });
                        } else {
                            tip.info(result.message);
                        }
                    }
                });
            });
          
        }
    };

    module.exports = Rwzt;
});