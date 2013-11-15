var d3 = require('d3'),
    Nav = require('./nav.js'),
    Announcement = require('./announcement.js'),
    NewsPage = require('./news-page.js'),
    FilterNews = require('./filter-news.js'),
    Marketing = require('./marketing.js'),
    Slider = require('./slider.js'),
    Ticker = require('./ticker.js'),
    TweetFeed = require('./toots.js');

// all pages
var nav = Nav()
    .container(d3.select('.main-nav-container'))
    .toggleMobile(d3.select('.mobile-logo'))
    .mobileHiddenClass('mobile-hidden')
    .blanket(d3.select('.blanket'))
    .blanketClass('blanketed')
    .scrollDistanceHideMobile(100)
    .setup();


var body_el = d3.select('body');

if (body_el.classed('narrative-page')) {

    var announcement = Announcement()
        .wrapper(d3.select('body > div.wrapper'))
        .setup();

    var form_wrapper_el = d3.select('#form-wrapper'),
        form_el = form_wrapper_el.select('form'),
        server_error_el = form_el.select('.server-error'),
        thank_you_el = form_wrapper_el.select('.thank-you');

    var marketing = Marketing()
        .el(form_el)
        .wrapperEl(form_wrapper_el)
        .serverErrorEl(server_error_el)
        .thankYouEl(thank_you_el)
        .initialize();


    var slider = Slider()
        .cssAttr('margin-top')
        .distance(370)
        .buttonPrevEl(d3.select('.news-ticker-controls .nav-up'))
        .buttonNextEl(d3.select('.news-ticker-controls .nav-down'));

    var ticker = Ticker()
        .el(d3.select('#news-ticker-wrapper > .news-ticker'))
        .slider(slider)
        .setup();

    var tweet_feed = TweetFeed()
        .el(d3.select('#twitter-feed'))
        .setup();
}

if (body_el.classed('news-page')) {

    var news_page = NewsPage()
        .el(d3.select('.wrapper'))
        .loading('.loading');

    var filter = FilterNews()
        .el(d3.select('nav.filters ul'));

    if (window.location.hash) {
        // load just the article
        news_page.hash(window.location.hash.split("#")[1]);
        filter.hidden(true);

        // otherwise, the entire page will start loaded
    }

    news_page.filter(filter)
             .setup();
    filter.page(news_page)
          .setup();
}