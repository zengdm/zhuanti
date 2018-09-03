define(function(require, exports, module) {

    'use strict';

    exports.suggest = [
        '{@each list as item,index}',
        '<a target="_blank" href="http://car.diandong.com/chexi/index/',
        '${item.cxid}',
        '">',
        '${item.name}',
        '</a>',
        '{@/each}'
    ].join('');

});
