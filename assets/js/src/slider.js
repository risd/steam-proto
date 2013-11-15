var d3 = require('d3');

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

module.exports = Slider;