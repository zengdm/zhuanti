define(function(require, exports, module) {

    var Footer = function() {
        this.init();
    };

    Footer.prototype = {

        init: function() {
            this.bindEvent();
        },

        bindEvent: function() {
            $('.footer-hotline i').on('mouseenter', function() {
                $('.code-overlay').removeClass('fn-hide');
            }).on('mouseleave', function() {
                $('.code-overlay').addClass('fn-hide');
            });
        }
    };

    module.exports = Footer;
});