let catImageArray = [];
let audio = null;
let catsAlive = 3;

// Side Bar
(function ($) {
    "use strict";

    // Toggle the side navigation
    $("#sidebarToggle").on('click', function (e) {
        e.preventDefault();
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function (e) {
        if ($(window).width() > 768) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        }
    });

    // Scroll to top button appear
    $(document).on('scroll', function () {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });
})(jQuery);


//Easter Egg Script
var counter = 0;
let nyan_cat_attack = document.getElementById('easter_egg');
nyan_cat_attack.addEventListener('click', function () {

    counter += 1;
    if (counter === 3) {
        function image(src, id) {
            this.im = document.createElement('img');
            this.im.src = src;
            this.im.id = 'cat' + id;
            document.body.appendChild(this.im);
            this.im.style.position = 'absolute';

            this.animate = function () {
                setInterval(() => {
                    $(this.im).animate({
                        left: Math.random() * (window.innerWidth - 50),
                        top: Math.random() * (window.innerHeight - 50),
                        height: '150px',
                    }, 'slow')
                }, 2000);

            }
        }

        for (let i = 0; i < 3; i++) {
            catImageArray[i] = new image('images/nyancat.gif', i);
            catImageArray[i].im.onclick = function () {
                catImageArray[i].im.style.display = 'none';
                catsAlive--;
                checkCatsAlive();
            };
            catImageArray[i].animate();
        }
        audio = new Audio('sound/8_bit_NYAN.mp3');
        audio.play();
    }
});


// checks if all cats have been clicked and stops audio if they have
function checkCatsAlive(){
    if (catsAlive === 0){
        console.log('cats have died');
        audio.pause();
    }
}

// Sidenav Content Script
$(function () {
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    $(window).resize(function (e) {
        if ($(window).width() <= 768) {
            $("#wrapper").removeClass("toggled");
        } else {
            $("#wrapper").addClass("toggled");
        }
    });
});

