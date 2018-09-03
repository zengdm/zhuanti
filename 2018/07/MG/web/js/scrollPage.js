$(function() {
    var wrap = document.getElementById("wrap");

    var main = document.getElementById("main");
    var style = null;
    var page = document.getElementsByClassName('page');
    var hei;
    var hei = document.body.clientHeight;
    wrap.style.height = hei + "px";
    // 获取元素样式
    // var getStyle = function(obj,attriName){
    //     if(obj.currentStyle){
    //         //IE
    //         return obj.currentStyle[attriName];
    //     }else{
    //         //非IE
    //         return window.getComputedStyle(obj,null)[attriName];
    //     }
    // }
    for (var i = 0; i < page.length; i++) {
        page[i].style.height = hei + "px";
  
    }
    wrap.style.height = hei + "px";

    //如果不加时间控制，滚动会过度灵敏，一次翻好几屏

    var startTime = 0, //翻屏起始时间  

        endTime = 0,

        now = 0;

    //浏览器兼容     

    if ((navigator.userAgent.toLowerCase().indexOf("firefox") != -1)) {

        document.addEventListener("DOMMouseScroll", scrollFun, false);

    } else if (document.addEventListener) {

        document.addEventListener("mousewheel", scrollFun, false);

    } else if (document.attachEvent) {

        document.attachEvent("onmousewheel", scrollFun);

    } else {

        document.onmousewheel = scrollFun;

    }

    //滚动事件处理函数
    function scrollFun(event) {

        startTime = new Date().getTime();

        var delta = event.detail || (-event.wheelDelta);

        if ((endTime - startTime) < -1000) {

            // 向下滚动且没有到底
            if (delta > 0 && parseInt(main.offsetTop) > -(hei * (page.length - 1))) {
                now = now - hei;
                toPage(now);

            }

            if (delta < 0 && parseInt(main.offsetTop) < 0) {
                now = now + hei;

                toPage(now);

            }

            endTime = new Date().getTime();

        } else {

            event.preventDefault();

        }

    }

    function toPage(now) {
        $("#main").animate({
            top: (now + 'px')
        }, 1000);

    }

})