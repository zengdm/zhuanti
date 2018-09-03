define(function (require, exports, module) {
    require('./jxsmap.css');

	var jxsmap, mapObj, markerArr = [],
		API_JXS = 'http://car.diandong.com/api/getJXSByCityCxid/';

	jxsmap = {
		// options.city,options.series,options.emptyHandler,options.price
		init: function (options) {
			this.options = options;
			this.getJXSData();
			this.initMap();
            this.bindEvent();
		},
        bindEvent: function(){
            $('.jxsmap-shop-box').on('click', 'li', function () {
                var index = $(this).index();

                $('.jxsmap-shop-box .on').removeClass('on');
                $(this).addClass('on');

                AMap.event.trigger(markerArr[index], 'click');
            });
        },
		getJXSData: function () {
			var self = this;

			$.ajax({
				url: API_JXS + this.options.city + '/' + this.options.series,
				dataType: 'jsonp',
				success: function (res) {
					if (!res.data) {
						self.options.emptyHandler && self.options.emptyHandler();
						return;
					}
					self.addJXSMap(res.data);
					self.addJXSInfo(res.data);
				}
			});

		},
		initMap: function () {
			mapObj = new AMap.Map("mapbox", {
				view: new AMap.View2D({})
			});
		},
		addJXSInfo: function (data) {
			var i = 0,
				len = data.length,
				carPrice = this.options.price,
				html = '';

			for (; i < len; i++) {
				var li = '',
					obj = data[i];

				li += '<li>';
				li += '<div class="loc-icon"><span>' + (i + 1) + '</span></div>';
				li += '<div class="jxsmap-shop-info">';
				li += '<p class="jxsmap-shop-name">' + obj.jxsm + '</p>';
				li += '<table>';
				li += '<tr>';
				li += '<td class="l-td">报价：</td>';
				li += '<td class="r-td"><span class="price">' + carPrice + '</span></td>';
				li += '</tr>';
				li += '<tr>';
				li += '<td class="l-td">电话：</td>';
				li += '<td class="r-td">' + obj.phone + '</td>';
				li += '</tr>';
				li += '<tr>';
				li += '<td class="l-td">地址：</td>';
				li += '<td class="r-td">' + obj.addr + '</td>';
				li += '</tr>';
				li += '</table>';
				li += '</div>';
				li += '</li>';

				html += li;
			}

			if (len == 0) {
				html = '<li class="no-data">暂无经销商</li>';
			}

			$('.jxsmap-shop-box>ul').html(html);
		},
		addJXSMap: function (data) {
			mapObj.clearMap();

			for (var i = 0, len = data.length; i < len; i++) {
				var mapinfo = data[i],
					level = mapinfo['4s'] == 1 ? '4s店' : '二级经销商',
					marker = new AMap.Marker({
						map: mapObj,
						position: new AMap.LngLat(mapinfo.bmapx, mapinfo.bmapy),
						offset: new AMap.Pixel(20, -31)
					});

				marker.info = mapinfo;
				markerArr.push(marker);

				AMap.event.addListener(marker, 'click', function () {
					var info = [];
					info.push("<div><h3 style=\"font-weight:bold;font-size:18px;color:#2e2e2e;\">" + this.info.jxsm + "</h3>");
					info.push("<p style=\"font-size: 14px;color: #929292;margin: 10px 0 5px 0;\">级别：" + level + "</p>");
					info.push("<p style=\"font-size: 14px;color: #929292;margin: 10px 0 5px 0;\">电话： <em style=\"color: #dd4747;font-weight: bold;\">" + this.info.phone + "</em></p>");
					info.push("<p style=\"font-size: 14px;color: #929292;margin: 10px 0 5px 0;\">地址：" + this.info.addr + "</p></div>");

					infoWindow = new AMap.InfoWindow({
						content: info.join(""),
						offset: new AMap.Pixel(25, -35)
					});

					infoWindow.open(this.getMap(), this.getPosition());
				});
			}

			mapObj.setFitView()
		}
	}

	module.exports = jxsmap;
});