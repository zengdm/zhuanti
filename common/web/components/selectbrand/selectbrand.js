define(function (require, exports, module) {
	require('./selectbrand.css');

	var Selectbrand;

	var HTML = [
		'<div class="widget-selectbrand">',
        '<div class="widget-selectbrand-mask"></div>',
		'<div class="widget-selectbrand-box">',
		'<h2>选择品牌</h2>',
		'<a class="widget-selectbrand-close icon" href="javascript:;">&#xe601;</a>',
		'<div class="widget-selectbrand-content">',
		'<h3>热门品牌</h3>',
		'<div class="widget-selectbrand-hotbrand"></div>',
		'<h3>全部品牌</h3>',
		'<div class="widget-selectbrand-list clearfix">',
		'<div class="widget-selectbrand-itemlist fn-left"></div>',
		'<div class="widget-selectbrand-itemlist fn-right"></div>',
		'</div>',
		'</div>',
		'</div>',
		'</div>'
	].join('');
    
    Selectbrand = function(){
        this.$wrap = $('<div></div>');
        this.handler = function(){};
        this.init();
    };

	Selectbrand.prototype = {
        init: function(){
            this.create();
            this.bindEvent();
        },
		bindEvent: function () {
            var _this = this;
            $('.widget-selectbrand-hotbrand', this.$wrap).on('click', 'a', function(){
                var brand = $(this).data('brand');
                var brandName = $(this).data('brandname');
                _this.hide()
                _this.handler(brand, brandName);
            });

            $('.widget-selectbrand-list', this.$wrap).on('click', 'a', function(){
                var brand = $(this).data('brand');
                var brandName = $(this).text();
                _this.hide()
                _this.handler(brand, brandName);
            });

            $('.widget-selectbrand-close', this.$wrap).on('click', function(){
                _this.hide();
            });
		},
        show: function(){
            this.$wrap.show();
            this.setWrapTop();
        },
        hide: function(){
            this.$wrap.hide();
        },
        setWrapTop: function(){
            var height = $(window).height(),
                wrapHeight = $('.widget-selectbrand-box', this.$wrap).height(),
                top = (height-wrapHeight)/2;

            if(top < 0){
                top = 0;
            }
            
            $('.widget-selectbrand-box', this.$wrap).css({
                top: top
            });
        },
        selected: function(handler){
            this.handler = handler;
        },
		create: function () {
			$('body').append(this.$wrap);
            this.hide();
			this.$wrap.html(HTML);
			this.render();
		},
		render: function () {
			this.getHotBrand();
			this.getBrand();
		},
		getHotBrand: function () {
			var _this = this;

			$.ajax({
				url: 'http://car.diandong.com/api/get_recommend_pinpai',
				dataType: 'jsonp',
				success: function (res) {
					_this.renderHotBrand(res.data);
				}
			});
		},
		renderHotBrand: function (data) {
			var html = '';
			for (var i = 0, len = data.length; i < len; i++) {
				var obj = data[i],
					a = '<a href="javascript:;" data-brand="' + obj.ppid + '" data-brandname="' + obj.name + '"><img src="' + obj.logo + '@36w.src" title="' + obj.name + '" alt="' + obj.name + '" /></a>';

				html += a;
			}

			$('.widget-selectbrand-hotbrand', this.$wrap).html(html);
		},
		getBrand: function () {
			var _this = this;

			$.ajax({
				url: 'http://car.diandong.com/api/listData/brand/',
				dataType: 'jsonp',
				success: function (res) {
					_this.renderBrand(res.data);
				}
			});
		},
		renderBrand: function (data) {
			var $list = $('.widget-selectbrand-itemlist', this.$wrap),
				html1 = '',
				html2 = '';
			
			for (var p in data) {
				var arr = data[p], dl = '';

				dl += '<dl>';
				dl += '<dt>' + p + '</dt>';
				dl += '<dd>';
				for (var i = 0, len = arr.length; i < len; i++) {
					var obj = arr[i];
					dl += '<a href="javascript:;" data-brand="' + obj.ppid + '">' + obj.name + '</a>';
				}
				dl += '</dd>';
				dl += '</dl>';
				
				if (p <= 'K') {
					html1 += dl;
				} else {
					html2 += dl;
				}
			}
			$list.eq(0).html(html1);
			$list.eq(1).html(html2);
		}
	}

	module.exports = Selectbrand;

});