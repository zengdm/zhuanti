define(function(require, exports, module) {

    'use strict';

    var cookie = require('cookie'),
        area = require('area'),
        user = require('user'),
        tpl = require('./topbar.tpl');

    require('./topbar.css');

    var GET_CITY = 'http://car.diandong.com/api/get_local';
    var GET_ORDER = 'http://mall.diandong.com/api/get_order_count';

    var Topbar = function() {
        this.init();
    };

    Topbar.prototype = {
        init: function() {
            this.render();
            this.initArea();
            user.id !== '' && this.renderOrder();
        },
        render: function() {
            var topbarHtml = juicer(tpl.topbar, {
                redirectUrl: location.href
            });

            $(document.body).prepend(topbarHtml);
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
                        context.setCookie({
                            cityName: result.data.city,
                            cityId: result.data.code
                        });
                    }
                }
            });
        },
        renderCity: function(cityName) {
            $('.current-city').html(cityName);
        },
        setCookie: function(object) {
            for (var i in object) {
                cookie.set(i, object[i], {
                    path: '/',
                    domain: '.diandong.com'
                });
            }
        },
        renderOrder: function() {
            var context = this;
            var orderCount = 0;
            var orderHtml = '';

            // $.ajax({
            //     url: GET_ORDER,
            //     data: {},
            //     dataType: 'jsonp',
            //     type: 'GET',
            //     success: function(result) {
            //         if (!result.state.err) {

            //             if (result.code === '0') {
            //                 orderCount = result.data['2'].count || 0;
            //             } else {
            //                 orderCount = 0;
            //             }
            //         } else {
            //             orderCount = 0;
            //         }

            //         orderHtml = orderCount === 0 ? '我的订单' : ('我的订单(<span>' + orderCount + '</span>)');
            //         context.renderUser(orderHtml);
            //     }
            // });

            orderHtml = '我的订单';
            context.renderUser(orderHtml);
        },
        renderUser: function(orderHtml) {
            $('.topbar-link-login').addClass('fn-hide');
            $('.topbar-link-register').addClass('fn-hide');
            $('.topbar-link-logout').removeClass('fn-hide');
            $('.topbar-link-user').removeClass('fn-hide');
            $('.topbar-link-user a').html(user.nickname);
            $('.topbar-link-order a').attr('href', 'http://mall.diandong.com/my/order/').html(orderHtml);
        }
    };

    module.exports = Topbar;
});