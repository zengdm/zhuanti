define(function(require, exports, module) {
    var Header = require('header');
    var tip = require('tip');
    var Rwzt = function() {
        this.init();
    };

    Rwzt.prototype = {
        elements: {
            name: $('#name'),
            tel: $('#tel'),
        },
        init: function() {
            this.bindEvent();
        },
        
        bindEvent: function() {
            var context = this;
            /*表单提交*/
            $('#submitBtn').on('click', function(event) {
                event.preventDefault();
                var name = context.elements.name.val();
                var tel = context.elements.tel.val();
                var car_name = $('#chexing').val() ;
                if (context.elements.name.val() === '') {
                    tip.info('请输入真实姓名');
                    return false;
                }
                var telreg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
                if (tel === '') {
                    tip.info('请输入手机号码');
                    return false;
                }
                if (!telreg.exec(tel)){
                    tip.info('请输入正确的手机号码');
                    return false;
                }
                if (car_name === "") {
                    tip.info('请选择车型');
                    return false;
                }
     
                var jsonData = {
                    name: name,
                    mobile: tel,
                    jxsid: 16377,
                    car_name: car_name,
                    activity_id: 4
                }
                $.ajax({
                    url: '//item.diandong.com/passport/ark/joinTestDirve',
                    data: jsonData,
                    // dataType: 'jsonp',
                    type: 'POST',
                    success: function(result) {
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
            //切换tab
            $('#car_tab').on('click','a',function(){
                var me = $(this);
                me.siblings().removeClass('currentNav').end().addClass('currentNav');
                let curentItem = me.parent().next().find('.item').eq(me.index());
                if(curentItem.find('.lazyImg').length>0){
                    curentItem.find('.lazyImg').each(function(){
                        $(this).attr('src',$(this).attr('_src'));
                    })
                }
                curentItem.show().siblings().hide();


            });
            $('#perameter_nav').on('click', 'li',function(){
                var me = $(this);
                me.siblings().find('a').removeClass('currentNav');
                me.find('a').addClass('currentNav');
                me.parent().next().find('.item').eq(me.index()).show().siblings().hide();
            })
          
        }
    };

    module.exports = Rwzt;
});