/**
 * @desc PC端预订组件
 * @author sunyg <1169771179@qq.com>
 * @date 2015/09/29
 * @param init(parent), 初始化页面非弹出层预订，parent 最外层jq对象
 * @param show(brand<品牌id>, series<车系id>, model<车型id>), 预约预订弹出层
 */
define(function (require, exports, module) {

    require('./signup.css');

    var signup, selectors, constants,
        wrapper = $('<div id="widget_signup_wrapper"></div>'),
        submitFlag = true,
        tip = require('tip'),
        area = require('area'),
        Carselect = require('carselect'),
        dialog = require('dialog');

    constants = {
        MOBILE_REG: /^1\d{10}$/,
        API_SUBMIT: "http://mall.diandong.com/project/outRuleOrder/"
    };

    selectors = {
        wrapper: '#widget_signup_wrapper',
        activityId: '.JS_signup_activityId',
        orderbox: '.JS_signup_box',
        mask: '.JS_signup_mask',
        form: '.JS_signup_form',
        brand: '.JS_signup_brand',
        series: '.JS_signup_series',
        model: '.JS_signup_model',
        name: '.JS_signup_name',
        mobile: '.JS_signup_mobile',
        submitbtn: '.JS_signup_submitbtn',
        close: '.JS_signup_close',
        reapply: '.widget-signup-reapply',
        errorbox: '.con-sale-remind'
    };
    
    var driveHtml = [
        '<div class="widget-signup-mask JS_signup_mask"></div>',
        '<div class="widget-signup JS_signup_box">',
        '<header>',
        '<h3>报名</h3>',
        '</header>',
        '<form class="widget-signup-form JS_signup_form">',
        '<input class="JS_signup_activityId" type="hidden" name="pid" value=0>',
        '<dl class="widget-signup-selectcar">',
        '<dt>',
        '<span class="widget-signup-required">*</span>',
        '<span>请先选择车型：</span>',
        '</dt>',
        '<dd>',
        '<select class="JS_signup_brand" name="brand"><option value=0>选择品牌</option></select>',
        '<select class="JS_signup_series" name="cxid"><option value=0>选择车系</option></select>',
        '<select class="JS_signup_model" name="pzid"><option value=0>选择车型</option></select>',
        '</dd>',
        '</dl>',
        '<table class="widget-signup-table">',
        '<tbody>',
        '<tr>',
        '<td class="widget-signup-ltd">',
        '<span class="widget-signup-required">*</span>',
        '<label>姓名：</label>',
        '</td>',
        '<td class="widget-signup-rtd">',
        '<input class="widget-signup-text JS_signup_name" type="text" name="name" maxlength=30>',
        '</td>',
        '</tr>',
        '<tr>',
        '<td class="widget-signup-ltd">',
        '<span class="widget-signup-required">*</span>',
        '<label>手机：</label>',
        '</td>',
        '<td class="widget-signup-rtd ">',
        '<input class="widget-signup-text JS_signup_mobile" type="text" name="mobile" maxlength=11>',
        '</td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '<div class="widget-signup-submit">',
        '<button class="widget-signup-submitbtn JS_signup_submitbtn">提交</button>',
        '</div>',
        '</form>',
        '<button class="widget-signup-close JS_signup_close"></button>',
        '</div>'
    ].join('');

    var successHtml = ['<button class="con-remind-close j-close-dialog"></button>',
        '<div class="widget-signup-success-center clearfix">',
        '<div class="widget-signup-successicon"></div>',
        '<div class="widget-signup-successwords">',
        '<p class="widget-signup-congratulations">恭喜您！报名成功</p>',
        '<p>电动邦客服人员会尽快与您取得联系，</p>',
        '<p>您也可以致电咨询：<span>4000-990-666</span></p>',
        '</div>',
        '</div>',
        '<div class="con-remind-ensurebox"><button class="con-remind-ensure j-close-dialog">确认</button></div>'
    ].join('');

    var errorHtml = ['<button class="con-remind-close j-close-dialog"></button>',
        '<div class="widget-signup-error-center clearfix">',
        '<div class="widget-signup-erroricon"></div>',
        '<div class="widget-signup-errorwords">',
        '<p class="widget-signup-fail">抱歉！提交失败</p>',
        '<p>详情可致电：<span>4000-990-666</span></p>',
        '</div>',
        '</div>',
        '<div class="con-remind-ensurebox"><button class="con-remind-ensure widget-signup-reapply">重新申请</button></div>'
    ].join('');

    signup = {
        init: function (parent) {
            var carselect;

            carselect = this.createCarselect(parent);
            carselect.initCar(0, 0, 0);
            this.bindEvent(parent);
        },
        show: function (brand, series, model, pid) {
            this.brand = brand ? parseInt(brand) : 0;
            this.series = series ? parseInt(series) : 0;
            this.model = model ? parseInt(model) : 0;
            this.pid = pid ? parseInt(pid) : 0;

            if ($(selectors.wrapper).length > 0) {
                wrapper.show();
            } else {
                this.createElements();
                this.carselect = this.createCarselect(wrapper);
                this.bindEvent(wrapper);
            }

            this.carselect.initCar(this.brand, this.series, this.model);
            this.setWrapperLocation();
            this.focusNameInput();
            this.setActivityId();
        },

        bindEvent: function (parent, picker) {
            var self = this,
                s = selectors;

            $(s.close, parent).on('click', function () {
                parent.hide();
            });

            $(s.submitbtn, parent).on('click', function (e) {
                e.preventDefault();

                self.submitInfo(parent);
            });

            $(document.body).on('click', s.reapply, function () {
                self.reApplySignup.call(this, parent);
            });

        },
        //jsonp请求
        request: function (url, callback) {
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'jsonp',
                success: callback
            });
        },
        setActivityId: function(){
            $(selectors.activityId, wrapper).val(this.pid);
        },
        // 弹出预订框时，姓名输入框自动获取焦点
        focusNameInput: function(){
            $(selectors.name, wrapper).focus();
        },
        // 设置预订弹出框的位置
        setWrapperLocation: function(){
            var top = $(window).scrollTop() + ($(window).height() - $(selectors.orderbox, wrapper).height()) / 2;

            $(selectors.orderbox, wrapper).css({
                top: top
            });
        },
        // 提交预订信息
        submitInfo: function(parent){
            var s = selectors;

            if (!submitFlag) {
                submitFlag = false;
                return;
            }

            if ($(s.model, parent).val() == 0) {
                tip.info('请选择车型');
                return;
            }

            if ($(s.name, parent).val() == '') {
                tip.info('请填写姓名');
                return;
            }
            
            if (!constants.MOBILE_REG.test($(s.mobile, parent).val())) {
                tip.info('请输入正确的手机号码');
                return;
            }

            $.ajax({
                url: constants.API_SUBMIT,
                dataType: 'jsonp',
                data: $(s.form, parent).serialize(),
                success: function (res) {
                    if (parent == wrapper) {
                        parent.hide();
                    }
                    if (res.state.err === false) {
                        dialog.show(successHtml, {
                            className: 'con-sale-remind',
                            hasCloseBtn: false
                        });
                    } else {
                        dialog.show(errorHtml, {
                            className: 'con-sale-remind',
                            hasCloseBtn: false
                        });
                    }
                    submitFlag = true;
                }
            });
        },
        // 创建预约预订弹层
        createElements: function () {
            $(document.body).append(wrapper);
            wrapper.html($(driveHtml));
        },
        // 重新预约预订
        reApplySignup: function(parent){
            $(this).parents(selectors.errorbox).find(selectors.close).trigger('click');
            if (parent == wrapper) {
                parent.show();
            }
        },

        // 创建carselect
        createCarselect: function (parent) {
            var carselect = new Carselect({
                elements: {
                    brand: $(selectors.brand, parent),
                    series: $(selectors.series, parent),
                    model: $(selectors.model, parent)
                },
                status: 'onSale'
            });

            return carselect;

        }
    }

    module.exports = signup;
});