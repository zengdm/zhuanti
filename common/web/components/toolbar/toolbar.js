define(function(require, exports, module) {

    'use strict';

    require('./toolbar.css');

    var user = require('user');
    var tpl = require('./toolbar.tpl');
    var tip = require('tip');

    var toolbar = {
        elements: {
            button: $('.toolbar-btn')
        },
        init: function() {
            this.render();
            this.initToolbar();
            user.id && this.changeOrderLink();
            this.bindEvent();
        },
        bindEvent: function() {
            var context = this;
            var timeId;

            // show tip.
            $(document).on('mouseenter', '.toolbar-btn', function(e) {
                var self = $(e.currentTarget);
                var tip = self.find('.toolbar-btn-tip');

                timeId = setTimeout(function() {
                    self.addClass('current');
                    tip.removeClass('fn-hide').animate({
                        "opacity": "1",
                        "right": "35px"
                    }, 300);
                }, 200);
            }).on('mouseleave', '.toolbar-btn', function(e) {
                var self = $(e.currentTarget);
                var tip = self.find('.toolbar-btn-tip');

                clearTimeout(timeId);
                self.removeClass('current');
                tip.animate({
                    "opacity": "0",
                    "right": "60px"
                }, 300, function() {
                    tip.addClass('fn-hide');
                });
            });

            // resize.
            $(window).on('resize', function() {
                var htmlWidth = document.documentElement.getBoundingClientRect().width || $(document).width();

                if (htmlWidth <= 1200) {
                    $('.dd-global-toolbar').removeClass('on');
                    context.hide();
                } else {
                    $('.dd-global-toolbar').addClass('on');
                    context.show();
                }
            });

            $(document).on('mouseenter', '.dd-global-toolbar', function() {
                !$('.dd-global-toolbar').hasClass('on') && context.show();
            }).on('mouseleave', '.dd-global-toolbar', function() {
                !$('.dd-global-toolbar').hasClass('on') && context.hide();
            });

            $(document).on('click', '.j-return-top', function() {
                $('html,body').stop().animate({
                    scrollTop: 0
                }, 300);
            });
        },
        render: function() {
            $('body').append(juicer(tpl.toolbar, {
                qq: '938019143'
            }));
        },
        show: function() {
            $('.dd-global-toolbar').addClass('show');
        },
        hide: function() {
            $('.dd-global-toolbar').removeClass('show');
        },
        initToolbar: function() {
            var context = this;
            var htmlWidth = document.documentElement.getBoundingClientRect().width || $(document).width();

            if (htmlWidth <= 1200) {
                $('.dd-global-toolbar').removeClass('on');
                context.hide();
            } else {
                $('.dd-global-toolbar').addClass('on');
                context.show();
            }
        },
        changeOrderLink: function() {
            $('.toolbar-order-btn').attr('href', 'http://mall.diandong.com/my/order/');
        }
    };

    module.exports = toolbar;
});
