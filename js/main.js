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

    // Change the value of the label when the user selects the files to upload
    // e.g. '3 files selected'
    var inputs = document.querySelectorAll('.mod-form-control-upload');
    Array.prototype.forEach.call( inputs, function (input) {
        var label = input.nextElementSibling;

        input.addEventListener( 'change', function (event) {
            var filename = '';

            if ( this.files && this.files.length > 1 ) {
                filename = this.files.length + ' files selected';
            } else {
                filename = event.target.value.split('\\').pop();
            }

            if ( filename ) {
                document.querySelector('.mod-upload-label-upload').innerHTML = filename;
            }
        } );
    } );

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
            checkKeyup( email, phone, emailRegex, 'icon-cross-email', 'icon-tick-email' );
        });

        /* When user starts to type in phone number, check if email field is filled
         * If filled, enable the next button */
        phone.keyup(function () {
            var phoneRegex = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm;
            checkKeyup( phone, email, phoneRegex, 'icon-cross-phone', 'icon-tick-phone' );
        });
    }

    // Disable the next button if the user clicks it without selecting a delivery method
    $('.mod-upload-wizard-navigation-button-next').click(function () {
        if ( $('.upload-wizard-section-is-visible').attr('data-step') == 2 ) {
            if ( !$('#upload-pickup').prop('checked') && !$('#upload-delivery').prop('checked') ) {
                $('.mod-upload-wizard-navigation-button-next').attr('data-step', '3').addClass('upload-wizard-navigation-button-is-disabled');
            }
        }
    });

    // Disable 'next' button if the second form (delivery) is not filled
    $('.mod-upload-wizard-section-address').click(function () {
        if ( !$('#upload-pickup').prop('checked') && !$('#upload-delivery').prop('checked') ) { // if no option selected, disable next button
            $('.mod-upload-wizard-navigation-button-next').addClass('upload-wizard-navigation-button-is-disabled');
        } else if ( $('#upload-delivery').prop('checked') && !$('#upload-address').val() ) { // if user selects delivery but enters no address, disable next button
            $('.mod-upload-wizard-navigation-button-next').addClass('upload-wizard-navigation-button-is-disabled');
        } else if ( $('#upload-pickup').prop('checked') && !validateStudioRadio() ) {
            $('.mod-upload-wizard-navigation-button-next').addClass('upload-wizard-navigation-button-is-disabled');
        } else { // enable next button
            $('.mod-upload-wizard-navigation-button-next').removeClass('upload-wizard-navigation-button-is-disabled');
        }
    });

    // Enable the next button once the address field has been filled
    $('#upload-address').keyup(function () {
        if ( $('#upload-delivery').prop('checked') && $('#upload-address').val() ) { // if user selects delivery and enters address, enable next button
            $('.mod-upload-wizard-navigation-button-next').removeClass('upload-wizard-navigation-button-is-disabled');
        }
    });

    // Check if a file has been uploaded
    // If uploaded, enable finish button
    var fileInput = document.getElementById('upload-file'),
        uploadsLength = $('#upload-file').get(0).files.length;

    // Disable 'next' button if the third form (upload pictures) is not filled
    $('.mod-upload-wizard-navigation-button-finish').click(function () {
        if ( !uploadsLength ) {
            $('.mod-upload-wizard-navigation-button-finish').addClass('upload-wizard-navigation-button-is-disabled'); // disable finish button
        } else {
            validateSize( fileInput );
            // show the payment modal after user clicks finish
            $('.js-trigger-picha-modal-payment').click(function () {
                $('.mod-picha-modal-upload').removeClass('picha-modal-is-visible');
                $('.mod-picha-modal-payment').addClass('picha-modal-is-visible');
            });
        }
    });

    $(fileInput).change(function () {
        if ( $('#upload-file').get(0).files.length ) {
            validateSize( fileInput );
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
var checkKeyup = function ( field, altField, regexpr, errorIcon, successIcon ) {
    if ( field.val() && validateInput( field.val(), regexpr) ) {
        $('.' + errorIcon).css('display', 'none');
        $('.' + successIcon).css('display', 'inline');
        if ( altField.val() ) {
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

// check size of image uploaded
// should not be less than 30KB
var validateSize = function ( inputSelector ) {
    var tooSmall = 0,
        fileInputField = $('#upload-file');

    for ( var i = 0; i < fileInputField.get(0).files.length; i++ ) {
        if ( inputSelector.files[i].size < 30000 ) tooSmall = 1;
    }

    if ( !tooSmall && fileInputField.get(0).files.length >= 5 ) {
        $('.mod-upload-wizard-navigation-button-finish').removeClass('upload-wizard-navigation-button-is-disabled'); // enable finish button

        // show the payment modal after user clicks finish
        $('.js-trigger-picha-modal-payment').click(function () {
            $('.mod-picha-modal-upload').removeClass('picha-modal-is-visible');
            $('.mod-picha-modal-payment').addClass('picha-modal-is-visible');
            $('.picha-modal-body-payment-amount').html('<b>Total: </b>Kshs. ' + (fileInputField.get(0).files.length * 99) );
            $('.upload-form-explainer').text('This is the total amount charged to you in order to print the ' + fileInputField.get(0).files.length + ' photographs you have uploaded.')
        });
    } else if ( fileInputField.get(0).files.length < 5 ) {
        $('.mod-upload-wizard-navigation-button-finish').addClass('upload-wizard-navigation-button-is-disabled');
    } else {
        $('.mod-upload-wizard-navigation-button-finish').addClass('upload-wizard-navigation-button-is-disabled');
    }
};

$(document).ready(main);

