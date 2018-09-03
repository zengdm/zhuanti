/**
 * @desc PC端预订组件
 * @author sunyg <1169771179@qq.com>
 * @date 2015/09/29
 * @param init(parent), 初始化页面非弹出层预订，parent 最外层jq对象
 * @param show(brand<品牌id>, series<车系id>, model<车型id>), 预约预订弹出层
 */
define(function (require, exports, module) {

	require('./preorder.css');

	var preorder, selectors, constants,
		wrapper = $('<div id="widget_preorder_wrapper"></div>'),
		submitFlag = true,
		tip = require('tip'),
		area = require('area'),
		dialog = require('dialog');

	constants = {
		MOBILE_REG: /^1\d{10}$/,
		API_SUBMIT: "http://mall.diandong.com/project/outRuleOrder/"
	};

	selectors = {
		wrapper: '#widget_preorder_wrapper',
		activityId: '.JS_preorder_activityId',
		colors: '.JS_preorder_cid',
		model: '.JS_preorder_model',
		orderbox: '.JS_preorder_box',
		imgUrl: '.JS_preorder_carpic',
		carName: '.JS_preorder_carname',
		colorBox: '.JS_preorder_colorbox',
		colorName: '.JS_preorder_colorname',
		mask: '.JS_preorder_mask',
		form: '.JS_preorder_form',
		name: '.JS_preorder_name',
		mobile: '.JS_preorder_mobile',
		submitbtn: '.JS_preorder_submitbtn',
		close: '.JS_preorder_close',
		reapply: '.widget-preorder-reapply',
		errorbox: '.con-sale-remind'
	};

	var preorderHtml = [
		'<div class="widget-preorder-mask JS_preorder_mask"></div>',
		'<div class="widget-preorder JS_preorder_box">',
		'<header>',
		'<h3>获取底价</h3>',
		'</header>',
		'<form class="widget-preorder-form JS_preorder_form">',
		'<input class="JS_preorder_activityId" type="hidden" name="pid" value=0>',
		'<input class="JS_preorder_cid" type="hidden" name="cid" value=0>',
		'<input class="JS_preorder_model" type="hidden" name="pzid" value=0>',
		'<div class="widget-preorder-carinfo clearfix">',
		'<div class="widget-preorder-carpic fn-left">',
		'<img src="http://assets.diandong.com/web/images/app/mall/public/comp_showadd.png" class="JS_preorder_carpic">',
		'</div>',
		'<div class="widget-preorder-right fn-left">',
		'<h2 class="JS_preorder_carname"></h2>',
		'<div class="widget-preorder-color">',
		'外观颜色 <span class="widget-preorder-colorbox JS_preorder_colorbox"></span>',
		'<span class="JS_preorder_colorname"></span></div>',
		'</div>',
		'</div>',
		'<table class="widget-preorder-table">',
		'<tbody>',
		'<tr>',
		'<td class="widget-preorder-ltd">',
		'<span class="widget-preorder-required">*</span>',
		'<label>姓名：</label>',
		'</td>',
		'<td class="widget-preorder-rtd">',
		'<input class="widget-preorder-text JS_preorder_name" type="text" name="name" maxlength=30>',
		'</td>',
		'</tr>',
		'<tr>',
		'<td class="widget-preorder-ltd">',
		'<span class="widget-preorder-required">*</span>',
		'<label>手机：</label>',
		'</td>',
		'<td class="widget-preorder-rtd ">',
		'<input class="widget-preorder-text JS_preorder_mobile" type="text" name="mobile" maxlength=11>',
		'</td>',
		'</tr>',
		'</tbody>',
		'</table>',
        '<p class="widget-preorder-tips">输入真实手机，提交立即获取优惠信息</p>',
		'<div class="widget-preorder-submit">',
		'<button class="widget-preorder-submitbtn JS_preorder_submitbtn">提交</button>',
		'</div>',
		'</form>',
		'<button class="widget-preorder-close JS_preorder_close"></button>',
		'</div>'
	].join('');

	var successHtml = ['<button class="con-remind-close j-close-dialog"></button>',
		'<div class="widget-preorder-success-center clearfix">',
		'<div class="widget-preorder-successicon"></div>',
		'<div class="widget-preorder-successwords">',
		'<p class="widget-preorder-congratulations">提交成功！</p>',
		'<p>电动邦购车顾问会稍后与您电话联系，请耐心等待~</p>',
		'<p>您也可以致电咨询：<span>4000-990-666</span></p>',
		'</div>',
		'</div>',
		'<div class="con-remind-ensurebox"><button class="con-remind-ensure j-close-dialog">确认</button></div>'
	].join('');

	var errorHtml = ['<button class="con-remind-close j-close-dialog"></button>',
		'<div class="widget-preorder-error-center clearfix">',
		'<div class="widget-preorder-erroricon"></div>',
		'<div class="widget-preorder-errorwords">',
		'<p class="widget-preorder-fail">抱歉！提交失败</p>',
		'<p>详情可致电：<span>4000-990-666</span></p>',
		'</div>',
		'</div>',
		'<div class="con-remind-ensurebox"><button class="con-remind-ensure widget-preorder-reapply">重新申请</button></div>'
	].join('');

	preorder = {
		// options:{model:12, cid: 12, imgUrl:'', carName:'', colors:'', colorName:'',pid:''}
		show: function (options) {
			var defaults = {
				pid: 0,
				cid: 0,
				colors: 'fff',
				colorName: '未知'
			};

			this.options = $.extend(defaults, options);

			if ($(selectors.wrapper).length > 0) {
				wrapper.show();
			} else {
				this.createElements();
				this.bindEvent(wrapper);
			}

			this.setWrapperLocation();
			this.focusNameInput();
			this.setHiddenInput();
			this.setColors();
			this.setCarInfo();
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
				self.reApplypreorder.call(this, parent);
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
		setHiddenInput: function () {
			$(selectors.activityId, wrapper).val(this.options.pid);
			$(selectors.model, wrapper).val(this.options.model);
			$(selectors.colors, wrapper).val(this.options.cid);
		},
		// 弹出预订框时，姓名输入框自动获取焦点
		focusNameInput: function () {
			$(selectors.name, wrapper).focus();
		},
		// 设置预订弹出框的位置
		setWrapperLocation: function () {
			var top = $(window).scrollTop() + ($(window).height() - $(selectors.orderbox, wrapper).height()) / 2;

			$(selectors.orderbox, wrapper).css({
				top: top
			});
		},
		// 提交预订信息
		submitInfo: function (parent) {
			var s = selectors;

			if (!submitFlag) {
				submitFlag = false;
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
			wrapper.html($(preorderHtml));
		},
		// 重新预约预订
		reApplypreorder: function (parent) {
			$(this).parents(selectors.errorbox).find(selectors.close).trigger('click');
			if (parent == wrapper) {
				parent.show();
			}
		},
		setCarInfo: function () {
			$(selectors.imgUrl, wrapper).attr('src', this.options.imgUrl);
			$(selectors.carName, wrapper).html(this.options.carName);
			$(selectors.colorName, wrapper).html(this.options.colorName);
		},
		setColors: function () {
			var colorsArr = this.options.colors.toString().split(','),
				len = colorsArr.length,
				html = '<div class="widget-preorder-colorbox-' + len + '">';

			if(this.options.cid === 0){
				$(selectors.colorBox).hide().
				return;
			}

			for (var i = 0; i < len; i++) {
				html += '<i style="background-color:#' + colorsArr[i] + '"></i>';
			}

			html += '</div>';

			$(selectors.colorBox, wrapper).html(html);
		}
	}

	module.exports = preorder;
});