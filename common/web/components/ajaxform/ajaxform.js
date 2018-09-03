/**
 * @desc post跨域公共组件
 * @author sunyg <1169771179@qq.com>
 * @date 2015/11/09
 * @param option{data:(@object|@string), url:@string, success:@function}
 */
define(function(require, exports, module) {
    var AjaxFrom;
    AjaxFrom = function(options) {
        this.options = options;
        this.init();
    }

    AjaxFrom.prototype = {
        init: function() {
            document.domain = "diandong.com";
            this.createIframe();
        },
        createIframe: function() {
            var iframe = document.createElement('iframe'),
                name = "IFRAME_" + new Date().getTime(),
                callback = "CALLBACK_" + name,
                form = this.createForm(name, callback),
                self = this;

            window[callback] = function(res) {
                self.options.success && self.options.success(res);
                document.body.removeChild(form);
                document.body.removeChild(iframe);
            }

            iframe.style.display = "none";
            iframe.name = name;
            document.body.appendChild(iframe);
            document.body.appendChild(form);

            form.submit();
        },
        createForm: function(target, callback) {
            var form = document.createElement('form'),
                data = this.options.data || {},
                df = document.createDocumentFragment();

            form.style.display = "none";
            form.action = this.options.url;
            form.method = "post";
            form.target = target;

            if (typeof data !== "object") {
                data = this.transFormToObject(data);
            }

            data.callback = callback;

            for (var p in data) {
                var input = document.createElement('input');
                input.type = "hidden";
                input.name = p;
                input.value = data[p];

                df.appendChild(input);
            }
            form.appendChild(df);

            return form;
        },

        transFormToObject: function(str) {
            var arr = str.split('&'),
                obj = {};

            for (var i = 0; i < arr.length; i++) {
                var s = arr[i],
                    m = s.match(/(.+)=(.*)/),
                    p = m[1],
                    v = m[2];

                obj[p] = v;
            }

            return obj;
        }
    }

    module.exports = AjaxFrom;
});
