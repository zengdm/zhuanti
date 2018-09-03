define(function(require, exports, module) {
    'use strict';
    var commentForm = '<div class="comment-form"></div>';
    var commentFormCover = '<div class="comment-form-cover"><a href="http://passport.diandong.com/ark/login/?redirect=${redirect}"><p>要登录才能评论呦！现在<span>登录</span></p></a></div>';
    var comFormContent = '<div class="comment-form-content"></div>';
    var articleCommentForm = '<form action="" class="comment-form-box fn-hide"><div class="comment-form-textarea"><textarea placeholder="说点什么..." name="name" class="comment-content-textarea"></textarea></div><div class="comment-form-footer"><a href="javascript:;" class="comment-submit-btn j-submit-comment fn-right">评论</a></div></form>';
    var commentMore = '<div class="comment-more"><a href="javascript:;"  class="comment-more-btn">查看更多评论</a><a class="comment-more-icon fn-right">写评论</a></div><div class="comment-none fn-hide">已经全部看完啦</div> <div class="comment-empty fn-hide"></div>';
    var totalNumSpan = '<span></span>';
     $('.article-comment-header h3').append(totalNumSpan);
    $('.article-comment-header').wrap(comFormContent);
    $('.article-comment-header').after(articleCommentForm);
    $('.comment-form-content').before(commentFormCover);
    $('.comment-holder').append(commentMore);

    require('./comment.css');
    var user = require('user');
    var tip = require('tip');
    var cookie = require('cookie');
    user.id = 5;
    user.avatar = 'http://i2.dd-img.com/assets/image/1525764782-eec34b1f80e68382-512w-512h.png'
    user.nickname = '付亚莉';
    // console.log(user)
    var obj = {
        wordNum: 100,
        replyFlag: true,
        page: 1,
        tipComment: '评论成功！',
        tipPraise: '点赞成功！',
        tipPraised: '您已经点过赞啦!',
        tipMsg: '请输入内容！',
        tipLogin: '请先登录哦'
    }
    var Comment,
        replyList,
        replyid,
        replyidAdd,
        replyName,
        fhN;

    var GET_COMMENT_LIST = 'http://item.dd-img.com/es/comment';
    var POST_COMMENT = 'http://item.diandong.com/es/comment/add';
    var LIKE_COMMENT = 'http://item.dd-img.com/es/comment/supports';



    if (user.id) {
        $('.comment-form-box').removeClass('fn-hide');
        $('.comment-form-cover').addClass('fn-hide');
    }
    var article = {
        args: {
            sourceid: 0,
            platid: 0,
            container: '.comment-holder'
        },
        init: function(args) {
            if(args && typeof(args.sourceid)!='undefined' && typeof(args.platid)!='undefined') {
                // 已传参, 赋值
                this.args = args;
            } else {
                // 未传参,通过地址获取
                this.parseInit();
            }

            // 根据参数加载评论，否则不加载
            if (this.args.sourceid>0 && this.args.platid>0 && this.args.container && $(this.args.container).length) {
                console.log('comment args', this.args);
                // this.args.sourceid = 234232;
                this.bindEvent();
                this.getComment(obj.page);
            }
        },

        // 对pc或移动页面通过地址获取contentid，适用于资讯详情页和视频详情页
        parseInit: function() {
            var host = window.location.host;
            if (host == 'www.diandong.com' || host=='m.diandong.com') {
                var paths = window.location.pathname.split('/');
                var len = paths.length;
                var filename = paths[len-1];
                var end = filename.indexOf('.');
                this.args.sourceid = filename.slice(8, end);
                this.args.platid = 5;
            }
        },
        getComment: function(page) {
            var that = this;
            $.ajax({
                url: GET_COMMENT_LIST,
                data: {
                    sourceid: that.args.sourceid,
                    platid: that.args.platid,
                    page: page
                },
                type: 'GET',
                success: function(res) {
                    if (res.code == 0) {
                        $('.article-comment-header').find('span').html('(' + res.data.total + ')');
                        var data = res.data.reply;
                        if (!data.length && page == 1) {
                            $('.comment-none').addClass('fn-hide');
                            $('.comment-more-btn').addClass('fn-hide');
                            $('.comment-empty').removeClass('fn-hide');
                        }
                        else if(data.length < 10) {
                            $('.comment-none').addClass('fn-hide');
                            $('.comment-more-btn').addClass('fn-hide');
                        }
                        else if (!data.length && page > 1) {
                            $('.comment-none').addClass('fn-hide');
                            $('.comment-more-btn').addClass('fn-hide');
                            $('.comment-none').removeClass('fn-hide');
                        }

                        data.forEach(function(ele, i) {
                            var opt = {
                                'commentCon': ele.content,
                                'avatar': ele.avatar,
                                'author': ele.author,
                                'showTime': ele.showTime,
                                'replyid': ele.replyid,
                                'supports': ele.supports
                            };
                            var getComment = that.commentHtml(opt);
                            $('.comment-more').before(getComment);
                            if (ele.reply) {
                                ele.reply.forEach(function(eles, idx) {
                                    var index = i;
                                    if (!eles.reply_author) {
                                        eles.reply_author = '：';
                                    } else {
                                        eles.reply_author = '回复 ' + eles.reply_author + ' : '
                                    };
                                    var opts = {
                                        'author': eles.author,
                                        'replyCon': eles.content,
                                        'replyName': ele.author,
                                        'reply_author': eles.reply_author,
                                        'replyid': eles.replyid
                                    }
                                    var replyComment = that.replyHtml(opts);
                                    var index = i;
                                    if (page != 1) index = (page - 1) * 10 + i;
                                    var cyl = $('.comment-reply-list').eq(index);
                                    cyl.find('.reply-list-more').before(replyComment);
                                    if (ele.reply.length > 4) {
                                        var replyListCon = cyl.find('.comment-quote');
                                        var sliceReply = replyListCon.slice(4);
                                        sliceReply.addClass('fn-hide')
                                        cyl.find('.reply-list-more').removeClass('fn-hide');
                                        cyl.on('click', '.reply-list-more', function() {
                                            replyListCon.removeClass('fn-hide');
                                            $(this).addClass('fn-hide')
                                        })
                                    }

                                });

                            }

                        })
                        $('.comment-list-content').each(function(idx, ele) {
                            var index = idx;
                            var cookieRep = 'rep' + user.id + that.args.sourceid + $(ele).data('replyid');
                            if (cookie.get(cookieRep)) {
                                $('.comment-list-content').eq(index).find('.comment-like-btn i').addClass('comment-praise')
                                $('.comment-list-content').eq(index).find('.comment-like-btn span').addClass('comment-praise')
                            }

                        });
                    }

                }
            });
        },
        commentHtml: function(opt) {
            var commentHtml = '<div class="comment-list-content" data-replyid="' + opt.replyid + '"><div class="comment-item"><header class="comment-item-header"><div class="comment-user fn-left clearfix"><div class="comment-user-avatar fn-left"><img src="' + opt.avatar + '" alt=""></div><div class="comment-user-info fn-left"><div class="comment-item-user">' + opt.author + '</div><div class="comment-item-time">' + opt.showTime + '</div></div></div><a href="javascript:;" class="comment-like-btn j-like-comment fn-right"><i class="icon">&#xe649;</i><span>' + opt.supports + '</span></a><a href="javascript:;" class="comment-reply-btn j-reply-comment fn-right" >回复</a></header><div class="comment-item-content"><p class="comment-item-con">' + opt.commentCon + '</p><div class="comment-reply-list"><div class="reply-list-more fn-hide">查看全部回复></div></div></div></div></div>';
            return commentHtml;
        },
        replyHtml: function(opt) {
            var replyComment = '<p class="comment-quote" data-replyidcom="' + opt.replyid + '"><span class="reply-list-name">' + opt.author + '</span> <span class="reply-list-replyname">' + opt.reply_author + '</span>' + opt.replyCon + ' <span class="reply-list-btn comment-reply-btn">回复</span></p>';
            return replyComment;
        },
        word: function(parent, opt, remain) {

            $(parent).on('keyup', $(opt), function(e) {
                var val = $.trim($(this).find(opt).val());
                var replyVal;

                // 如果是回复
                if ($(this).find(opt).hasClass('comment-reply-textarea')) {
                    replyVal = val.split(':')[0];
                    val = val.substr(replyVal.length + 1);
                    if (e.keyCode == 8) {
                        if (!val) {
                            $(this).find(opt).val(fhN);
                            tip.info('直接输入内容就可以啦！');
                            return;
                        }
                    }

                };
                if (remain) {
                    remain = obj.wordNum - val.length;
                    if (remain <= 0) remain = 0;
                    $(this).find('.reply-word').html(remain)
                }

                if (val.length >= obj.wordNum) {
                    var keyWord = val.substr(0, obj.wordNum);
                    if (replyVal) {
                        $(this).find(opt).val(replyVal + ':' + keyWord)
                    } else {
                        $(this).find(opt).val(keyWord);
                    }

                }

            })
            document.oncontextmenu = function() {
                return false
            }; 

        },
        nowTime: function() {
            var myDate = new Date();
            //获取当前年
            var year = myDate.getFullYear();
            //获取当前月
            var month = myDate.getMonth() + 1;
            //获取当前日
            var date = myDate.getDate();
            var h = myDate.getHours(); //获取当前小时数(0-23)
            var m = myDate.getMinutes(); //获取当前分钟数(0-59)
            if (m < 10) m = '0' + m;
            var s = myDate.getSeconds();
            if (s < 10) s = '0' + s;
            var postDate = year + '-' + month + "-" + date + " " + h + ':' + m + ":" + s;
            return postDate;
        },
        bindEvent: function() {
            var that = this;
            that.word('.comment-form-content', '.comment-content-textarea');
            // 点击评论
            $('.comment-submit-btn').on('click', function() {
                if (!user.id) {
                    tip.info(obj.tipLogin)
                    return false;
                }
                var self = this;
                $('.comment-empty').addClass('fn-hide');
                var nowTime = that.nowTime();
                var commentCon = $.trim($('.comment-content-textarea').val())
                if (!commentCon) {
                    tip.info(obj.tipMsg);
                    return;
                };

                var opt = {
                    sourceid: that.args.sourceid,
                    platid: that.args.platid,
                    content: commentCon,
                    commentCon: commentCon,
                    authorid: user.id,
                    author: user.nickname,
                    avatar: user.avatar,
                    showTime: nowTime,
                    supports: 0
                }
                $.ajax({
                    url: POST_COMMENT,
                    data: opt,
                    type: 'GET',
                    success: function(res) {
                        if (res.code == 0) {
                            var totalComNum = $('.article-comment-header').find('span').html();
                            totalComNum = parseInt(totalComNum.substring(1, totalComNum.length - 1));
                            totalComNum += 1;
                            opt.replyid = res.data.replyid;
                            var commentAppend = that.commentHtml(opt);
                            $('.comment-holder').prepend(commentAppend);
                            $('.comment-content-textarea').val('');
                            $('.article-comment-header').find('span').html('(' + totalComNum + ')');
                            tip.success(obj.tipComment);


                        } else {
                            tip.info(res.message);
                        }
                    },
                    beforeSend: function() {
                        $(self).attr({
                            disabled: "true"
                        });
                        $(self).css("pointer-events", "none");
                    },
                    complete: function() {
                        $(self).removeAttr("disabled");
                        $(self).css("pointer-events", "auto");
                    }
                })

            });

            //点击回复
            $('.comment-holder').on('click', '.comment-reply-btn', function(e) {
                if (!user.id) {
                    tip.info(obj.tipLogin)
                    return false;
                }
                var replyListCon = $(this).parents('.comment-list-content');
                that.word('.comment-list-content', '.comment-reply-textarea', obj.wordNum);
                e.stopPropagation();
                $(".reply-form").addClass('fn-hide');
                $(document).click(function() {
                    $(".reply-form").addClass('fn-hide');
                })
                $(".comment-holder").on('click', '.reply-form', function(ev) {
                    $(this).removeClass('fn-hide');
                    ev.stopPropagation();
                })

                if ($(this).hasClass('j-reply-comment')) {
                    // 一级回复
                    obj.replyFlag = true;
                    replyid = replyListCon.data('replyid');
                    if (replyid == 'undefined') {
                        replyid = replyidAdd;
                    }

                    replyName = replyListCon.find('.comment-item-user').html();
                } else {
                    obj.replyFlag = false;
                    replyid = $(this).parent().data('replyidcom');
                    if (!replyid) {
                        replyid = replyidAdd;
                    }
                    replyName = $(this).parent().find('.reply-list-name').html();
                }
                var replyTextarea = '<form action="" class="clearfix reply-form"><textarea name="reply-textarea" placeholder="发表回复内容..." class="comment-reply-textarea fn-left"></textarea><span class="reply-word"></span><span class="fn-left reply-submit">发表</span></form>';

                replyList = replyListCon.find('.comment-reply-list');
                var replyListForm = replyListCon.find('.comment-item-content');
                var replyFormHide = replyListForm.find('.reply-form');
                if (!replyFormHide.length) {
                    replyListForm.append(replyTextarea);
                }
                replyListCon.find('.reply-form').removeClass('fn-hide');
                replyName = replyName.split(":")[0];
                fhN = '回复 ' + replyName + ':';
                replyListCon.find('.reply-word').html(obj.wordNum);
                $('.comment-reply-textarea').val(fhN);


            });
            // 点击发表
            $('.comment-holder').on('click', '.reply-submit', function(e) {
                var self = this;
                var textarea = $(this).parent().find('.comment-reply-textarea')
                var repVal = $.trim(textarea.val());
                var replyFormKong = repVal.split(':')[0];

                var replyFormIsKong = repVal.substr(replyFormKong.length + 1);
                var authorNames;
                if (!replyFormIsKong) {
                    tip.info(obj.tipMsg);
                    return;
                }
                $(".reply-form").addClass('fn-hide');
                e.stopPropagation();
                var replyCommentCon = replyFormIsKong;

                $('.reply-form').addClass('fn-hide');
                // 判断是否是一级回复
                if (obj.replyFlag) {
                    fhN = '';
                    authorNames = user.nickname + ' : ';
                } else {
                    authorNames = user.nickname;
                }
                var opt = {
                    sourceid: that.args.sourceid,
                    platid: that.args.platid,
                    content: replyCommentCon,
                    replyCon: replyFormIsKong,
                    authorid: user.id,
                    author: authorNames,
                    avatar: user.avatar,
                    replyid: replyid,
                    reply_author: fhN
                }
                $.ajax({
                    url: POST_COMMENT,
                    data: opt,
                    type: 'GET',
                    success: function(res) {
                        if (res.code == 0) {
                            opt.replyid = res.data.replyid;
                            var replyAppend = that.replyHtml(opt);
                            replyList.append(replyAppend);
                            var replyMore = $(self).parents('.comment-list-content')
                            replyMore.find('.reply-list-more').addClass('fn-hide');
                            replyMore.find('.comment-quote').removeClass('fn-hide');
                            textarea.val('');
                            tip.success(obj.tipComment);


                        } else {
                            tip.info(res.message);
                        }
                    },
                    beforeSend: function() {
                        $(self).attr({
                            disabled: "true"
                        });
                        $(self).css("pointer-events", "none");
                    },
                    complete: function() {
                        $(self).removeAttr("disabled")
                        $(self).css("pointer-events", "auto");
                    }
                })

            });
            // 评论点赞
            $('.comment-holder').on('click', '.comment-like-btn', function() {
                if (!user.id) {
                    tip.info(obj.tipLogin)
                    return false;
                }
                var self = this;
                var replyids = $(this).parents('.comment-list-content').data('replyid');
                if (replyids == 'undefined') {
                    replyid = replyidAdd
                } else {
                    replyid = replyids;
                }
                if ($(self).find('i').hasClass('comment-praise')) {
                    tip.info(obj.tipPraised);
                    return false;
                }
                cookie.set('rep' + user.id + that.args.sourceid + replyid, 'true', {
                    expires: 30,
                    path: '/',
                    domain: '.diandong.com'
                });

                $.ajax({
                    url: LIKE_COMMENT,
                    data: {
                        sourceid: that.args.sourceid,
                        platid: that.args.platid,
                        authorid: user.id,
                        replyid: replyid
                    },
                    type: 'GET',
                    success: function(res) {
                        console.log(res)
                        if (res.code == 0) {
                            $(self).find('i').addClass('comment-praise');
                            $(self).find('span').addClass('comment-praise');
                            var praiseNum = parseInt($(self).find('span').html());
                            $(self).find('span').html(praiseNum + 1)
                            tip.success(obj.tipPraise);
                        } else {
                            tip.info(res.message);
                        }
                    }
                })

            });

            // 写评论
            $('.comment-more').on('click', '.comment-more-icon', function() {
                if (!user.id) {
                    tip.info(obj.tipLogin);
                    return false;
                }
                $('.comment-content-textarea').focus();
            });

            // 点击查看更多
            $('.comment-more-btn').on('click', function() {
                obj.page++;
                that.getComment(obj.page);
            })

        }

    }

    module.exports = article;

})