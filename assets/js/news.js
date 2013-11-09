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
                        filter_el.select('.filter.' + data[i].type)
                            .classed('active', true);
                    } else {
                        // these filter are now disabled

                        data[i].active = 0;
                        filter_el.select('.filter.' + data[i].type)
                            .classed('active', false);
                    }
                }
                // set the active one, active
                d.active = 1;

                if (page) {
                    page.update();
                }
            });
        return filter;
    };

    return filter;
};
var NewsPage = function () {
    var page = {},
        news = [],
        filter,     // ref to filter state
        el,
        content_sel;

    page.el = function (x) {
        if (!arguments.length) return el;
        el = x;
        return page;
    };

    page.filter = function (x) {
        if (!arguments.length) return filter;
        filter = x;
        return page;
    };

    page.hash = function (x) {
        if (!arguments.length) return hash;
        hash = x;
        return page;
    };

    page.setup = function () {
        d3.json(STEAM.api.news, function (api_news) {
            if (DEBUG) console.log('News loaded');
            if (DEBUG) console.log(api_news);

            // sort news based on time.
            news = api_news.objects.sort(function (a, b) {
                var a_time = 0,
                    b_time = 0;
                if (a.tumbl) {
                    a_time = a.tumbl.epoch_timestamp;
                } else if (a.tweet) {
                    a_time = a.tweet.epoch_timestamp;
                }
                if (b.tumbl) {
                    b_time = b.tumbl.epoch_timestamp;
                } else if (b.tweet) {
                    b_time = b.tweet.epoch_timestamp;
                }
                return b_time - a_time;
            });

            // add elements to the dom
            render_dom();
        });

        return page;
    };

    page.update = function () {
        // add .hidden class to those that are not active
        var scroll_flag = false;

        content_sel
            .classed('hidden', function (d) {
                console.log(d);
                // filters been defined?
                if (filter) {
                    var active_filters = [];
                    filter.data().forEach(function(el, index) {
                        if (el.active)  {
                            active_filters.push(el.type);
                        }
                    });

                    // active filters
                    if (active_filters.length > 0) {
                        // if one is active, others are not

                        scroll_flag = true;

                        if (active_filters.indexOf(d.type) > -1) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        // no filters active. all items are active
                        return false;
                    }
                }
                return false;
            });

        if (scroll_flag) {
            d3.transition()
                .delay(0)
                .duration(500)
                .tween('scroll', scrollTween(0));
        }

        return page;
    };

    function scrollTween(offset) {
      return function() {
        var i = d3.interpolateNumber(
                    window.pageYOffset || document.documentElement.scrollTop,
                    offset);
        return function(t) { scrollTo(0, i(t)); };
      };
    }

    function render_dom () {
        // add new stuff
        content_sel = el.selectAll('.content')
            .data(news)
            .enter()
            .append('section')
            .attr('class', function (d) {
                var type;
                if (d.tweet) {
                    type ='tweet';
                }
                if (d.tumbl) {
                    type = d.tumbl.tagged_type;
                }

                // set type in d, used to update dom
                d.type = type;

                return 'content active ' + type;
            })
            .html(function (d) {
                var type;
                if (d.tweet) {
                    type ='tweet';
                    return d[type].html;
                }
                if (d.tumbl) {
                    type = 'tumbl';
                    return d[type].steam_html;
                }

            });
    }

    return page;
};

var filter_el = d3.select('nav.filters ul');

// setup news page
if (filter_el[0][0]) {

    var news_el = d3.select('.wrapper');

    var news_page = NewsPage()
                    .el(news_el);

    var filter = FilterNews()
                    .el(filter_el);

    if (window.location.hash) {
        // load just the article
        news_page.hash(window.location.hash);
        filter.hidden(true);

        // otherwise, the entire page will start loaded
    }

    news_page.filter(filter)
             .setup();
    filter.page(news_page)
          .setup();
}