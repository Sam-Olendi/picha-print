var main = function () {

    // Open a modal when user clicks upload photographs
    // Shows the default size
    $('.js-trigger-picha-modal-sizes').click(function () {
        $('.mod-picha-modal-sizes').addClass('picha-modal-is-visible');
    });

    // Close the default size modal
    $('.js-trigger-picha-modal-sizes-close').click(function () {
       $('.mod-picha-modal-sizes').removeClass('picha-modal-is-visible');
    });

    // Open the upload photographs modal
    $('.js-trigger-picha-modal-upload').click(function () {
        $('.mod-picha-modal-sizes').removeClass('picha-modal-is-visible');
        $('.mod-picha-modal-upload').addClass('picha-modal-is-visible');
    });

    // Close the upload pictures modal
    $('.js-trigger-picha-modal-upload-close').click(function () {
        $('.mod-picha-modal-upload').removeClass('picha-modal-is-visible');
    });

    // Close the payment modal
    $('.js-trigger-picha-modal-payment-close').click(function () {
        $('.mod-picha-modal-payment').removeClass('picha-modal-is-visible');
        $('.mod-picha-modal-congrats').addClass('picha-modal-is-visible');
    });

    // Close the congratulations modal
    $('.js-trigger-picha-modal-congrats-close').click(function () {
        $('.mod-picha-modal-payment').removeClass('picha-modal-is-visible');
        location.reload(); // force reload
    });

    // Show the delivery address field if the user chooses to have it delivered
    $('#upload-delivery').change(function () {
        if ( $(this).prop('checked') ) {
            $('.mod-form-group-delivery-address').css('display', 'block');
            $('.form-radio-group').css('display', 'none');
            uncheckRadioButtons();
        }
    });

    // Hide the delivery address field if the user decides to pick it up
    $('#upload-pickup').change(function () {
        if ( $(this).prop('checked') ) {
            $('.form-radio-group').css('display', 'block');
            $('.mod-form-group-delivery-address').css('display', 'none');
            $('#upload-address').val('');
        }
    });

    // Disable 'next' button if the first form is not filled
    // Enable when form is filled
    // Validate the input
    if ($('.upload-wizard-section-is-visible').attr('data-step') == 1) {
        var email = $('#upload-email'),
            phone = $('#upload-phone');

        /* check if input is filled, if not filled, disable next button */
        if ( !email.val() && !phone.val() ) {
            $('.mod-upload-wizard-navigation-button-next').addClass('upload-wizard-navigation-button-is-disabled');
            $('.form-input-group .icon-cross').css('display', 'none');
        }

        /* When user starts to type in email, check if phone no field is filled
         * If filled, enable the next button */
        email.keyup(function () {
            var emailRegex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm;
            var phoneRegex = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm;
            checkKeyup( email, phone, emailRegex, phoneRegex, 'icon-cross-email', 'icon-tick-email' );
        });

        /* When user starts to type in phone number, check if email field is filled
         * If filled, enable the next button */
        phone.keyup(function () {
            var emailRegex = /^([A-Z|a-z|0-9](\.|_){0,1})+[A-Z|a-z|0-9]\@([A-Z|a-z|0-9])+((\.){0,1}[A-Z|a-z|0-9]){2}\.[a-z]{2,3}$/gm;
            var phoneRegex = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm;
            checkKeyup( phone, email, phoneRegex, emailRegex, 'icon-cross-phone', 'icon-tick-phone' );
        });

        $('.upload-wizard-navigation-button-is-disabled').click(function () {
            if ($('.upload-wizard-section-is-visible').attr('data-step') == 1 && $(this).attr('data-step') == 1 && ( !email.val() || !phone.val() ) ) {
                $('.mod-alert-modal').text('Please enter your email and phone number first').show().delay(10000).fadeOut();
            }
        });
    }

    // Disable the next button if the user clicks it without selecting a delivery method or entering their address
    $('.mod-upload-wizard-navigation-button-next').click(function () {
        if ( $('.upload-wizard-section-is-visible').attr('data-step') == 2 ) {
            if ( !$('#upload-pickup').prop('checked') && !$('#upload-delivery').prop('checked') ) { // no delivery method selected
                $('.mod-alert-modal').text('Please select a method of delivery first').show().delay(10000).fadeOut();
                $('.mod-upload-wizard-navigation-button-next').attr('data-step', '3').addClass('upload-wizard-navigation-button-is-disabled');
            }

            if ($('#upload-delivery').prop('checked') && $('#upload-address').val() == '') { // selects delivery but enters no address
                $('.mod-alert-modal').text('Please select a method of delivery first').show().delay(10000).fadeOut();
                $('.mod-upload-wizard-navigation-button-next').attr('data-step', '3').addClass('upload-wizard-navigation-button-is-disabled');
            }
        }
    });

    // Disable 'next' button if the second form (delivery) is not filled
    $('.mod-upload-wizard-section-address').click(function (event) {
        if ( !$('#upload-pickup').prop('checked') && !$('#upload-delivery').prop('checked') ) { // if no option selected, disable next button
            enableButton( false, 'mod-upload-wizard-navigation-button-next', 'upload-wizard-navigation-button-is-disabled' );
        } else if ( $('#upload-delivery').prop('checked') && !$('#upload-address').val() ) { // if user selects delivery but enters no address, disable next button
            $('.mod-alert-modal').text('Please enter the address where you would like your printed photos delivered').show().delay(10000).fadeOut();
            enableButton( false, 'mod-upload-wizard-navigation-button-next', 'upload-wizard-navigation-button-is-disabled' );
        } else if ( $('#upload-pickup').prop('checked') && !validateStudioRadio() ) { // user chooses to pick at studio but doesn't select which studio
            $('.mod-alert-modal').text('Please select the studio where you would like to pick the printed photos from').show().delay(10000).fadeOut();
            enableButton( false, 'mod-upload-wizard-navigation-button-next', 'upload-wizard-navigation-button-is-disabled' );
        } else { // enable next button
            enableButton( true, 'mod-upload-wizard-navigation-button-next', 'upload-wizard-navigation-button-is-disabled' );
        }
    });

    // Hide any alerts when the user is typing
    $('#upload-email, #upload-phone, #upload-address').keyup(function () {
        $('.mod-alert-modal').hide().fadeOut('300');
    });

    // Hide any alerts when the user selects a radio button from the list of studios
    $('.mod-form-radio-studio').change(function () {
        $('.mod-alert-modal').hide().fadeOut('300');
    });

    // Enable the next button once the address field has been filled
    $('#upload-address').keyup(function () {
        if ( $('#upload-delivery').prop('checked') && $('#upload-address').val() ) { // if user selects delivery and enters address, enable next button
            $('.mod-upload-wizard-navigation-button-next').removeClass('upload-wizard-navigation-button-is-disabled');
        }
    });

    // handle file inputs
    var uploadCount, inputCount = 0;

    $('.upload-file-group').on('change', '.mod-form-control-upload', function (event) {
        uploadCount = $(this).attr('data-file'); // get the number of the file input (order)

        // if greater than 30KB
        if ( this.files[0].size >= 30000 ) {
            $('#upload-file-input-' + uploadCount).hide(); // hide the current input

            // add latest upload filename to the list of uploaded photographs
            $('.upload-files-count').prepend('<li class="upload-files-count-image">' + $('#upload-file-' + uploadCount).val().split('\\').pop() + '</li>').fadeIn(); // show the file they've uploaded

            // increase the input counter (tracks the number of images uploaded)
            inputCount = parseInt(uploadCount) + 1;
            $('.upload-files-indicator').text( inputCount + ' photograph(s) added'); // show number of photos uploaded

            // add a new file input field (the one which the user just used to upload is hidden and replaced by this)
            $('.upload-file-group').append('<div class="upload-file-input" id="upload-file-input-'+ inputCount + '"></div>');
            $('#upload-file-input-' + inputCount).append('<input type="file" id="upload-file-'+ inputCount + '" class="form-control mod-form-control-upload" data-file="'+ inputCount + '" accept="image/*">');
            $('#upload-file-input-' + inputCount).append('<label for="upload-file-'+ inputCount + '" class="upload-label mod-upload-label-upload"><i class="icon-image"></i> Select another photograph</label>');

            if ( inputCount < 3 ) {
                // disable finish button if less than three images
                enableButton( false, 'mod-upload-wizard-navigation-button-finish', 'upload-wizard-navigation-button-is-disabled' );
            } else {
                enableButton( true, 'mod-upload-wizard-navigation-button-finish', 'upload-wizard-navigation-button-is-disabled' );
            }
        } else  {
            // the file is less than 30KB in size so alert the user
            $('.mod-alert-modal').text('The image you have tried to upload is less than 30KB in size. Please select a larger image.').show().delay(10000).fadeOut();
            document.getElementById('upload-file-input-' + uploadCount).value = ''; // and reject the upload
        }

    });

    // Check if a file has been uploaded
    // If uploaded, enable finish button
    // Disable 'next' button if the third form (upload pictures) is not filled
    $('.mod-upload-wizard-navigation-button-finish').click(function () {

        if ( inputCount < 3) {
            $('.mod-alert-modal').text('You must upload at least three images').show().delay(10000).fadeOut();
            enableButton( false, 'mod-upload-wizard-navigation-button-finish', 'upload-wizard-navigation-button-is-disabled' ); // disable finish button
        } else {
            // show the payment modal after user clicks finish
            $('.mod-picha-modal-upload').removeClass('picha-modal-is-visible');
            $('.mod-picha-modal-payment').addClass('picha-modal-is-visible');

            if ( inputCount >= 10 ) {
                if ( $('#upload-delivery').prop('checked') ) {
                    $('.picha-modal-body-payment-amount').html('<b>Total: </b>Kshs. ' + (( inputCount * 90) + 200) );
                } else {
                    $('.picha-modal-body-payment-amount').html( '<b>Total: </b>Kshs. ' + ( inputCount * 90) );
                }
            } else {
                if ( $('#upload-delivery').prop('checked') ) {
                    $('.picha-modal-body-payment-amount').html('<b>Total: </b>Kshs. ' + (( inputCount * 99) + 200) );
                } else {
                    $('.picha-modal-body-payment-amount').html( '<b>Total: </b>Kshs. ' + ( inputCount * 99) );
                }
            }
            $('.upload-form-explainer').text('This is the total amount charged to you in order to print the ' + fileInputField.get(0).files.length + ' photographs you have uploaded.')
        }
    });

    var nextButton =  $('.mod-upload-wizard-navigation-button-next'),
        previousButton = $('.mod-upload-wizard-navigation-button-previous'),
        nextCount = 1,
        previousCount;

    // Go to next step when next is clicked
    nextButton.click(function () {
        if ( !nextButton.hasClass('upload-wizard-navigation-button-is-disabled') ) { // if next button is active
            nextButton.attr('data-step', nextCount + 1); // go to next step

            // hide current step
            $( '.upload-wizard-section[data-step="' + nextCount + '"]').removeClass('upload-wizard-section-is-visible');
            $( '.upload-wizard-sections-navigation[data-step="' + nextCount + '"]').removeClass('upload-wizard-sections-navigation-is-active');

            nextCount += 1; // update the counter

            // show next step
            $( '.upload-wizard-section[data-step="' + nextCount + '"]').addClass('upload-wizard-section-is-visible');
            $( '.upload-wizard-sections-navigation[data-step="' + nextCount + '"]').addClass('upload-wizard-sections-navigation-is-active');
            previousButton.attr('data-step', nextCount - 1); // update the data-step for the previous button to show the previous step

            // hide next button on last step and show finish instead
            if ( nextCount > 2) {
                $('.mod-upload-wizard-navigation-button-next').css('display', 'none');
                $('.mod-upload-wizard-navigation-button-finish').css('display', 'inline-block');
            }

            // hide any alerts
            $('.mod-alert-modal').hide();
        }

        // show previous button from the second step upwards
        if ( nextCount > 1 ) {
            $('.mod-upload-wizard-navigation-button-previous').css('display', 'inline-block');
        }
    });

    // Go to previous step when previous is clicked
    previousButton.click(function () {
        previousCount = parseInt(previousButton.attr('data-step'));

        // hide current step
        $( '.upload-wizard-section[data-step="' + ( previousCount + 1 ) + '"]').removeClass('upload-wizard-section-is-visible');
        $( '.upload-wizard-sections-navigation[data-step="' + ( previousCount + 1 ) + '"]').removeClass('upload-wizard-sections-navigation-is-active');

        // show previous step
        $( '.upload-wizard-section[data-step="' + previousCount + '"]').addClass('upload-wizard-section-is-visible');
        $( '.upload-wizard-sections-navigation[data-step="' + previousCount + '"]').addClass('upload-wizard-sections-navigation-is-active');

        // remove any constraints on the next button when the previous button is clicked
        $('.mod-upload-wizard-navigation-button-next').removeClass('upload-wizard-navigation-button-is-disabled');

        nextButton.attr('data-step', previousCount); // update the next data-step
        previousButton.attr('data-step', previousCount - 1); // update the previous data-step

        // set the counters to reflect current status
        nextCount = previousCount;
        previousCount -= 1;

        // hide any alerts
        $('.mod-alert-modal').hide();

        // hide previous button on first step
        if (previousCount < 1) {
            previousButton.css('display', 'none');
        }

        // hide next button on last step and show finish instead
        if ( previousCount < 2 ) {
            $('.mod-upload-wizard-navigation-button-finish').css('display', 'none');
            $('.mod-upload-wizard-navigation-button-next').css('display', 'inline-block');
        }

    });

    // Open the modal when user clicks more details on the dashboard
    $('.js-trigger-dashboard-modal').click(function () {
        $('.dashboard-modal').addClass('dashboard-modal-is-visible');
    });

    // Close the modal when user clicks on 'x'
    $('.js-trigger-dashboard-close').click(function () {
        $('.dashboard-modal').removeClass('dashboard-modal-is-visible');
    });

};

// check the user's input on keyup (for live validation)
var checkKeyup = function ( field, altField, regexpr, altRegex, errorIcon, successIcon ) {
    if ( field.val() && validateInput( field.val(), regexpr) ) {
        $('.' + errorIcon).css('display', 'none');
        $('.' + successIcon).css('display', 'inline');
        if ( altField.val() && validateInput( altField.val(), altRegex ) ) {
            $('.mod-upload-wizard-navigation-button-next').removeClass('upload-wizard-navigation-button-is-disabled');
        }
    } else {
        $('.mod-upload-wizard-navigation-button-next').addClass('upload-wizard-navigation-button-is-disabled');
        $('.' + successIcon).css('display', 'none');
        $('.' + errorIcon).css('display', 'inline');
    }
};

// validate input
var validateInput = function ( value, regexpression ) {
    return regexpression.test(value);
};

var validateStudioRadio = function () {
    var studioOptions = $('.mod-form-radio-studio'),
        isChecked = 0;

    for ( var s = 0; s < studioOptions.length; s++ ) {
        if ( $(studioOptions[s]).prop('checked') ) isChecked = 1;
    }

    return isChecked;
};

var uncheckRadioButtons = function () {
    var studioOptions = $('.mod-form-radio-studio');

    for ( var u = 0; u < studioOptions.length; u++ ) {
        $(studioOptions[u]).prop('checked', false);
    }
};

var enableButton = function ( state, buttonClass, enablingClass ) {

    if ( state ) {
        $('.' + buttonClass).removeClass(enablingClass);
    } else {
        $('.' + buttonClass).addClass(enablingClass);
    }
};

$(document).ready(main);

