define(function(require,e,i){"use strict";var t=require("cookie"),n={id:"",name:"",nickname:"",avatar:"",init:function(){this.getUserInfo()},getUserInfo:function(){var e=t.get("ark_rememberusername")||"",i=t.get("ark_headimg")||"",n=t.get("ark_nickname")||"",a=t.get("ark_userid")||"";this.save(a,e,n,i)},save:function(e,i,t,n){this.id=e,this.name=i,this.nickname=t,this.avatar=n}};n.init(),i.exports=n});