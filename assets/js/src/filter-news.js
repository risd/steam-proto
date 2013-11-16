var d3 = require('d3');

var FilterNews = function () {
    // Adds filters to the page
    // And allows you to use them
    // to determine what content
    // you want to seet.
    // Disable on permalinked pages.

    var filter = {},
        data = [
            {
                type: 'event',
                active: 0
            }, {
                type: 'tweet',
                active: 0
            }, {
                type: 'feature',
                active: 0
            }
        ],
        page,        // ref to news page
        hidden = 0,  // binary, are the filters showing or not?
        el;

    filter.el = function (x) {
        if (!arguments.length) return el;
        el = x;
        return filter;
    };

    filter.data = function (x) {
        if (!arguments.length) return data;
        data = x;
        return filter;
    };

    filter.hidden = function (x) {
        if (!arguments.length) return hidden;

        hidden = x;

        // set the state
        el.classed('hidden', hidden);

        return filter;
    };

    filter.page = function (x) {
        if (!arguments.length) return page;
        page = x;
        return filter;
    };

    filter.setup = function () {
        el.selectAll('.filter')
            .data(data)
            .enter()
            .append('li')
            .attr('class', function (d) {
                var extra = '';
                if (hidden) {
                    extra = ' hidden';
                }
                return 'filter ' + d.type + extra;
            })
            .append('a')
            .attr('href', '')
            .text(function (d) {
                return d.type + 's';
            })
            .on('click', function (d) {
                d3.event.preventDefault();

                if (d.active === 1) {
                    // already active, do nothing
                    return;
                }

                // set active state
                for (var i = 0; i < data.length; i++) {
                    if (d.type === data[i].type) {
                        // this one was just clicked

                        data[i].active = 1;
                        el.select('.filter.' + data[i].type)
                            .classed('active', true);
                    } else {
                        // these filter are now disabled

                        data[i].active = 0;
                        el.select('.filter.' + data[i].type)
                            .classed('active', false);
                    }
                }
                // set the active one, active
                d.active = 1;

                if (page) {
                    page.apply_filter()
                        .maybe_fetch();
                }
            });
        return filter;
    };

    return filter;
};

module.exports = FilterNews;