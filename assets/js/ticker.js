var Slider = function () {
    // slides by changing margin-top or margin-left
    // of the `el_to_slide` dom element.
    // all elements must be the same height or width.
    var slider = {},
        css_attr = 'margin-top',  // defaults to vertical adjustment
        position = 0,             // current position in array
        length = 0,               // possible positions
        el_to_slide,              // the el whose css_attr to adjust
        distance,                 // the distance to adjust per click
        button_prev_el,
        button_next_el;

    slider.buttonPrevEl = function (x) {
        if (!arguments.length) return button_prev_el;
        button_prev_el = x;
        button_prev_el.on('click', show_prev);

        return slider;
    };

    slider.buttonNextEl = function (x) {
        if (!arguments.length) return button_next_el;
        button_next_el = x;
        button_next_el.on('click', show_next);

        return slider;
    };

    slider.toSlide = function (x) {
        if (!arguments.length) return el_to_slide;
        el_to_slide = x;
        return slider;
    };

    slider.cssAttr = function (x) {
        if (!arguments.length) return css_attr;
        css_attr = x;
        return slider;
    };

    slider.length = function (x) {
        if (!arguments.length) return length;
        length = x;
        return slider;
    };

    slider.distance = function (x) {
        if (!arguments.length) return distance;
        distance = x;
        return slider;
    };

    function show_next (event) {
        button_prev_el.classed('hidden', false);

        position += 1;
        if (position >= length) {
            position = length;
            button_next_el.classed('hidden', true);
        }

        el_to_slide.style(css_attr, -(position * distance) + 'px');
    }

    function show_prev (event) {
        button_next_el.classed('hidden', false);

        position -= 1;
        if (position <= 0) {
            position = 0;
            button_prev_el.classed('hidden', true);
        }

        el_to_slide.style(css_attr, -(position * distance) + 'px');
    }

    return slider;
};

var Ticker = function () {
    var ticker = {},
        news = [],
        slider,
        el;

    ticker.el = function (x) {
        if (!arguments.length) return el;
        el = x;
        return ticker;
    };

    ticker.slider = function (x) {
        if (!arguments.length) return slider;
        slider = x;
        return ticker;
    };

    ticker.setup = function () {
        d3.json(STEAM.api.tumbl, function (tumbls) {
            if (DEBUG) console.log('Tumbls loaded');
            if (DEBUG) console.log(tumbls);

            news = tumbls.objects.sort(function (a, b) {
                return b.epoch_timestamp - a.epoch_timestamp;
            });

            add_to_dom();

            // setup the slider
            slider.length(news.length-1)
                  .toSlide(d3.select('.news-post:first-child'));
        });

        return ticker;
    };

    function add_to_dom () {
        el.selectAll('.news-post')
            .data(news)
            .enter()
            .insert('article', '.news-ticker-controls')
            .attr('class', 'news-post')
            .on('click', function (d) {
                console.log('article clicked!');
                // go to the story
                var path = '/news/#' + d.steam_url;
                window.location.href = window.STEAM.url(path);
            })
            .call(add_title)
            .call(add_date);
    }

    function add_title (sel) {
        sel.append('h3')
            .text(function (d) {
                return d.title;
            });
    }

    function add_date (sel) {
        sel.append('p')
            .attr('class', 'date')
            .text(function (d) {
                return d.ticker_timestamp;
            });
    }

    return ticker;
};

var news_ticker_el = d3.select('#news-ticker-wrapper > .news-ticker');

// setup ticker on the home page page
if (news_ticker_el[0][0]) {
    var slider = Slider()
                    .cssAttr('margin-top')
                    .distance(370)
                    .buttonPrevEl(d3.select('.news-ticker-controls .nav-up'))
                    .buttonNextEl(d3.select('.news-ticker-controls .nav-down'));

    var ticker = Ticker()
                    .el(news_ticker_el)
                    .slider(slider)
                    .setup();
}