define(function (require, exports, module) {
	require('./selectseries.css');

	var Selectseries;

	var HTML = [
		'<div class="widget-selectseries">',
		'<div class="widget-selectseries-mask"></div>',
		'<div class="widget-selectseries-box">',
		'<h2>选择车系</h2>',
		'<a class="widget-selectseries-close icon" href="javascript:;">&#xe601;</a>',
		'<div class="widget-selectseries-content">',
		'<h3 class="widget-selectseries-brandname">比亚迪</h3>',
		'<ul class="widget-selectseries-list clearfix"></ul>',
		'</div>',
		'</div>',
		'</div>'
	].join('');

	Selectseries = function () {
        this.brandId = 0;
        this.brandName = '';
		this.$wrap = $('<div></div>');
		this.handler = function () {};
		this.init();
	};

	Selectseries.prototype = {
		init: function () {
			this.create();
			this.bindEvent();
		},
		bindEvent: function () {
			var _this = this;

			$('.widget-selectseries-close', this.$wrap).on('click', function () {
				_this.hide();
			});

            $('.widget-selectseries-list', this.$wrap).on('click', 'li', function(){
                var seriesId = $(this).data('cxid');
                var seriesName = $(this).find('p').text();
                _this.hide();
                _this.handler(seriesId, seriesName);
            });
		},
		show: function (brandId, brandName) {
            if(brandId != this.brandId){
               $('.widget-selectseries-list').html(''); 
            }

			this.brandId = brandId;
			this.brandName = brandName;
            
			this.$wrap.show();
			this.render();
		},
		hide: function () {
			this.$wrap.hide();
		},
		setWrapTop: function () {
			var height = $(window).height(),
				wrapHeight = $('.widget-selectseries-box', this.$wrap).height(),
				top = (height - wrapHeight) / 2;

			if(top < 0){
				top = 0;
			}

			$('.widget-selectseries-box', this.$wrap).css({
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
		},
		render: function () {
            $('.widget-selectseries-brandname', this.$wrap).html(this.brandName);
			this.getSeries();
		},
		getSeries: function () {
			var _this = this;

			$.ajax({
				url: 'http://car.diandong.com/api/listData/series/' + this.brandId,
				dataType: 'jsonp',
				success: function (res) {
					_this.renderSeries(res.data);
                    _this.setWrapTop();
				}
			});
		},
		renderSeries: function (data) {
			var html = '';
			for (var i = 0, len = data.length; i < len; i++) {
				var obj = data[i];
				html += '<li data-cxid="'+obj.cxid+'"><div><img src="' + obj.focus_url + '" alt="" /></div><p>' + obj.name + '</p></li>';
			}

			$('.widget-selectseries-list').html(html);
		}
	}

	module.exports = Selectseries;

});