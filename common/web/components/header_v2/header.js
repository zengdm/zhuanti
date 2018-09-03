define(function(require, exports, module) {

    'use strict';

    var tpl = require('./header-c16f59d8fd.tpl');

    var GET_PLACEHOLDER = 'http://car.diandong.com/api/getSectionData?sectionid=296';
    var AJAX_SEARCH_URL = 'http://car.diandong.com/api/chexi_fuzzysearch';

    var Header = function() {
        this.init();
    };

    Header.prototype = {
        elements: {
            searchBar: $('.search-panel-input'),
            searchBtn: $('.j-submit-search'),
            suggestDialog: $('<div class="search-suggest-list"></div>')
        },
        init: function() {
            // this.renderPlaceholder();
            this.bindEvent();
        },
        bindEvent: function() {
            var context = this;

            this.elements.searchBar.on('keyup', function(e) {
                var self = $(e.target);
                var value = self.val();

                context.getSuggest(value);

                if (e.keyCode === 13) {
                    context.elements.searchBtn.trigger('click');
                }
            });

            $(document).on('click', function(e) {
                if ($(e.target).attr('id') !== 'header-search') {
                    context.hideSuggest();
                }
            });

            this.elements.searchBtn.on('click', function() {
                var value = context.elements.searchBar.val() || context.elements.searchBar.attr('placeholder');

                window.open('http://search.diandong.com/zonghe/?words=' + value);
            });
        },
        // renderPlaceholder: function() {
        //     var context = this;

        //     $.ajax({
        //         url: GET_PLACEHOLDER,
        //         data: {},
        //         dataType: 'jsonp',
        //         type: 'GET',
        //         success: function(result) {
        //             context.elements.searchBar.attr('placeholder', (result.data[0].title || ''));
        //         }
        //     });
        // },
        getSuggest: function(value) {
            var context = this;

            $.ajax({
                url: AJAX_SEARCH_URL,
                data: {
                    keywords: value
                },
                dataType: 'jsonp',
                type: 'GET',
                success: function(data) {
                    if (data.state.err) {
                        context.hideSuggest();
                    } else {
                        context.renderSuggest(data.data);
                    }
                }
            });
        },
        renderSuggest: function(json) {
            var suggestHtml = juicer(tpl.suggest, {
                list: json
            });

            this.elements.suggestDialog.html(suggestHtml).appendTo(document.body);
            this.showSuggest();
        },
        showSuggest: function() {
            var offset = this.elements.searchBar.offset();

            this.elements.searchBar.addClass('focus');
            this.elements.suggestDialog.css({
                "top": offset.top + 40,
                "left": offset.left
            });
        },
        hideSuggest: function() {
            this.elements.searchBar.removeClass('focus');
            this.elements.suggestDialog.remove();
        }
    };

    module.exports = Header;
});
