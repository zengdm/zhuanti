define(function(require, exports, module) {

    'use strict';

    var area = require('area');

    var Push = function() {
        this.init();
    };

    Push.prototype = {
        init: function() {
            //this.getData();
            this.getData2();
        },
        getData: function() {
            var context = this;
            area.init(function() {
                var url = 'http://assets.diandong.com/repository/data/' + area.id + '.js'

                require.async([url], function(result) {
                    for (var i in result.list) {
                        if (jQuery("[id = agency_shower_" + i + "]").length > 0) {
                            var pushHtml = '';
                            var adinfo = result['list'][i];
                            // 是否为定制模板
                            if (typeof(result.templates[i]) != 'undefined' && result.templates[i]) {
                                pushHtml = result.templates[i];
                                for (var f in adinfo) {
                                    console.log(f, adinfo[f]);
                                    pushHtml = pushHtml.replace('{' + f + '}', adinfo[f]);
                                    pushHtml = pushHtml.replace('{' + f + '}', adinfo[f]);
                                }
                            } else {
                                if (adinfo['exposure_url'] != '' && adinfo['exposure_url'].length > 10) {
                                    pushHtml += '<img src="' + adinfo['exposure_url'] + '" style="display:none;" />';
                                }
                                if (adinfo.adtag_show === '0') {
                                    pushHtml += '<a rel="nofollow" href="' + adinfo.url + '" target="_blank"><img  src="' + adinfo.src + '"></a>';
                                } else {
                                    pushHtml += '<a rel="nofollow" style="display:block;position:relative;" href="' + adinfo.url + '" target="_blank"><img  style="display: block;" src="' + adinfo.src + '"><i style="position:absolute;right:10px;bottom: 10px;color: #fff;font-style: normal;font-size: 12px;border: 1px solid #fff;padding: 0 3px;">广告</i></a>';
                                }
                            }
                            console.log(i, pushHtml);
                            jQuery("[id = agency_shower_" + i + "]").html(pushHtml);
                            $.ajax({
                                url: "http://item.diandong.com/ad/info/count?adid=" + adinfo.adid + "&cityid=" + area.id + "&positionid=" + adinfo.ad_position_id + "&type=1",
                                async: false
                            })
                            $("[id = agency_shower_" + i + "]").find("a").click(function() {
                                console.log("点击生效");
                                $.ajax({
                                    url: "http://item.diandong.com/ad/info/count?adid=" + adinfo.adid + "&cityid=" + area.id + "&positionid=" + adinfo.ad_position_id + "&type=2",
                                    async: false
                                })
                            })
                        }
                    }
                });
            });
        },
        getData2: function() {
            var context = this;
    
            area.init(function() {
                var url = 'http://assets.diandong.com/repository/data/pc/city_' + area.id + '.js?v=' + Math.random()

                require.async([url], function(result) {
                    var focusdata = [101, 102];
                    for (var i in result.list) {
                        console.log("result.list+" + i)
                        if (jQuery("[id = agency_shower_" + i + "]").length > 0) {
                            if (i == 62) {
                                jQuery("[id=agency_shower_62]").each(function(lindex) {
                                    jQuery("[id = agency_62_last]").eq(lindex).html($(this).html());
                                })
                            }
                            console.log('insert ad =>' + i);
                            var pushHtml = '';
                            var adinfo = result['list'][i];
                            // 鏄惁涓哄畾鍒舵ā鏉�
                            if (typeof(result.templates[i]) != 'undefined' && result.templates[i]) {
                                pushHtml = result.templates[i];
                                for (var f in adinfo) {
                                    console.log(f, adinfo[f]);
                                    pushHtml = pushHtml.replace('{' + f + '}', adinfo[f]);
                                    pushHtml = pushHtml.replace('{' + f + '}', adinfo[f]);
                                    pushHtml = pushHtml.replace('{' + f + '}', adinfo[f]);
                                }
                            } else {
                                if (adinfo['ad_exposure_url'] != '' && adinfo['ad_exposure_url'].length > 10) {
                                    pushHtml += '<img src="' + adinfo['ad_exposure_url'] + '" style="display:none;" />';
                                }
                                if (adinfo.adtag_show === '0') {
                                    pushHtml += '<a rel="nofollow" href="' + adinfo.ad_src_url + '" target="_blank"><img class="ad" id="' + adinfo.adid + '" src="' + adinfo.ad_src + '"></a>';
                                } else {
                                    pushHtml += '<a rel="nofollow" style="display:block;position:relative;" href="' + adinfo.ad_src_url + '" target="_blank"><img class="ad" id="' + adinfo.adid + '" style="display: block;" src="' + adinfo.ad_src + '"><i style="position:absolute;right:10px;bottom: 10px;color: #fff;font-style: normal;font-size: 12px;border: 1px solid #fff;padding: 0 3px;">广告</i></a>';
                                }
                            }
                            jQuery("[id = agency_shower_" + i + "]").html(pushHtml);



                            $.ajax({
                                url: "http://item.diandong.com/ad/info/count?adid=" + adinfo.adid + "&cityid=" + area.id + "&positionid=" + adinfo.ad_position_id + "&type=1",
                                async: false
                            })
                            $("[id = agency_shower_" + i + "]").find("a").click(function() {
                                console.log("点击生效");
                                $.ajax({
                                    url: "http://item.diandong.com/ad/info/count?adid=" + adinfo.adid + "&cityid=" + area.id + "&positionid=" + adinfo.ad_position_id + "&type=2",
                                    async: false
                                })
                            })
                        }


                        // if (focusdata.indexOf(i) == 1) {
                        //     var focushtml = '';
                        //     var focusadinfo = result['list'][i];

                        //     console.log("inarray+" + i)


                        //     focushtml += '<div class="focus-display-item" style="display: none;">' +
                        //         '<a rel="nofollow" href="' + focusadinfo.ad_src_url + '" target="_blank"><img class="ad" id="' + focusadinfo.adid + '" src="' + focusadinfo.ad_src + '"></a>'
                        //     '</div>'
                        //     $(".focus-pages").before(focushtml)
                        // }



                    }

                    // $(function() {

                       // imageSlider.init();

                    // });

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