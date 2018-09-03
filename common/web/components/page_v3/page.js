define(function(require, exports, module) {

    'use strict';

    var Topbar = require('topbar_v2');
    var Header = require('header_v3');
    var toolbar = require('toolbar');
    var Footer = require('footer');

    var Page = function(options) {
        this.init(options);
    };

    Page.prototype = {
        options: {
            topbar: {
                status: false,
                param: {}
            },
            header: {
                status: false,
                param: {}
            },
            toolbar: {
                status: false,
                param: {}
            },
            footer: {
                status: true
            }
        },
        init: function(options) {
            var opt = options ? $.extend({}, this.options, options) : this.options;

            if (opt.topbar.status) {
                var topbar = new Topbar(opt.topbar.param);
            }

            if (opt.header.status) {
                var header = new Header(opt.header.param);
            }

            if (opt.toolbar.status) {
                toolbar.init();
            }

            if (opt.footer.status) {
                var footer = new Footer();
            }
        }
    };

    module.exports = Page;
});