var Marketing = function () {
    var marketing = {},
        el;

    // used to validate the data in the form
    var validator = LGTM.validator()
        .validates('first_name')
            .required('You MUST enter a first name.')
        .validates('last_name')
            .required('You MUST enter a last name.')
        .validates('email')
            .required('You MUST enter an e-mail address.')
        .validates('website')
            .optional();

    marketing.el = function (x) {
        if (!arguments.length) return el;
        el = x;
        return marketing;
    };

    marketing.initialize = function () {
        return marketing;
    };

    return marketing;
};

var form_el = d3.select('#task-action form');

// setup news page
if (form_el[0][0]) {
    var marketing = Marketing()
        .el(form_el)
        .initialize();
}