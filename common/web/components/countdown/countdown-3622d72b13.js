define(function(require,t,e){var i=function(t){var e={now:(new Date).getTime(),end:(new Date).getTime(),complete:null};return this.defaults=$.extend(!0,e,t),this.time=this.defaults.end/1e3-this.defaults.now/1e3,this.time<=0?(this.defaults.elements.day.html("00"),this.defaults.elements.hour.html("00"),this.defaults.elements.minute.html("00"),this.defaults.elements.second.html("00"),void(this.complete&&this.complete())):void this.init()};i.prototype={init:function(){this.beginCountDown()},countTime:function(){var t=parseInt(this.time/3600/24),e=parseInt(this.time/3600%24),i=parseInt(this.time/60%60),s=parseInt(this.time%60);this.defaults.elements.day.html(this.format(t)),this.defaults.elements.hour.html(this.format(e)),this.defaults.elements.minute.html(this.format(i)),this.defaults.elements.second.html(this.format(s)),this.time<=0&&(clearInterval(this.autoC),this.complete&&this.complete()),this.time-=1},beginCountDown:function(){this.countTime(),this.autoC=setInterval(this.bind(this,this.countTime),1e3)},format:function(t){return 10>t?"0"+t:t},bind:function(t,e){return function(){return e.apply(t)}}},e.exports=i});