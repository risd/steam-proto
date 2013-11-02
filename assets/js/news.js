var NewsPage = function () {
    var page = {},
        news = [],
        el;

    page.el = function (x) {
        if (!arguments.length) return el;
        el = x;
        return page;
    };

    page.setup = function () {
        d3.json(STEAM.api.news, function (api_news) {
            if (DEBUG) console.log('News loaded');
            if (DEBUG) console.log(api_news);

            news = api_news.objects;

            add_to_dom();
        });

        return page;
    };

    function add_to_dom () {
        el.selectAll('.content')
            .data(news)
            .enter()
            .append('section')
            .attr('class', function (d) {
                var type;
                if (d.tweet) {
                    type ='tweet';
                }
                if (d.tumbl) {
                    type = 'tumbl';
                }

                return 'content ' + type;
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

var filter_el = d3.select('nav.filters');

// setup news page
if (filter_el[0][0]) {

    // TODO hook up filters
    var filter_data = [
        {
            type: 'events',
            active: 1
        }, {
            type: 'tweets',
            active: 1
        }, {
            type: 'features',
            active: 1
        }
    ];

    var news_el = d3.select('.wrapper');

    var news_page = NewsPage()
                    .el(news_el)
                    .setup();
}