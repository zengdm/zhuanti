define(function(require, exports, module) {

    'use strict';

    var page, topbar, header, nav, toolbar;

    topbar = require('topbar');
    header = require('header');
    nav = require('nav');
    toolbar = require('toolbar');

    page = {
        options: {
            topbar: {
                status: false
            },
            header: {
                status: false
            },
            nav: {
                status: false,
                param: {
                    showMenu: false,
                    hasMini: true
                }
            },
            toolbar: {
                status: false
            }
        },
        init: function(options) {
            var opt = options ? $.extend({}, this.options, options) : this.options;

            opt.topbar.status && topbar.init();
            opt.header.status && header.init();
            opt.nav.status && nav.init(opt.nav.param);
            opt.toolbar.status && toolbar.init();
        }
    };

    module.exports = page;
});
