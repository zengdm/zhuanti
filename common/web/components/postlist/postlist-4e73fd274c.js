define(function(require,t,i){"use strict";require("./post-cb56aa67b0.css");var s=require("./post.tpl"),o="http://bbs.diandong.com/api/api.php?ac=newpost",n=function(t){this.init(t)};n.prototype={options:{holder:null},init:function(t){var i=t?$.extend({},this.options,t):this.options;this.getPostList(i.fid,i.typeid,i.limit,i.holder)},getPostList:function(t,i,n,p){$.ajax({url:o,data:{fid:t,typeid:i,limit:n},dataType:"jsonp",type:"GET",success:function(o){var n=o.data,e=juicer(s.item,{list:n.list,fid:t,typeid:i});p.html(e)}})}},i.exports=n});