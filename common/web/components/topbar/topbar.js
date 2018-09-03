define(function(require, exports, module) {

    'use strict';

    var topbar, area, cookie, user, tpl;

    var AJAX_CITY_URL = 'http://car.diandong.com/api/get_local';
    var AJAX_ORDER_URL = 'http://mall.diandong.com/api/get_order_count';

    area = require('area');
    cookie = require('cookie');
    user = require('user');
    tpl = require('./topbar.tpl');

    topbar = {
        elements: {
            cityBtn: $('.topbar-city-btn'),
            loginBtn: $('.topbar-login'),
            userInfo: $('.topbar-user'),
            orderInfo: $('.topbar-order a'),
            codeBtn: $('.j-show-code'),
            mobileCode: $('.mobile-code')
        },
        init: function() {
            this.initArea();
            user.id !== '' && this.renderOrder();
            this.bindEvent();
        },
        bindEvent: function() {
            var context = this;

            this.elements.codeBtn.on('mouseenter', function(e) {
                context.elements.mobileCode.removeClass('fn-hide');
            }).on('mouseleave', function() {
                context.elements.mobileCode.addClass('fn-hide');
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
        renderCity: function(cityName) {
            this.elements.cityBtn.html(cityName);
        },
        getCity: function() {
            var context = this;

            $.ajax({
                url: AJAX_CITY_URL,
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
        setCookie: function(object) {
            for (var i in object) {
                cookie.set(i, object[i], {
                    path: '/',
                    domain: '.diandong.com'
                });
            }
        },
        renderUser: function(orderHtml) {
            this.elements.userInfo.removeClass('fn-hide').html(juicer(tpl.user, {
                userName: user.nickname
            }));
            this.elements.loginBtn.addClass('fn-hide');
            this.elements.orderInfo.attr('href', 'http://mall.diandong.com/my/order/').html(orderHtml);
        },
        renderOrder: function() {
            var context = this;
            var orderCount = 0;
            var orderHtml = '';

            $.ajax({
                url: AJAX_ORDER_URL,
                data: {},
                dataType: 'jsonp',
                type: 'GET',
                success: function(result) {
                    if (!result.state.err) {

                        if (result.code === '0') {
                            orderCount = result.data['2'].count || 0;
                        } else {
                            orderCount = 0;
                        }
                    } else {
                        orderCount = 0;
                    }

                    orderHtml = orderCount === 0 ? '我的订单' : ('我的订单(<span>' + orderCount + '</span>)');
                    context.renderUser(orderHtml);
                }
            });
        }
    };

    module.exports = topbar;
});
