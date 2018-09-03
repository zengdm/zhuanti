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
                var url = 'http://assets.diandong.com/repository/data/pc/city_' + area.id + '.js?v=' + Math.random()

                require.async([url], function(result) {
                    for (var i in result.list) {
                        if (jQuery('#agency_shower_' + i).length > 0) {
                            console.log('insert ad =>' + i);
                            var pushHtml = '';
                            var adinfo = result['list'][i];
                            // 鏄惁涓哄畾鍒舵ā鏉�
                            if (typeof(result.templates[i]) != 'undefined' && result.templates[i]) {
                                pushHtml = result.templates[i];
                                for (var f in adinfo) {
                                    console.log(f, adinfo[f]);
                                    pushHtml = pushHtml.replace('{' + f + '}', adinfo[f]);
                                }
                            } else {
                                if (adinfo['ad_exposure_url'] != '' && adinfo['ad_exposure_url'].length > 10) {
                                    pushHtml += '<img src="' + adinfo['ad_exposure_url'] + '" style="display:none;" />';
                                }
                                if (adinfo.adtag_show === '0') {
                                    pushHtml += '<a rel="nofollow" href="' + adinfo.ad_src_url + '" target="_blank" ><img src="' + adinfo.ad_src + '"></a>';
                                } else {
                                    pushHtml += '<a rel="nofollow" style="display:block;position:relative;" href="' + adinfo.ad_src_url + '" target="_blank"><img style="display: block;" src="' + adinfo.ad_src + '"><i style="position:absolute;right:10px;bottom: 10px;color: #fff;font-style: normal;font-size: 12px;border: 1px solid #fff;padding: 0 3px;">广告</i></a>';
                                }
                            }
                            jQuery('#agency_shower_' + i).html(pushHtml);
                            $.ajax({
                                url: "http://item.diandong.com/ad/info/count?adid=" + adinfo.adid + "&cityid=" + area.id + "&positionid=" + adinfo.ad_position_id + "&type=1",
                                async: false
                            })
                            $('#agency_shower_' + i).find("a").click(function() {
                                console.log("点击生效");
                                $.ajax({
                                    url: "http://item.diandong.com/ad/info/count?adid=" + adinfo.adid + "&cityid=" + area.id + "&positionid=" + adinfo.ad_position_id + "&type=2",
                                    async: false
                                })
                            })
                        }
                    }
                    $("[id = agency_shower_1]").fadeIn(800);
                    $("[id = agency_shower_59]").fadeIn(800);
                    $("[id = agency_shower_64]").fadeIn(800);
                    $("[id = agency_shower_60]").fadeIn(800);
                    $("[id = agency_shower_7]").fadeIn(800);
                    $("[id = agency_shower_65]").fadeIn(800);
                    $("[id = agency_shower_62]").fadeIn(800);
                    $("[id = agency_shower_63]").fadeIn(800);
                    $("[id = agency_shower_42]").fadeIn(800);
                    $("[id = agency_shower_66]").fadeIn(800);
                });
            });
        }
    };

    module.exports = Push;
});