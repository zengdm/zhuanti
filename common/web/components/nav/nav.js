define(function(require, exports, module) {

    'use strict';

    var nav;

    nav = {
        options: {
            showMenu: false,
            hasMini: true
        },
        init: function(options) {
            var opt = options ? $.extend({}, this.options, options) : this.options;

            this.initNav(opt);
            this.bindEvent(opt);
        },
        elements: {
            nav: $('#dd-global-nav'),
            filterBtn: $('.j-show-panel'),
            menu: $('.focus-menu'),
            showBrandBtn: $('.j-show-brand-panel'),
            brandPanel: $('.focus-brand-panel'),
            miniNav: $('.mini-nav')
        },
        bindEvent: function(options) {
            var context = this;
            var menuTimeId;

            this.elements.filterBtn.on('mouseenter', function() {
                menuTimeId = setTimeout(function() {
                    context.showMenu();
                }, 300);
            }).on('mouseleave', function() {
                clearTimeout(menuTimeId);
                !options.showMenu && context.hideMenu();
            });

            this.elements.showBrandBtn.on('mouseenter', function() {
                context.showPanel();
            }).on('mouseleave', function() {
                context.hidePanel();
            });

            $(window).on('scroll', function() {

                if (options.hasMini) {
                    var top = $(document).scrollTop();
                    var height = context.elements.nav.offset().top + context.elements.nav.height();

                    if (top > height) {
                        context.elements.miniNav.addClass('on');
                    } else {
                        context.elements.miniNav.removeClass('on');
                    }
                }
            });
        },
        initNav: function(options) {

            if (options.showMenu) {
                this.elements.filterBtn.addClass('on');
                this.elements.menu.removeClass('fn-hide');
            } else {
                $('.sort-menu-btn i').show();
            }
        },
        showMenu: function() {
            this.elements.filterBtn.addClass('on');
            this.elements.menu.removeClass('fn-hide');
        },
        hideMenu: function() {
            this.elements.filterBtn.removeClass('on');
            this.elements.menu.addClass('fn-hide');
        },
        showPanel: function() {
            this.elements.showBrandBtn.addClass('on');
            this.elements.brandPanel.removeClass('fn-hide');
        },
        hidePanel: function() {
            this.elements.showBrandBtn.removeClass('on');
            this.elements.brandPanel.addClass('fn-hide');
        }
    };

    module.exports = nav;
});
