define(function (require, exports, module) {
	require('./selectcity.css');
	var location = require('../location2/location');
	var Selectcity;

	var HTML = [
		'<div class="widget-selectcity">',
		'<div class="widget-selectcity-mask"></div>',
		'<div class="widget-selectcity-box">',
		'<h2>选择城市</h2>',
		'<a class="widget-selectcity-close icon" href="javascript:;">&#xe601;</a>',
		'<div class="widget-selectcity-content">',
		'<dl class="widget-selectcity-hotcities clearfix">',
		'<dt>热门城市</dt>',
		'<dd class="clearfix">',
		'<a href="javascript:;" data-city="1101">北京</a>',
		'<a href="javascript:;" data-city="1201">天津</a>',
		'<a href="javascript:;" data-city="3101">上海</a>',
		'<a href="javascript:;" data-city="4401">广州</a>',
		'<a href="javascript:;" data-city="4403">深圳</a>',
		'<a href="javascript:;" data-city="3301">杭州</a>',
		'</dd>',
		'</dl>',
		'<div class="widget-selectcity-listbox clearfix">',
		'<div class="widget-selectcity-list">',
		'</div>',
		'</div>',
		'</div>',
		'</div>',
		'</div>'
	].join('');

	Selectcity = function () {
		this.$wrap = $('<div></div>');
		this.handler = function () {};
		this.init();
	};

	Selectcity.prototype = {
		init: function () {
			this.create();
			this.bindEvent();
		},
		bindEvent: function () {
			var _this = this;
			$('.widget-selectcity-hotcities', this.$wrap).on('click', 'a', function () {
				var city = $(this).data('city');
				var cityName = $(this).text();
				_this.hide()
				_this.handler(city, cityName);
			});

			$('.widget-selectcity-list', this.$wrap).on('click', 'a', function () {
				var city = $(this).data('city');
				var cityName = $(this).text();
				_this.hide()
				_this.handler(city, cityName);
			});

			$('.widget-selectcity-close', this.$wrap).on('click', function () {
				_this.hide();
			});
		},
		show: function () {
			this.$wrap.show();
			this.setWrapTop();
		},
		hide: function () {
			this.$wrap.hide();
		},
		setWrapTop: function () {
			var height = $(window).height(),
				wrapHeight = $('.widget-selectcity-box', this.$wrap).height(),
				top = (height - wrapHeight) / 2;
			
			if(top < 0){
				top = 0;
			}
			
			$('.widget-selectcity-box', this.$wrap).css({
				top: top
			});
		},
		selected: function (handler) {
			this.handler = handler;
		},
		create: function () {
			$('body').append(this.$wrap);
			this.hide();
			this.$wrap.html(HTML);
			this.render();
		},
		render: function () {
			var $list = $('.widget-selectcity-list', this.$wrap),
				html = '';
			
			for (var p in location) {
				var arr = location[p];
				html += '<div class="widget-selectcity-item">';
				html += '<i>' + p + '</i>';
				html += '<div class="widget-selectcity-itemright clearfix">';
				for (var i = 0, len = arr.length; i < len; i++) {
					var obj = arr[i],
						cities = obj.cities;
					html += '<dl><dt>' + obj.name + ':</dt><dd>';
					for (var c in cities) {
						html += '<a href="javascript:;" data-city="' + c + '">' + cities[c] + '</a>';
					}
					html += '</dd></dl>'
				}
				html += '</div></div>';
			}

			$list.html(html);
		}
	}

	module.exports = Selectcity;

});