var Announcement = function () {
    var announcement = {},
        wrapper;

    var vendor = (function(p) {
        var i = -1,
            n = p.length,
            s = document.body.style;

        while (++i < n) {
            if (p[i] + "Transform" in s) {
                return "-" + p[i].toLowerCase() + "-";
            }
        }
        return "";
    })(["webkit", "ms", "Moz", "O"]);

    announcement.wrapper = function (x) {
        if (!arguments.length) return wrapper;
        wrapper = x;
        return announcement;
    };

    announcement.setup = function () {
        d3.json(STEAM.api.announcement, function (err, announcement_data) {
            console.log('Announcement loaded');
            console.log(announcement_data);

            if (err) {
                console.log('Could not get data');
                return;
            }
            if (announcement_data.meta.total_count) {
                render_dom(announcement_data.objects[0]);

                set_scroll();
            }

        });
        return announcement;
    };

    function set_scroll () {

        d3.select(window)
            .on('scroll', function () {
                if (pageYOffset < innerHeight) {
                    wrapper.style(vendor +'transform',
                                  'translate(0px, ' +
                                  pageYOffset + 'px)');
                }
            });
    }

    function render_dom (data) {
        var path = 'news/#' + data.id + '-' + data.tumbl.steam_url;

        d3.select('body')
            .append('div')
            .attr('class', 'announcement')
            .append('div')
            .attr('class', 'grid full-width clearfix')
            .append('a')
            .attr('href', window.location.href + path)
            .append('h2')
            .text(data.tumbl.title);
    }

    return announcement;
};


// may have to restructure in order to have a place to put the announcement.
var header_el = d3.select('header.header-image');

// setup news page
if (header_el[0][0]) {

    var announcement = Announcement()
                        .wrapper(d3.select('body > div.wrapper'))
                        .setup();
}