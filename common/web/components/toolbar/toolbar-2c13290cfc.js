define(function(require,o,t){"use strict";require("./toolbar-939e40c8d7.css");var n,e,a;e=require("user"),a=require("./toolbar.tpl"),n={elements:{button:$(".toolbar-btn")},init:function(){this.render(),this.initToolbar(),e.id&&this.changeOrderLink(),this.bindEvent()},bindEvent:function(){var o,t=this;$(document).on("mouseenter",".toolbar-btn",function(t){var n=$(t.currentTarget),e=n.find(".toolbar-btn-tip");o=setTimeout(function(){n.addClass("current"),e.removeClass("fn-hide").animate({opacity:"1",right:"35px"},300)},200)}).on("mouseleave",".toolbar-btn",function(t){var n=$(t.currentTarget),e=n.find(".toolbar-btn-tip");clearTimeout(o),n.removeClass("current"),e.animate({opacity:"0",right:"60px"},300,function(){e.addClass("fn-hide")})}),$(window).on("resize",function(){var o=document.documentElement.getBoundingClientRect().width||$(document).width();1200>=o?($(".dd-global-toolbar").removeClass("on"),t.hide()):($(".dd-global-toolbar").addClass("on"),t.show())}),$(document).on("mouseenter",".dd-global-toolbar",function(){!$(".dd-global-toolbar").hasClass("on")&&t.show()}).on("mouseleave",".dd-global-toolbar",function(){!$(".dd-global-toolbar").hasClass("on")&&t.hide()}),$(document).on("click",".j-return-top",function(){$("html,body").stop().animate({scrollTop:0},300)})},render:function(){$("body").append(juicer(a.toolbar,{qq:"938019143"}))},show:function(){$(".dd-global-toolbar").addClass("show")},hide:function(){$(".dd-global-toolbar").removeClass("show")},initToolbar:function(){var o=this,t=document.documentElement.getBoundingClientRect().width||$(document).width();1200>=t?($(".dd-global-toolbar").removeClass("on"),o.hide()):($(".dd-global-toolbar").addClass("on"),o.show())},changeOrderLink:function(){$(".toolbar-order-btn").attr("href","http://mall.diandong.com/my/order/")}},t.exports=n});