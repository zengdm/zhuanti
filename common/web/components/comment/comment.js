define(function(require, exports, module) {

    'use strict';

    require('./comment.css');

    var Comment,
        user,
        pagination,
        tip,
        ajaxform,
        tpl;

    var GET_COMMENT_LIST = 'http://comment.diandong.com/comment/list';
    var POST_COMMENT = 'http://comment.diandong.com/comment/post';
    var LIKE_COMMENT = 'http://comment.diandong.com/comment/up';

    user = require('user');
    pagination = require('pagination');
    tip = require('tip');
    tpl = require('./comment.tpl');
    ajaxform = require('ajaxform');

    Comment = function(options) {
        this.options = options;
        this.init(options);
    }

    Comment.prototype = {
        cache: {},
        replyId: '',
        init: function(options) {
            this.render(options.holder);
            this.checkLogin();
            this.getCommentList(1, options.pageNum, options.uuid);
            this.bindEvent(options);
        },
        bindEvent: function(options) {
            var context = this;

            // 分页
            $(document).on('click', '.j-page', function(e) {
                context.getCommentList($(e.currentTarget).data('page'), options.pageNum, options.uuid);
            });

            // 发送评论
            $(document).on('click', '.j-submit-comment', function(e) {
                if ($(e.currentTarget).hasClass('disabled')) {
                    return false;
                } else {
                    context.postComment(options);
                }
            });

            // 回复
            $(document).on('click', '.j-reply-comment', function(e) {
                var parent = $(e.currentTarget).parents('.comment-item');
                var replyId = parent.data('comment-id');
                var replyName = parent.data('comment-uname');

                context.replyId = replyId;

                $('.comment-content-textarea').val('回复' +
                    ' ' + replyName + ' ');

                context.focusTextarea(options.holder);
            });

            // 点赞
            $(document).on('click', '.j-like-comment', function(e) {
                if (user.id) {
                    if ($(e.currentTarget).hasClass('on')) {
                        tip.info('您已经赞过');
                    } else {
                        var cid = $(e.currentTarget).data('cid');
                        var ups = $(e.currentTarget).data('ups');

                        $(e.currentTarget).addClass('on');
                        $(e.currentTarget).find('span').html(+ ups + 1);

                        $.ajax({
                            url: LIKE_COMMENT,
                            data: {
                                cid: cid,
                                uuid: options.uuid
                            },
                            dataType: 'jsonp',
                            type: 'GET',
                            success: function(result) {
                                tip.success('点赞成功');
                            }
                        });
                    }
                } else {
                    tip.info('请先登录');
                }

            });
        },
        render: function(holder) {
            var commentHtml = juicer(tpl.box, {redirect: location.href});

            holder.html(commentHtml);
        },
        checkLogin: function() {
            if (user.id) {
                $('.comment-form-cover').addClass('fn-hide');
                form : $('.comment-form-content').removeClass('fn-hide');

                var userHtml = juicer(tpl.user, {
                    avatar: user.avatar,
                    name: user.nickname
                });

                $('.comment-user').html(userHtml);
            }
        },
        focusTextarea: function(holder) {
            var top = holder.offset().top;

            window.scrollTo(0, top);
            $('.comment-content-textarea').focus();

        },
        getCommentList: function(page, pageNum, uuid) {
            var context = this;
            var data = {
                page: page + '',
                pageNum: pageNum + '',
                uuid: uuid
            }

            if (user.id) {
                data.uid = user.id
            }

            $.ajax({
                url: GET_COMMENT_LIST,
                data: data,
                dataType: 'jsonp',
                type: 'GET',
                success: function(result) {
                    if (!result.state.err) {
                        context.cache = result.data;
                        context.renderCommentList(context.cache);
                        context.renderPage(Math.ceil(context.cache.total / pageNum), page);
                    }
                }
            });
        },
        renderCommentList: function(cache) {
            var list = [];

            if (cache.curPageList.length === 0) {
                $('.comment-list-content').html('<div class="comment-empty"></div>');
                return;
            }

            for (var i = 0; i < cache.curPageList.length; i++) {
                var element = cache.curPageList[i];

                if (cache.content[element].refID !== 0 && cache.content[element].refID!=='0') {
                    cache.content[element].replyCon = cache.content[cache.content[element].refID].content;
                    cache.content[element].replyName = cache.content[cache.content[element].refID].uname;
                }

                list[i] = cache.content[element];
            }

            $('.comment-list-content').html(juicer(tpl.commentItem, {list: list}));
        },
        renderPage: function(pages, curPage) {
            $('.comment-page').html(pagination.render(pages, curPage));
        },
        postComment: function(options) {
            var context = this;
            var content = $.trim($('.comment-content-textarea').val());

            if (content === '') {
                tip.info('请填写评论内容');
            } else {
                var data = {
                    content: content,
                    iframeCross: 1,
                    uuid: this.options.uuid
                }

                if (this.replyId !== 0) {
                    data.refID = this.replyId;
                }

                new ajaxform({
                    url: POST_COMMENT,
                    data: data,
                    success: function(result) {
                        if (result.code === 0) {
                            context.getCommentList(1, options.pageNum, options.uuid);
                            $('.comment-content-textarea').val('');
                            tip.success('评论成功！');
                            context.replyId = 0;
                        } else {
                            tip.info(result.description);
                        }
                    }
                });
            }
        }
    };

    module.exports = Comment;
});
