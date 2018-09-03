define(function(require, exports, module) {

    require('./saleremind-320c293ebe.css');

    var drive,
        dialog = require('dialog'),
        Carselect = require('carselect'),
        API_SUBMIT = "http://mall.diandong.com/project/remind/";

    var driveHtml = [
        '<div class="widget-saleremind-mask"></div>',
        '<div class="widget-saleremind">',
        '<header>',
        '<h3>开售提醒</h3>',
        '</header>',
        '<form id="saleremind_form" class="widget-saleremind-form">',
        '<input class="JS_activityid" type="hidden" name="pid" value=0>',
        '<dl class="widget-saleremind-selectcar">',
        '<dt>',
        '<span class="widget-saleremind-required">*</span>',
        '<span>请先选择车型：</span>',
        '</dt>',
        '<dd>',
        '<select id="saleremind_brand" name="brand"><option value=0></option></select>',
        '<select id="saleremind_series" name="cxid"><option value=0></option></select>',
        '<select id="saleremind_model" name="pzid"><option value=0></option></select>',
        '</dd>',
        '</dl>',

        '<table class="widget-saleremind-table">',
        '<tbody>',
        '<tr>',
        '<td class="widget-saleremind-ltd">',
        '<span class="widget-saleremind-required">*</span>',
        '<label for="saleremind_name">姓名：</label>',
        '</td>',
        '<td class="widget-saleremind-rtd">',
        '<input id="saleremind_name" class="widget-saleremind-text" type="text" name="name" maxlength=30>',
        '</td>',
        '</tr>',
        '<tr>',
        '<td class="widget-saleremind-ltd">',
        '<span class="widget-saleremind-required">*</span>',
        '<label for="saleremind_mobile">手机：</label>',
        '</td>',
        '<td class="widget-saleremind-rtd">',
        '<input id="saleremind_mobile" class="widget-saleremind-text" type="text" name="mobile" maxlength=11>',
        '</td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '<div class="widget-saleremind-submit">',
        '<button class="widget-saleremind-submitbtn">设置提醒</button>',
        '</div>',
        '<p class="widget-saleremind-tips">电动邦客服人员会在您选中的车型开售之前短信通知您</p>',
        '</form>',
        '<button class="widget-saleremind-close"></button>',
        '</div>'

    ].join('');

    var successHtml = ['<button class="con-remind-close widget-dialog-close j-close-dialog"></button>',
        '<div class="widget-saleremind-success-center clearfix">',
        '<div class="widget-saleremind-successicon"></div>',
        '<div class="widget-saleremind-successwords">',
        '<p class="widget-saleremind-congratulations">开售提醒成功</p>',
        '<p>电动邦客服人员会在您选中的</p>',
        '<p>车型开售之前短信通知您</p>',
        '</div>',
        '</div>',
        '<div class="con-remind-ensurebox"><button class="con-remind-ensure widget-dialog-close j-close-dialog">确认</button></div>'
    ].join('');


    var MOBILE_REG = /^1\d{10}$/,
        tip = require('tip'),
        carselect,
        submitFlag = true;

    remind = {
        show: function(brand, series, model, pid) {

            this.brand = brand ? parseInt(brand) : 0;
            this.series = series ? parseInt(series) : 0;
            this.model = model ? parseInt(model) : 0;
            this.pid = pid ? parseInt(pid) : 0;

            if ($('.widget-saleremind').length > 0) {
                $('.widget-saleremind').show();
                $('.widget-saleremind-mask').show();
                
            } else {
                this.createElements();
                carselect = this.setCarInfo();
                this.bindEvent();
            }

            carselect.initCar(this.brand, this.series, this.model);

            var top = $(window).scrollTop() + ($(window).height() - $('.widget-saleremind').height()) / 2;
            $('.widget-saleremind').css({
                top: top
            });

            $('#saleremind_name').focus();
            $('#JS_activityid').val(this.pid);
        },

        createElements: function() {
            $('body').append($(driveHtml));
        },

        bindEvent: function() {
            var self = this,
                close = $('.widget-saleremind-close'),
                wrap = $('.widget-saleremind'),
                mask = $('.widget-saleremind-mask'),
                brand = $('#saleremind_brand'),
                series = $('#saleremind_series'),
                model = $('#saleremind_model'),
                submit = $('.widget-saleremind-submitbtn'),
                name = $('#saleremind_name'),
                mobile = $('#saleremind_mobile'),
                form = $('#saleremind_form');

            close.on('click', function() {
                wrap.hide();
                mask.hide();
            });

            submit.on('click', function(e) {
                e.preventDefault();

                if (!submitFlag) {
                    submitFlag = false;
                    return;
                }

                if (parseInt(model.val()) === 0) {
                    tip.info('请选择车型');
                    return;
                }

                if (name.val() === '') {
                    tip.info('请填写姓名');
                    return;
                }

                if (!MOBILE_REG.test(mobile.val())) {
                    tip.info('请输入正确的手机号码');
                    return;
                }

                $.ajax({
                    url: API_SUBMIT,
                    data: form.serialize(),
                    type: 'get',
                    dataType: 'jsonp',
                    success: function(res) {
                        if (res.data.code === 0) {
                            mask.hide();
                            wrap.hide();
                            dialog.show(successHtml, {
                                className: 'con-sale-remind',
                                hasCloseBtn: false
                            });
                        } else {
                            tip.info(res.data.message);
                        }
                        submitFlag = true;
                    }
                });
            });
        },
        //jsonp请求
        request: function(url, callback) {

            $.ajax({
                url: url,
                type: 'get',
                dataType: 'jsonp',
                success: callback
            });
        },
        
        setCarInfo: function() {
            var carselect = new Carselect({
                elements: {
                    brand: $('#saleremind_brand'),
                    series: $('#saleremind_series'),
                    model: $('#saleremind_model')
                },
                status: 'onSale'
            });

            return carselect;
        }
    }

    module.exports = remind;
});
