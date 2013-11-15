var d3 = require('d3');

var Lettering = function () {

    function lettering (el) {
        var lettered = '';

        el.text().split('').forEach(function (d, i) {
            lettered += '<span class="char' + (i+1) + '">' +
                        d +'</span>';
        });

        el.html(lettered);
    }

    return lettering;
};

var Narrative = function () {
    var innovation_title_el = d3.select('.innovation-title');

    function narrative () {
        d3.select(window)
            .on('scroll.narrativeInnovation', function () {
                if (innovation_title_el
                        .node()
                        .getBoundingClientRect()
                        .top < 0) {
                    innovation_title_el.classed('revealed', true);

                    // remove listener. only happens once.
                    d3.select(window)
                        .on('scroll.narrativeInnovation', null);
                }
            });
    }

    return narrative;
};


var innovation_title = d3.select('.innovation-title');
if (innovation_title.node()) {

    // setes up innovation-tital
    var lettering = Lettering();
    lettering(innovation_title);

    // sets up innovation-title reveal
    var narrative = Narrative();
    narrative();
}