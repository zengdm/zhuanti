define(function(require, exports, module) {

    'use strict';

    exports.box = [
        '<div class="comment" id="comment">',
        '<div class="comment-form">',
        '<div class="comment-form-cover">',
        '<a href="http://passport.diandong.com/ark/login/?redirect=${redirect}">',
        '<p>要登录才能评论呦！现在<span>登录</span></p>',
        '</a>',
        '</div>',
        '<div class="comment-form-content fn-hide">',
        '<form action="">',
        '<div class="comment-form-textarea">',
        '<textarea name="name" class="comment-content-textarea"></textarea>',
        '</div>',
        '<div class="comment-form-footer">',
        '<div class="comment-user fn-left"></div>',
        '<a href="javascript:;" class="comment-submit-btn j-submit-comment fn-right">评论</a>',
        '</div>',
        '</form>',
        '</div>',
        '</div>',
        '<div class="comment-list">',
        '<div class="comment-list-content"></div>',
        '<div class="comment-page"></div>',
        '</div>',
        '</div>'
    ].join('');

    exports.user = [
        '<div class="comment-user-avatar fn-left">',
        '<img src="${avatar}" alt="">',
        '</div>',
        '<div class="comment-user-name fn-left">${name}</div>'
    ].join('');

    exports.commentItem = [
        '{@each list as item}',
        '<div class="comment-item" data-comment-id="${item.id}" data-comment-uname="${item.uname}">',
        '<header class="comment-item-header">',
        '<div class="comment-item-user fn-left">${item.uname}</div>',
        '<div class="comment-item-time fn-left">${item.created_at}</div>',
        '<a href="javascript:;" class="comment-reply-btn j-reply-comment fn-right">回复</a>',
        '<a href="javascript:;" class="comment-like-btn j-like-comment fn-right',
        '{@if item.done_up === true}',
        ' on',
        '{@/if}',
        '" data-cid="${item.id}" data-ups="${item.ups}">',
        '<i class="icon">&#xe649;</i>',
        '<span>${item.ups}</span>',
        '</a>',
        '</header>',
        '<div class="comment-item-content">',
        '<p>${item.content}</p>',
        '{@if item.refID !==0 && item.refID !=="0"}',
        '<p class="comment-quote">${item.replyName}: ${item.replyCon}</p>',
        '{@/if}',
        '</div>',
        '</div>',
        '{@/each}'
    ].join('');
});
