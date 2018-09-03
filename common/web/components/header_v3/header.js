define(function(require, exports, module) {

    var cookie = require('cookie');
    var area = require('area');
    var user = require('user');
    var tpl = require('./header.tpl');

    var GET_CITY = 'http://car.diandong.com/api/get_local';
    var GET_PLACEHOLDER = 'http://car.diandong.com/api/getSectionData?sectionid=296';
    var AJAX_SEARCH_URL = 'http://car.diandong.com/api/chexi_fuzzysearch';

    var Header = function() {
        this.init();
    };

    Header.prototype = {

        init: function() {
            this.initArea();
            user.id !== '' && this.renderUser();
            this.renderPlaceholder();

            this.bindEvent();
        },

        renderPlaceholder: function() {
            var context = this;

            $.ajax({
                url: GET_PLACEHOLDER,
                data: {},
                dataType: 'jsonp',
                type: 'GET',
                success: function(result) {
                    $('.search-input').attr('placeholder', (result.data[0].title || ''));
                }
            });
        },

        bindEvent: function() {
            var context = this;

            $('.search-input').on('keyup', function(e) {
                var self = $(e.target);
                var value = self.val();

                context.getSuggest(value);

                if (e.keyCode === 13) {
                    $('.search-submit-btn').trigger('click');
                }
            });

            $(document).on('click', function(e) {
                if ($(e.target).attr('id') !== 'search-wrapper') {
                    context.hideSuggest();
                }
            });

            $('.search-submit-btn').on('click', function() {
                var value = $('.search-input').val() || $('.search-input').attr('placeholder');

                window.open('http://search.diandong.com/zonghe/?words=' + value);
            });
        },

        getSuggest: function(value) {
            var context = this;

            $.ajax({
                url: AJAX_SEARCH_URL,
                data: {
                    keywords: value
                },
                dataType: 'jsonp',
                type: 'GET',
                success: function(data) {
                    if (data.state.err) {
                        context.hideSuggest();
                    } else {
                        context.renderSuggest(data.data);
                    }
                }
            });
        },

        hideSuggest: function() {
            $('.search-wrapper').removeClass('focus');
            $('.search-suggest-list').remove();
        },

        renderSuggest: function(json) {
            var suggestHtml = juicer(tpl.suggest, {list: json});

            $('<div class="search-suggest-list"></div>').html(suggestHtml).appendTo(document.body);
            this.showSuggest();
        },

        showSuggest: function() {
            var offset = $('.search-wrapper').offset();

            $('.search-wrapper').addClass('focus');
            $('.search-suggest-list').css({
                "top": offset.top + 42,
                "left": offset.left
            });
        },

        initArea: function() {
            var context = this;

            area.init(function() {
                if (area.name === '' || area.id === '') {
                    context.getCity();
                } else {
                    context.renderCity(area.name);
                }
            });
        },

        getCity: function() {
            var context = this;

            $.ajax({
                url: GET_CITY,
                data: {},
                dataType: 'jsonp',
                type: 'GET',
                success: function(result) {
                    if (!result.state.err) {
                        context.renderCity(result.data.city);
                        context.setCookie({cityName: result.data.city, cityId: result.data.code});
                    }
                }
            });
        },

        renderCity: function(cityName) {
            $('.current-city a').html(cityName);
        },

        renderUser: function() {

            var userHtml = [
                '<div class="user-panel-avatar no-background"><img src="' + user.avatar + '"></div>',
                '<a href="http://passport.diandong.com/ark/baseinfo">' + user.name + '</a>',
                '<a href="http://passport.diandong.com/ark/logout">退出</a>'
            ].join('');

            $('.user-panel').html(userHtml);
        },

        setCookie: function(object) {
            for (var i in object) {
                cookie.set(i, object[i], {
                    path: '/',
                    domain: '.diandong.com'
                });
            }
        }
    };

    module.exports = Header;
});
