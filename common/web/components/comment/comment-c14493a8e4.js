define(function(require,t,e){"use strict";require("./comment-cb03a9f550.css");var n,o,c,i,a,m,r="http://comment.diandong.com/comment/list",s="http://comment.diandong.com/comment/post";o=require("user"),c=require("pagination"),i=require("tip"),m=require("./comment.tpl"),a=require("ajaxform"),n=function(t){this.options=t,this.init(t)},n.prototype={cache:{},replyId:"",init:function(t){this.render(t.holder),this.checkLogin(),this.getCommentList(1,t.pageNum,t.uuid),this.bindEvent(t)},bindEvent:function(t){var e=this;$(document).on("click",".j-page",function(n){e.getCommentList($(n.currentTarget).data("page"),t.pageNum,t.uuid)}),$(document).on("click",".j-submit-comment",function(n){return $(n.currentTarget).hasClass("disabled")?!1:void e.postComment(t)}),$(document).on("click",".j-reply-comment",function(t){var n=$(t.currentTarget).parents(".comment-item"),o=n.data("comment-id"),c=n.data("comment-uname");e.replyId=o,$(".comment-content-textarea").val("回复 "+c+" ")})},render:function(t){var e=juicer(m.box,{});t.html(e)},checkLogin:function(){if(o.id){$(".comment-form-cover").addClass("fn-hide"),$(".comment-form-content").removeClass("fn-hide");var t=juicer(m.user,{avatar:o.avatar,name:o.nickname});$(".comment-user").html(t)}},getCommentList:function(t,e,n){var o=this;$.ajax({url:r,data:{page:t+"",pageNum:e+"",uuid:n},dataType:"jsonp",type:"GET",success:function(n){n.state.err||(o.cache=n.data,o.renderCommentList(o.cache),o.renderPage(Math.ceil(o.cache.total/e),t))}})},renderCommentList:function(t){for(var e=[],n=0;n<t.curPageList.length;n++){var o=t.curPageList[n];0!==t.content[o].refID&&(t.content[o].replyCon=t.content[t.content[o].refID].content),e[n]=t.content[o]}$(".comment-list-content").html(juicer(m.commentItem,{list:e}))},renderPage:function(t,e){$(".comment-page").html(c.render(t,e))},postComment:function(t){var e=this,n=$.trim($(".comment-content-textarea").val());if(""===n)i.info("请填写评论内容");else{var o={content:n,iframeCross:1,uuid:this.options.uuid};0!==this.replyId&&(o.refID=this.replyId),new a({url:s,data:o,success:function(n){0===n.code?(e.getCommentList(1,t.pageNum,t.uuid),$(".comment-content-textarea").val(""),i.success("评论成功！"),e.replyId=0):i.info(n.description),self.publishFlag=!0}})}}},e.exports=n});