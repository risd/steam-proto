var d3 = require('d3');

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

            news = tumbls.objects;

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
                var path = 'news/#' + d.id + '-' + d.tumbl.steam_url;
                window.location.href = window.location.href + path;
            })
            .call(add_title)
            .call(add_date);
    }

    function add_title (sel) {
        sel.append('h3')
            .text(function (d) {
                return d.tumbl.title;
            });
    }

    function add_date (sel) {
        sel.append('p')
            .attr('class', 'date')
            .text(function (d) {
                return d.tumbl.ticker_timestamp;
            });
    }

    return ticker;
};

module.exports = Ticker;