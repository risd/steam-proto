var TweetFeed = function () {
    var feed = {},
        tweets = [],
        tweet_sel,
        position = 0,      // position in the array of the current tweet
        paused = false,
        rotation_interval,
        el;

    feed.el = function (x) {
        if (!arguments.length) return el;
        el = x;
        return feed;
    };

    feed.setup = function () {
        d3.json(STEAM.api.hash_tweet, function (toots) {
            if (DEBUG) console.log('Tweets loaded');
            if (DEBUG) console.log(toots);

            tweets = toots.objects;

            add_to_dom();

            start_cycle();
        });

        return feed;
    };

    feed.maybe_pause_cycle = function () {
        // check status against the page 
        if ((!paused) &&
            (d3.select('#twitter-feed .active')
                .node()
                .getBoundingClientRect()
                .top < 0)) {

            console.log('pausing');
            pause_cycle();
            paused = true;
            return;

        } else if ((paused) &&
                   (d3.select('#twitter-feed .active')
                       .node()
                       .getBoundingClientRect()
                       .top > 0)) {

            console.log('starting');
            start_cycle();
            paused = false;
            return;
        }

    };

    function start_cycle () {
        rotation_interval = setInterval(rotate, 5000);
    }
    function pause_cycle () {
        clearInterval(rotation_interval);
    }

    function add_to_dom () {
        tweet_sel = el.selectAll('.single-tweet')
            .data(tweets)
            .enter()
            .insert('div', '.single-tweet-controls')
            .attr('class', function (d, i) {
                var extra = '';
                if (i === position) {
                    extra = ' active';
                }
                return 'single-tweet four-column offset-one' + extra;
            })
            .call(add_tweet)
            .call(add_user);
    }

    function add_tweet (sel) {
        sel.append('p')
            .attr('class', 'tweet')
            .html(function (d) {
                return d.html;
            });
    }

    function add_user (sel) {
        sel.append('p')
            .attr('class', 'tweet-data')
            .html(function (d) {
                if (d.user !== d.screen_name) {
                    return d.user + ' @' + d.screen_name;
                }
                return '@' + d.screen_name;
            });
    }

    function rotate() {
        position += 1;
        if (position >= tweets.length) {
            position = 0;
        }
        tweet_sel.each(function (n, i) {
            d3.select(this)
                .classed('active', i === position);
        });
    }

    return feed;
};

var twitter_feed_el = d3.select('#twitter-feed');

// setup rotating tweets on home page
if (twitter_feed_el[0][0]) {

    var tweet_feed = TweetFeed()
                    .el(twitter_feed_el)
                    .setup();
    d3.select(window)
        .on('scroll', tweet_feed.maybe_pause_cycle);
}