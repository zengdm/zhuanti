define(function(require, exports, module) {

    'use strict';

    exports.user = [
        '<a href="http://bbs.diandong.com/home.php?mod=spacecp&ac=profile" class="topbar-user-name">',
        '${userName}',
        '</a>',
        '<a href="http://passport.diandong.com/ark/logout" class="topbar-logout-btn">退出</a>'
    ].join('');
});
