define(function(require, exports, module) {

    'use strict';

    exports.topbar = [
        '<div class="global-topbar">',
        '<div class="wrap">',
        '<div class="topbar-city fn-left">',
        '<span class="current-city fn-left"></span>',
        '<a href="http://www.diandong.com/city/" class="change-city-btn fn-left">切换</a>',
        '</div>',
        '<div class="topbar-link fn-right">',
        '<div class="topbar-link-item topbar-link-app"><a href="http://www.diandong.com/app/">电动邦APP下载</a></div>',
        '<i>|</i>',
        '<div class="topbar-link-item"><a href="http://m.diandong.com/">手机版</a></div>',
        '<i>|</i>',
        '<div class="topbar-link-item topbar-link-order"><a href="http://passport.diandong.com/ark/login/">我的订单</a></div>',
        '<i>|</i>',
        '<div class="topbar-link-item topbar-link-login"><a href="http://passport.diandong.com/ark/login?redirect=${redirectUrl}">登录</a></div>',
        '<div class="topbar-link-item topbar-link-user fn-hide"><a href="http://passport.diandong.com/ark/baseinfo"></a></div>',
        '<i>|</i>',
        '<div class="topbar-link-item topbar-link-register"><a href="http://passport.diandong.com/ark/register/">注册</a></div>',
        '<div class="topbar-link-item topbar-link-logout fn-hide"><a href="http://passport.diandong.com/ark/logout">退出</a></div>',
        '</div>',
        '</div>',
        '</div>'
    ].join('');
});
