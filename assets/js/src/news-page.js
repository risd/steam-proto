var d3 = require('d3');

var NewsPage = function () {
    var page = {},
        news = [],
        filter,       // ref to filter state
        el,
        loading_html, // what the loading div should contain
        hash,         // cur hash of page
        fetching,     // state: is server call being made?
        total_count,  // total count from the server
        next_uri;     // the uri to hit next time around

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

    page.loading = function (x) {
        if (!arguments.length) return loading_html;
        loading_html = d3.select(x).html();
        return page;
    };

    page.hash = function (x) {
        if (!arguments.length) return hash;
        hash = x;
        return page;
    };

    page.apply_filter = function () {
        // add .hidden class to those that are not active
        var scroll_flag = false;

        el.selectAll('.content')
            .classed('hidden', function (d) {
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

    page.setup = function () {
        if (hash) {
            // load just the single article
            d3.json(STEAM.api.news(hash), function (api_news) {
                news = [];
                news.push(api_news);
                render_dom();
            });
        } else {
            d3.json(STEAM.api.news(), add_sort);

            // initiate infinite scroll
            d3.select(window)
                .on('scroll', maybe_fetch)
                .on('resize', maybe_fetch);
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

    function maybe_fetch () {
        if ((!fetching) &&
            (next_uri) &&
            (d3.select('.loading').node().getBoundingClientRect().top <
                window.innerHeight)) {

            fetch();
        }
    }
    page.maybe_fetch = maybe_fetch;

    function fetch () {
        console.log('fetching');
        fetching = true;
        d3.json(STEAM.url(next_uri), add_sort);
    }

    function add_sort (error, api_news) {
        fetching = false;

        if (DEBUG) console.log('News loaded');
        console.log(api_news);

        if ((!('objects' in api_news)) || !api_news.objects.length) {
            console.log('Could not get more data.');
            return;
        }

        total_count = api_news.meta.total_count;
        next_uri = api_news.meta.next;

        var sorted_news = api_news.objects.sort(function (a, b) {
            return b.epoch_timestamp - a.epoch_timestamp;
        });

        // add news to the dom
        sorted_news.forEach(function (d, i) {
            news.push(d);
        });

        render_dom();
    }

    function render_dom () {
        el.selectAll('.loading')
            .data([])
            .exit()
            .remove();

        // add new stuff
        el.selectAll('.content')
            .data(news, function (d) { return d.id; })
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


                // apply the filter that is currently on the page
                var hidden = '';
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

                        if (active_filters.indexOf(d.type) === -1) {
                            hidden = ' hidden';
                        }
                    }
                }


                return 'content active ' + type + hidden;
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

            })
            .call(add_links);

        if (next_uri) {
            el.selectAll('.loading')
                .data([1])
                .enter()
                .append('div')
                .attr('class', 'loading')
                .html(loading_html);
        }
    }


    function add_links (sel) {

        sel.each(function (d, i) {
            var that = d3.select(this);
            
            that
                .selectAll('.icon.twitter')
                .append('a')
                .attr('href', function () {
                    var path = steam_url(d);
                    
                    return 'http://twitter.com/intent/tweet?url=' +
                            encodeURIComponent(path);
                })
                .attr('target', '_blank');

            that
                .selectAll('.icon.facebook')
                .append('a')
                .attr('href', function () {
                    var path = steam_url(d);

                    return 'https://www.facebook.com/sharer/sharer.php?u=' +
                            encodeURIComponent(path);
                })
                .attr('target', '_blank');

            that
                .selectAll('.icon.permalink')
                .append('a')
                .attr('href', function () {
                    return steam_url(d);
                })
                .on('click', function () {
                    d3.event.preventDefault();

                    var parent_el = d3.select(d3.select(this)[0][0].parentNode);
                    var input_el = parent_el.select('input');

                    if (input_el.classed('hidden')) {
                        input_el.classed('hidden', false);
                        input_el[0][0].select();
                    } else {
                        input_el.classed('hidden', true);
                    }
                });

            that
                .selectAll('.icon.permalink')
                .append('input')
                .attr('type', 'text')
                .attr('class', 'hidden')
                .on('click', function () {
                    d3.event.preventDefault();
                })
                .attr('value', function () {
                    return steam_url(d);
                });
        });
    }

    function steam_url (d) {
        var path;
        if( d.tumbl) {
            path = window.location.href.split("#")[0] +
                    '#' + d.id + '-' + d.tumbl.steam_url;
        } else {
            path = "https://twitter.com/" +
                   d.tweet.screen_name +
                   '/status/' +
                   d.tweet.tid;
        }
        return path;
    }

    return page;
};

module.exports = NewsPage;