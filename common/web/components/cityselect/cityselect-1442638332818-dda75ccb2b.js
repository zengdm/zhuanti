define(function(require,t,i){var o,n=require("location");o=function(t){this.options=$.extend({},t),this.setProvince(),this.bindEvent()},o.prototype={bindEvent:function(){var t=this.options.elements.province,i=this.options.elements.city,o=this;t.on("change",function(){var t=this.value;o.setCity(t)}),i.on("change",function(){var t=this.value;o.options.complete&&this.options.complete(t)})},setProvince:function(){var t='<option value="0">选择省份</option>';for(var i in n){var o="<option value="+i+">"+n[i].name+"</option>";t+=o}this.options.elements.province.html(t)},setCity:function(t){var i,o='<option value="0">选择城市</option>';if(0!=t){i=n[t].cities;for(var e in i){var s="<option value="+e+">"+i[e]+"</option>";o+=s}}this.options.elements.city.html(o)},initCity:function(t,i){this.options.elements.province.val(t),this.setCity(t),this.options.elements.city.val(i),this.options.complete&&this.options.complete(i)}},i.exports=o});