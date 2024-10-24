$.ajaxSetup({ cache: false });

$(document).keydown(function (e) {
    // Check if the pressed key is the Escape key
    if (e.keyCode === 27) {
        closeModal();
    }
});



$(document).ready(function () {
    $(document).ajaxStart(function () { showLoader(); });
    $(document).ajaxComplete(function () { hideLoader(); });


    var yOffset = -100;

    // Find all 'a' elements with href starting with '#'
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor behavior

            // Get the target element
            var target = document.querySelector(this.getAttribute('href'));

            if (target) {
                // Scroll to the target element plus the yOffset
                window.scrollTo({
                    top: target.offsetTop + yOffset,
                    behavior: 'smooth'
                });
            }
        });
    });
    $(window).scroll(function () {

        var scroll = $(window).scrollTop();
        if (scroll > 420) {
            $("header nav").addClass("theme");
        }
        else {
            $("header nav").removeClass("theme");
        }
    });

    $('body').animate({ opacity: 1 }, 100);

    function animate(selector, animation) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                        entry.target.classList.add(animation); // Use the passed class name
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0 });

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            observer.observe(element);
        });
    }


    animate('.card, .translucid', 'slide');
    animate('img', 'fade');



    $("a:not([href^='#']):not(.fr-command):not([target='_blank']):not(.download)").click(function (e) {
        showLoader();
    });

    var videos = document.querySelectorAll("video.background"); // Selects all videos with this class
    videos.forEach(function (video) {
        video.playbackRate = 0.6;
    });   


    $('form').submit(function (event) {
        showLoader();
        if (typeof $(this).valid == 'function') {
            if ($(this).valid()) {
                return true;
            }
            else {
                hideLoader();
                event.preventDefault();
                return false;
            }
        }
        return true;
    });


});

function back() {
    history.back();
    hideLoader();
} 

function showLoader() {
    $('#loader').css('display', 'block');
}

function hideLoader() {
    $('#loader').css('display', 'none');
}

function printStart() {
    $('#printing').addClass('blink');
}
function printStop() {
    $('#printing').removeClass('blink');
}

function watch(value) {
    console.log(JSON.stringify(value));
}


function scrollToElement(id) {
    $('html').animate({
        scrollTop: $('#' + id).offset().top -220
    }, 0);
}

// Check if element is scrolled into view
function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + 100;

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function hideKeyboard() {
    //this set timeout needed for case when hideKeyborad
    //is called inside of 'onfocus' event handler
    setTimeout(function () {

        //creating temp field
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        //hiding temp field from peoples eyes
        //-webkit-user-modify is nessesary for Android 4.x
        field.setAttribute('style', 'visibility: hidden; opacity: 0; -webkit-user-modify: read-write-plaintext-only;');
        document.body.appendChild(field);

        //adding onfocus event handler for out temp field
        field.onfocus = function () {
            //this timeout of 200ms is nessasary for Android 2.3.x
            setTimeout(function () {
                field.setAttribute('style', 'display:none;');
                setTimeout(function () {
                    document.body.removeChild(field);
                    document.body.focus();
                }, 14);

            }, 200);
        };
        //focusing it
        field.focus();
    }, 50);
}

function showPassword(input) {
    var _ = document.getElementById(input);
    if (_.type === "password") {
        _.type = "text";
    } else {
        _.type = "password";
    }
}





function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}




function subscription(target) {
    const form = $(target).closest('form').attr('id');

    const success = function (result) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'generate_lead',
            'formId': form
        });
        $('#' + form + ' span.message').text(result);
        return false;
    }
    post('/human/subscription', serialize('#' + form), success);
    return false;

}



var $ = jQuery.noConflict();