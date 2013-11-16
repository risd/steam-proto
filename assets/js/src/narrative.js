var d3 = require('d3');

var Narrative = function () {
    var innovation_title_el = d3.select('.innovation-title');

    function narrative () {
        d3.select(window)
            .on('scroll.narrativeInnovation', function () {
                if (innovation_title_el
                        .node()
                        .getBoundingClientRect()
                        .top < 150) {
                    innovation_title_el.classed('revealed', true);

                    // remove listener. only happens once.
                    d3.select(window)
                        .on('scroll.narrativeInnovation', null);
                }
            });
    }

    return narrative;
};

module.exports = Narrative;