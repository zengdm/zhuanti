define(function(require,t,e){var n,i,a;i={onSale:{CARBRAND:"http://mall.diandong.com/api/listData/saleBrand",CARSERIES:"http://mall.diandong.com/api/listData/saleSeries/",CARTYPE:"http://mall.diandong.com/api/listData/saleModel/"},onProduct:{CARBRAND:"http://car.diandong.com/api/listData/brand",CARSERIES:"http://car.diandong.com/api/listData/series_product_status/",CARTYPE:"http://car.diandong.com/api/listData/model/"},all:{CARBRAND:"http://car.diandong.com/api/listData/brand",CARSERIES:"http://car.diandong.com/api/listData/series/",CARTYPE:"http://car.diandong.com/api/listData/model/"}},a={BRAND_OPTION:'<option value="0">选择品牌</option>',SEIRES_OPTION:'<option value="0">选择车系</option>',MODEL_OPTION:'<option value="0">选择车型</option>'},n=function(t){this.options=$.extend({status:"all"},t),this.api=i[this.options.status],this.bindEvent()},n.prototype={bindEvent:function(){var t=this,e=this.options.elements.brand,n=this.options.elements.series,i=this.options.elements.model;e.on("change",function(){var e=this.value;i.html(a.MODEL_OPTION),t.getSeries(e)}),n.on("change",function(e){var n=this.value;i.html(a.MODEL_OPTION),t.getModel(n)}),i.on("change",function(){var e=this.value;t.options.complete&&t.options.complete(e)})},request:function(t,e){$.ajax({url:t,type:"get",dataType:"jsonp",success:e})},initCar:function(t,e,n){function i(){a.val(t),r.getSeries(t,function(){o.val(e),r.getModel(e,function(){s.val(n),r.options.complete&&r.options.complete(n)})})}var a=this.options.elements.brand||0,o=this.options.elements.series||0,s=this.options.elements.model||0,r=this;a.children().length>1?i():this.getBrands(i)},getBrands:function(t){var e=this,n=this.options.elements.brand;this.request(this.api.CARBRAND,function(i){if(i.state.err===!1){var a=i.data,o=e.createBrandsElements(a);n.html(o),t&&t()}})},createBrandsElements:function(t){var e=a.BRAND_OPTION;for(var n in t)for(var i=t[n],o=0;o<i.length;o++){var s=i[o],r=s.ppid,l=s.name,p="<option value="+r+">"+n+"-"+l+"</option>";e+=p}return e},getSeries:function(t,e){var n=this,i=this.api.CARSERIES+t,a=this.options.elements.series;this.request(i,function(t){if(t.state.err===!1){var i=t.data,o=n.createSeriesElements(i);a.html(o),e&&e()}})},createSeriesElements:function(t){for(var e=a.SEIRES_OPTION,n=0,i=t.length;i>n;n++){var o=t[n],s=o.cxid,r=o.name,l="<option value="+s+">"+r+"</option>";e+=l}return e},getModel:function(t,e){var n=this,i=this.api.CARTYPE+t,a=this.options.elements.model;return 0==t?void n.createTypeElements([]):void this.request(i,function(t){if(t.state.err===!1){var i=t.data,o=n.createTypeElements(i);a.html(o),e&&e()}})},createTypeElements:function(t){for(var e=a.MODEL_OPTION,n=0,i=t.length;i>n;n++){var o=t[n],s=o.pzid,r=o.name,l="<option value="+s+">"+r+"</option>";e+=l}return e}},e.exports=n});