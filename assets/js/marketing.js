var Marketing = function () {
    // manage mailchimp subscriptions

    var marketing = {},
        input_data = {},
        el;

    // used to validate the data in the form
    var validator = LGTM.validator()
        .validates('first_name')
            .required('You MUST enter a first name.')
        .validates('last_name')
            .required('You MUST enter a last name.')
        .validates('email')
            .email('You MUST enter an e-mail address.')
        .validates('website')
            .optional()
        .build();

    marketing.el = function (x) {
        if (!arguments.length) return el;
        el = x;
        return marketing;
    };

    marketing.initialize = function () {
        el.select('#submit-btn')
            .on('click', function () {
                d3.event.preventDefault();

                console.log('clicked');
                // get input data
                el.selectAll('input')
                    .each(function () {
                        var attr = d3.select(this).attr('name');
                        if (attr) {
                            input_data[attr] = this.value;
                        }
                    });
                // validate input data
                validator
                    .validate(input_data)
                    .then(function (result) {
                        if (result.valid) {
                            complete_subscription (input_data);
                        } else {
                            show_validation_errors(result.errors);
                        }
                    });
        });

        return marketing;
    };

    function complete_subscription (data) {
        console.log('completing submission with');
        console.log(data);

        var xhr = d3.xhr(STEAM.api.join_us)
            .mimeType('application/json')
            .header('Content-type', 'application/json')
            .send('POST', JSON.stringify(data),
                    function (err, results) {

                console.log('subscription returned from server');
                console.log(results);
                if (results.valid) {
                    show_thank_you();
                } else {
                    console.log('Problem submitting data. Try again.');
                }
            });
    }

    function show_validation_errors (data) {
        console.log('show validation errors');
        console.log(data);
    }

    function show_thank_you () {
        console.log('show thank you.');
    }

    return marketing;
};

var form_el = d3.select('#take-action form');

// setup news page
if (form_el[0][0]) {
    var marketing = Marketing()
        .el(form_el)
        .initialize();
}