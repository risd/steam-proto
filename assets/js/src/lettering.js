var Lettering = function () {

    function lettering (el) {
        // el is a d3 element
        var lettered = '';

        el.text().split('').forEach(function (d, i) {
            lettered += '<span class="char' + (i+1) + '">' +
                        d +'</span>';
        });

        el.html(lettered);
    }

    return lettering;
};

module.exports = Lettering;