
// may have to restructure in order to have a place to put the announcement.
var header_el = d3.select('header.header-image');

// setup news page
if (header_el[0][0]) {
    d3.json(STEAM.api.announcement, function (err, announcement) {
        console.log(announcement);
    });
}