define(function(require, exports, module) {

    require('./saleremind-320c293ebe.css');

    var drive,
        dialog = require('dialog'),
        API_CARBRAND = "http://car.diandong.com/api/listData/brand",
        API_CARSERIES = "http://car.diandong.com/api/listData/series/",
        API_CARTYPE = "http://car.diandong.com/api/listData/model/",
        API_SUBMIT = "http://mall.diandong.com/project/remind/";

    var driveHtml = [
        '<div class="widget-saleremind-mask"></div>',
        '<div class="widget-saleremind">',
        '<header>',
        '<h3>开售提醒</h3>',
        '</header>',
        '<form id="saleremind_form" class="widget-saleremind-form">',
        '<dl class="widget-saleremind-selectcar">',
        '<dt>',
        '<span class="widget-saleremind-required">*</span>',
        '<span>请先选择车型：</span>',
        '</dt>',
        '<dd>',
        '<select id="saleremind_brand" name="brand"><option value=0>选择品牌</option></select>',
        '<select id="saleremind_series" name="cxid"><option value=0>选择车系</option></select>',
        '<select id="saleremind_model" name="pzid"><option value=0>选择车型</option></select>',
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

    var successHtml = ['<button class="con-remind-close widget-dialog-close"></button>',
        '<div class="widget-saleremind-success-center clearfix">',
        '<div class="widget-saleremind-successicon"></div>',
        '<div class="widget-saleremind-successwords">',
        '<p class="widget-saleremind-congratulations">开售提醒成功</p>',
        '<p>电动邦客服人员会在您选中的</p>',
        '<p>车型开售之前短信通知您</p>',
        '</div>',
        '</div>',
        '<div class="con-remind-ensurebox"><button class="con-remind-ensure widget-dialog-close">确认</button></div>'
    ].join('');


    var BRAND_OPTION = '<option value=0>选择品牌</option>',
        SEIRES_OPTION = '<option value=0>选择车系</option>',
        MODEL_OPTION = '<option value=0>选择车型</option>',
        MOBILE_REG = /^1\d{10}$/,
        tip = require('tip'),
        submitFlag = true;

    remind = {
        show: function(brand, series, model) {
            // $('body').css('overflow','hidden');

            this.brand = brand ? parseInt(brand) : 0;
            this.series = series ? parseInt(series) : 0;
            this.model = model ? parseInt(model) : 0;

            if ($('.widget-saleremind').length > 0) {
                $('.widget-saleremind').show();
                $('.widget-saleremind-mask').show();
                this.setCarInfo();
            } else {
                this.createElements();
                this.bindEvent();
                this.getBrands();
            }

            var top = $(window).scrollTop() + ($(window).height() - $('.widget-saleremind').height()) / 2;
            $('.widget-saleremind').css({
                top: top
            });

            $('#saleremind_name').focus();
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
                // $('body').css('overflow','auto');
            });
            brand.on('change', function() {
                var id = this.value;
                $('#saleremind_model').html(MODEL_OPTION);
                self.getSeries(id);
            });
            series.on('change', function(event) {
                var id = this.value;

                self.getType(id);
            });

            submit.on('click', function(e) {
                e.preventDefault();

                if (!submitFlag) {
                    submitFlag = false;
                    return;
                }

                if (parseInt(model.val()) === 0) {
                    tip.error('请选择车型');
                    return;
                }

                if (name.val() === '') {
                    tip.error('请填写姓名');
                    return;
                }

                if (!MOBILE_REG.test(mobile.val())) {
                    tip.error('请输入正确的手机号码');
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
                            tip.error(res.data.message);
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
        //获取品牌数据
        getBrands: function() {

            var self = this,
                brand = $('#saleremind_brand');

            this.request(API_CARBRAND, function(res) {

                if (res.state.err === false) {

                    var data = res.data;
                    var html = self.createBrandsElements(data);

                    brand.html(html);
                    self.setCarInfo();
                }

            });
        },

        //生成品牌元素 return {string}
        createBrandsElements: function(obj) {

            var array = [],
                html = BRAND_OPTION;

            for (var p in obj) {
                var arr = obj[p];

                for (var i = 0; i < arr.length; i++) {

                    var data = arr[i],
                        id = data.ppid,
                        name = data.name,
                        option = '<option value=' + id + '>' + p + '-' + name + '</option>';

                    html += option;
                }
            }

            return html;
        },

        //获取车系数据
        getSeries: function(id, result) {

            var self = this,
                url = API_CARSERIES + id,
                series = $('#saleremind_series');

            this.request(url, function(res) {

                if (res.state.err === false) {
                    var data = res.data;
                    var html = self.createSeriesElements(data);

                    series.html(html);
                    result && result();
                }
            });
        },

        // 生成车系元素 return {string}
        createSeriesElements: function(arr) {
            var html = SEIRES_OPTION;

            for (var i = 0, len = arr.length; i < len; i++) {
                var data = arr[i],
                    id = data.cxid,
                    name = data.name,
                    text = '<option value=' + id + '>' + name + '</option>';
                html += text;
            }
            return html;
        },

        // 获取车型数据
        getType: function(id, result) {
            var self = this,
                url = API_CARTYPE + id,
                type = $('#saleremind_model');

            this.request(url, function(res) {
                if (res.state.err === false) {
                    var data = res.data;
                    var html = self.createTypeElements(data);
                    type.html(html);
                    result && result();
                }
            });
        },

        // 生成车型元素 return {string}
        createTypeElements: function(arr) {
            var html = MODEL_OPTION;

            for (var i = 0, len = arr.length; i < len; i++) {
                var data = arr[i],
                    id = data.pzid,
                    name = data.name,
                    text = '<option value=' + id + '>' + name + '</option>';
                html += text;
            }
            return html;
        },
        setCarInfo: function() {
            var brandEle = $('#saleremind_brand'),
                seriesEle = $('#saleremind_series'),
                modelEle = $('#saleremind_model'),
                self = this;

            brandEle.val(this.brand);
            this.getSeries(this.brand, function() {
                seriesEle.val(self.series);
                self.getType(self.series, function() {
                    modelEle.val(self.model);
                });
            });
        }
    }

    module.exports = remind;
});
