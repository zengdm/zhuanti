define(function (require, exports, module) {
	var lazyload, elements, constants, timer, imgArr = [];
	elements = {
		img: $('.img-lazyload')
	};
	constants = {
		CLASSNAME: 'img-lazyload'
	};
	lazyload = {
		// options.asyn : false, 是否异步加载图片
		init: function (options) {
			this.options = $.extend({
				asyn: false
			}, options);

			this.initLazyImg();
			this.loadImage();
			this.bindEvent();
		},
		bindEvent: function () {
			$(window).on('scroll.lazyload', this.bind(this, this.loadImage));
			$(window).on('resize.lazyload', this.bind(this, this.loadImage))
		},

		initLazyImg: function () {
			var $eles = $('.img-lazyload');

			$eles.each(function (index, el) {
				var imgTop = $(this).offset().top,
					imgHeight = $(this).height(),
					src = $(this).data('src'),
					img = this;

				imgArr.push({
					top: imgTop,
					height: imgHeight,
					src: src,
					img: img
				});
			});
		},
		loadImage: function () {
			var self = this;
			timer && clearTimeout(timer);
			timer = setTimeout(function () {
				var $win = $(window),
					top = $(window).scrollTop(),
					height = $win.height(),
					src, arr = [],
					imgArrTmp = imgArr;

				if (imgArr.length > 0) {
					for (var i = 0, len = imgArr.length; i < len; i++) {
						var imgObj = imgArr[i],
							imgTop = imgObj.top,
							imgHeight = imgObj.height,
							top = $win.scrollTop();

						if (imgTop < top + height && imgTop + imgHeight > top) {
							arr.push(i);
							src = imgObj.src;
							$(imgObj.img).attr('src', src).removeClass(constants.CLASSNAME);
							$(imgObj.img).removeAttr('data-src');
						}
					}

					imgArr = self.removeArrayEles(imgArr, arr);

				} else {
					if (!self.options.asyn) {
						$(window).off('.lazyload');
					}
				}
			}, 120);
		},
		removeArrayEles: function (arr, deleteArr) {
			deleteArr = deleteArr.sort(function (a, b) {
				return b - a;
			});

			for (var i = 0, len = deleteArr.length; i < len; i++) {
				arr.splice(deleteArr[i], 1);
			}

			return arr;
		},
		bind: function (obj, handler) {
			return function () {
				return handler.apply(obj, arguments);
			}
		}
	}
	module.exports = lazyload;
});