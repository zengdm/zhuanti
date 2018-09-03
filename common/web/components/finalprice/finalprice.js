define(function (require, exports, module) {
	var finalprice,
		area = require('area'),
		API_FINALPRICE = 'http://car.diandong.com/api/get_butie_by_city_pzidarr/',
		selector = '.J_finalprice';

	finalprice = {
		init: function () {
			var idArr = [],
				ids, self = this;

			$(selector).each(function (index, el) {
				var id = $(this).data('id');
				idArr.push(id);
			});

			ids = idArr.join(',');

			if(idArr.length == 0){
				return;
			}

			area.init(function () {
				self.getData(area.id, ids);
			});
		},
		getData: function (city, ids) {
			var self = this;

			$.ajax({
				url: API_FINALPRICE,
				dataType: 'jsonp',
				data: {
					city: city,
					ids: ids
				},
				success: function (res) {
					var data = res.data;

					self.render(data);
				}
			});
		},
		render: function (data) {
			$(selector).each(function () {
				var id = $(this).data('id'),
					price = parseFloat($(this).data('guide-price')),
					subsidy = parseFloat(data[id]);

				price = (price - subsidy).toFixed(2);

				$(this).html(price);

			});
		}

	};

	module.exports = finalprice;
});