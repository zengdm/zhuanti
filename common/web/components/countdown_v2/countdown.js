/**
 * @desc 通用倒计时组件v2 (大于一天只显示天，小于一天只显示时分秒)
 * @author sunyg <1169771179@qq.com>
 * @date 2016/03/16
 * @param options{ now: @number(倒计时开始时间,10位或13位时间戳), end: @number(倒计时结束时间,10位或13位时间戳),
 * @param parent: @obj(jq)(父元素), complete: @function(倒计时结束回调) }
 */
define(function (require, exports, module) {

	var Countdown = function (options) {
		// 默认参数
		var defaults = {
			// 开始时间
			now: new Date().getTime(),
			// 结束时间
			end: new Date().getTime(),
			// 是否开启毫秒计时
			millSecond: false,
			// 回调
			complete: null
		};

		this.defaults = $.extend(true, defaults, options);
		// 将13位时间戳(毫秒)转化为10位(秒)
		if (this.defaults.now.toString().length == 13) {
			this.defaults.now = this.defaults.now / 1000;
		}

		if (this.defaults.end.toString().length == 13) {
			this.defaults.end = this.defaults.end / 1000;
		}
		// this.mseconds: 计时器时间间隔
		if (this.defaults.millSecond) {
			this.time = this.defaults.end * 10 - this.defaults.now * 10;
			this.mseconds = 100;
		} else {
			this.time = this.defaults.end - this.defaults.now;
			this.mseconds = 1000;
		}

		// 时间差<=0,倒计时结束
		if (this.time <= 0) {
            this.render(0,0,0,0);
			this.complete && this.complete();
			return;
		}

		this.init();
	}

	Countdown.prototype = {

		init: function () {
			this.beginCountDown();
		},

		countTime: function () {
			var days, hours, minutes, seconds;

			if (this.defaults.millSecond) {
				days = parseInt(this.time / 3600 / 10 / 24);
				hours = parseInt((this.time / 3600 / 10) % 24);
				minutes = parseInt((this.time / 60 / 10) % 60);
				seconds = parseFloat(this.time / 10 % 60 + '.' + this.time % 10).toFixed(1);
			} else {
				days = parseInt(this.time / 3600 / 24);
				hours = parseInt((this.time / 3600) % 24);
				minutes = parseInt((this.time / 60) % 60);
				seconds = parseInt(this.time % 60);
			}

            this.render(days, hours, minutes, seconds);

			if (this.time <= 0) {
				clearInterval(this.autoC);
				this.complete && this.complete();
			}

			this.time -= 1;
		},

		render: function (days, hours, minutes, seconds) {

			if (this.time > 3600 * 24) {
				this.defaults.parent.html('<i>' + days + '</i>天');
			} else {
				this.defaults.parent.html('<i>' + hours + '</i>时<i>' + minutes + '</i>分<i>' + seconds + '</i>秒');
			}
		},

		beginCountDown: function () {
			this.countTime();

			this.autoC = setInterval(this.bind(this, this.countTime), this.mseconds);
		},

		format: function (num) {
			return num < 10 ? '0' + num : num;
		},

		bind: function (obj, handler) {
			return function () {
				return handler.apply(obj, arguments);
			}
		}
	}

	module.exports = Countdown;
});