var d3 = require('d3'),
    LGTM = require('lgtm'),
    Q = require('q');

LGTM.configure('defer', Q.defer);

var Marketing = function () {
    // manage mailchimp subscriptions

    var marketing = {},
        input_data = {},
        server_error_el,
        thank_you_el,
        wrapper_el,
        el;

    var general_server_error = 'The computer that should ' +
        'be waiting for your request is taking a nap. Try again later.';

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

    marketing.wrapperEl = function (x) {
        if (!arguments.length) return wrapper_el;
        wrapper_el = x;
        return marketing;
    };

    marketing.serverErrorEl = function (x) {
        if (!arguments.length) return server_error_el;
        server_error_el = x;

        // override the general server error if something
        // is already in the DOM
        if (server_error_el.html().length > 0) {
            general_server_error = server_error_el.html();
        }
        return marketing;
    };

    marketing.thankYouEl = function (x) {
        if (!arguments.length) return thank_you_el;
        thank_you_el = x;
        return marketing;
    };

    marketing.initialize = function () {
        el.select('#submit-btn')
            .on('click.marketing', function () {

                console.log('clicked');

                // set visual statestate
                server_error_el
                    .classed('hidden', true)
                    .text(general_server_error);

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
                if (err) {
                    show_server_error();
                } else {
                    var response = JSON.parse(results.response);

                    console.log(response);

                    if (response.result === 'Success') {
                        show_thank_you();
                    } else {
                        // results.result = 'Failed'
                        show_server_error(response.message);
                    }
                }
            });
    }

    function show_validation_errors (data) {
        // leaning on browser built in 
        // input[required] functionality.
        console.log('show validation errors');
        console.log(data);
    }

    function show_server_error (msg) {
        if (!arguments.length) {
            server_error_el.html(general_server_error);
        } else {
            server_error_el.html(msg);
        }

        server_error_el.classed('hidden', false);
    }

    function show_thank_you () {
        el.classed('hidden', true);

        thank_you_el.classed('hidden', false);
    }

    return marketing;
};

module.exports = Marketing;