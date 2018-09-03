define(function (require, exports, module) {

	require('./searchindex.css');

	var SearchIndex, selectors, constants;

	constants = {
		INDEX_DEFAULT: -1,
		CURRENT_CLASS: 'on',
		SEARCH_URL: 'http://search.diandong.com/',
		SEARCH_LIST_API: 'http://search.diandong.com/api/search/'
	}

	selectors = {
		box: '.search-input-box',
		menuList: '.search-filter-list',
		searchList: '.search-input-list',
		input: '.JS_search_input',
		button: '.JS_search_btn',
		words: '.search-input-list-left'
	}

	SearchIndex = function (parent, param, cat) {
		this.cat = cat;
		this.parent = parent;
		this.param = param;
		this.prevWord = '';
		this.index = constants.INDEX_DEFAULT;
		this.length = 0;
		this.wrapper = $('<ul class="search-input-list"></ul>');

		this.init();
	}

	SearchIndex.prototype = {

		init: function () {

			this.bindEvent();
		},
		bindEvent: function () {
			var parent = this.parent,
				self = this;

			$('html').on('click', ':not(' + selectors.input + ',' + selectors.searchList + ')', function () {
				self.hideSearchIndex();
			});

			$(selectors.button, parent).on('click', function () {
				self.goToSearch();
			});

			parent.on('click', selectors.input, function (e) {
				var value = this.value;

				index = constants.INDEX_DEFAULT;

				if (value && value == self.prevWord) {
					$(selectors.searchList, parent).show();
				} else {
					self.getSearchData(value);
				}

				return false;
			});

			parent.on('click', selectors.searchList + '>li', function () {
				var value = $(this).find(selectors.words).text().replace(/>/g, '');
				$(selectors.input, parent).val(value);

				self.goToSearch();
			});

			parent.on('mouseenter', selectors.searchList + '>li', function () {
				var index = $(this).index();
				self.index = index;
				$(selectors.searchList, parent).find('li').eq(index).addClass('hover');
			}).on('mouseleave', selectors.searchList + '>li', function () {
				self.index = constants.INDEX_DEFAULT;
				$(selectors.searchList, parent).find('.hover').removeClass('hover');
			});

			$(selectors.input, parent).on('keyup', function (e) {
				var value = this.value,
					code = e.keyCode;

				if (code == 38 || code == 40) {
					return;
				}

				if (code == 13) {
					self.goToSearch();
					return;
				}

				if (value == self.prevWord) {
					return;
				}

				self.prevWord = value;

				self.getSearchData(value);
			});

			$(selectors.input, parent).on('keydown', function (e) {
				var code = e.keyCode,
					list = $(selectors.searchList, parent),
					value = '';

				if (self.length == 0) {
					return;
				}

				if (code == 38) {
					self.prevIndex();
				} else if (code == 40) {
					self.nextIndex();
				} else {
					return;
				}

				value = list.find('li').eq(self.index).find(selectors.words).text().replace(/>/g, '');

				self.heightLightCurrentItem();
				self.setInputValue(value);
			});
		},
		// 跳转查询链接
		goToSearch: function () {
			var index = this.index,
				href = constants.SEARCH_URL + this.param + '/',
				list = $(selectors.searchList, this.parent),
				words = $.trim($(selectors.input, this.parent).val()),
				placeholder = $.trim($(selectors.input, this.parent).attr('placeholder')),
				li = list.find('li').eq(index),
				url = li.data('url');

			if (index >= 0) {
				if ($(selectors.searchList, this.parent).css('display') != 'none') {
					if (url) {
						window.open(url, "_blank");
						return;
					}
				}
			}

			list.hide();

			if (words) {
				href = constants.SEARCH_URL + this.param + '/' + '?words=' + words;
			}else{
				if(placeholder){
					href = constants.SEARCH_URL + this.param + '/' + '?words=' + placeholder;
				}
			}

			if (location.href.indexOf(constants.SEARCH_URL) >= 0) {
				location.href = href;
			}else{
				window.open(href, '_blank');
			}

			
		},
		nextIndex: function () {
			this.index++;

			if (this.index >= this.length) {
				this.index = 0;
			}
		},
		prevIndex: function () {
			this.index--;

			if (this.index < 0) {
				this.index = this.length - 1;
			}
		},
		heightLightCurrentItem: function () {
			var list = $(selectors.searchList, this.parent);

			list.find('.hover').removeClass('hover');
			list.find('li').eq(this.index).addClass('hover');
		},
		// 设置输入框的值
		setInputValue: function (value) {
			$(selectors.input, this.parent).val(value);
		},
		// 隐藏搜索索引
		hideSearchIndex: function () {
			$(selectors.searchList).hide();
		},
		// 获取搜索索引数据
		getSearchData: function (value) {
			var self = this;

			if (value == '') {
				$(selectors.searchList).hide();
				return;
			}

			$.ajax({
				url: constants.SEARCH_LIST_API,
				dataType: 'jsonp',
				data: {
					words: value,
					cat: this.cat
				},
				success: function (res) {
					var data = res.data,
						html = self.createSearchList(data, value);

					self.length = data.length;
					self.showList(html);
				}
			});
		},
		// 显示搜索索引列表
		showList: function (html) {
			this.index = constants.INDEX_DEFAULT;

			if ($(selectors.searchList, this.parent).length == 0) {
				this.parent.append(this.wrapper);
			}

			$(selectors.searchList, this.parent).show().html(html);
		},
		// 创建搜索索引列表
		createSearchList: function (data, value) {
			var html = '';

			for (var i = 0, len = data.length; i < len; i++) {
				var obj = data[i],
					url = obj.url,
					name = obj.name,
					count = obj.count,
					words = this.getHightLightWrods(value, name),
					li = '',
					dataUrl, num;

				if (url) {
					dataUrl = ' data-url=' + url;
					strGt = '&gt;&gt;';
					num = '';
				} else {
					dataUrl = '';
					strGt = '';
					num = '<span class="fn-right">约' + count + '条数据</span>';
				}

				li += '<li' + dataUrl + '>';
				li += '<span class="search-input-list-left fn-left">' + words + strGt + '</span>';
				li += num + '</li>';

				html += li;
			}

			return html;

		},
		// 高亮关键词
		getHightLightWrods: function (value, name) {
			var p = new RegExp("^(.*)(" + value + ")(.*)$", "i"),
				arr = name.match(p),
				str;

			if (arr) {
				str = arr[1] + '<strong>' + arr[2] + '</strong>' + arr[3];
			} else {
				str = name;
			}

			return str;
		}
	}

	module.exports = SearchIndex;
});