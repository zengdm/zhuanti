define(function(require, exports, module) {

    'use strict';

    var area = require('area');

    var Push = function() {
        this.init();
    };

    Push.prototype = {
        init: function() {
            this.getData();
        },
        getData: function() {
            var context = this;

            area.init(function() {
                var url = 'http://assets.diandong.com/repository/data/' + area.id + '.js'

                require.async([url], function(result) {
                    for (var i in result) {
                        if (jQuery('#agency_shower_' + i).length > 0) {
                            var pushHtml = '';
			    if (result[i]['exposure_url']!='' && result[i]['exposure_url'].length>10) {
				pushHtml += '<img src="' + result[i]['exposure_url'] + '" style="display:none;" />';
			    }
                            if(result[i].adtag_show === '0') {
                                pushHtml += '<a href="' + result[i].url + '" target="_blank"><img src="' + result[i].src + '"></a>';
                            } else {
                                pushHtml += '<a style="display:block;position:relative;" href="' + result[i].url + '" target="_blank"><img style="display: block;" src="' + result[i].src + '"><i style="position:absolute;right:10px;bottom: 10px;color: #fff;font-style: normal;font-size: 12px;border: 1px solid #fff;padding: 0 3px;">广告</i></a>';
                            }
                            jQuery('#agency_shower_' + i).html(pushHtml);
                        }
                    }
                });
            });
        }
    };

    module.exports = Push;
});
