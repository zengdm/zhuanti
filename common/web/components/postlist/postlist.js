define(function(require, exports, module) {

    'use strict';

    require('./post.css');
    var tpl = require('./post.tpl');
    var GET_POST = 'http://bbs.diandong.com/api/api.php?ac=newpost';

    var Post = function(options) {
        this.init(options);
    };

    Post.prototype = {
        options: {
            holder: null
        },
        init: function(options) {
            var opt = options ? $.extend({}, this.options, options) : this.options;

            this.getPostList(opt.fid, opt.typeid, opt.limit, opt.holder);
        },
        getPostList: function(fid, typeid, limit, holder) {
            $.ajax({
                url: GET_POST,
                data: {
                    fid: fid,
                    typeid: typeid,
                    pageNum: limit
                },
                dataType: 'jsonp',
                type: 'GET',
                success: function(result) {
                    var json = result.data;
                    var length = json.list.length;

                    if (length > 0) {
                        var itemHtml = juicer(tpl.item, {
                            list: json.list,
                            fid: fid,
                            typeid: typeid
                        });

                        holder.html(itemHtml);
                    } else {
                        holder.html('<div class="no-post-content"></div>');
                        $('.post-list-more').hide();
                    }
                }
            });
        }
    };

    module.exports = Post;
});
