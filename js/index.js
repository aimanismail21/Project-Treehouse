// Side Bar
(function($) {
    "use strict";

    // Toggle the side navigation
    $("#sidebarToggle").on('click', function(e) {
        e.preventDefault();
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
        if ($(window).width() > 768) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        }
    });

    // Scroll to top button appear
    $(document).on('scroll', function() {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1000, 'easeInOutExpo');
        event.preventDefault();
    });
})(jQuery);


//Easter Egg Script
var counter = 0;
nyan_cat_attack = document.getElementById('easter_egg');
nyan_cat_attack.addEventListener('click', function(){
    counter += 1;
    if(counter === 3) {
        function image(src) {
            this.im = document.createElement('img');
            this.im.src = src;
            document.body.appendChild(this.im);
            this.im.style.position = 'absolute';
            this.setTop = function (top) {
                this.im.style.top = top
            };
            this.setRandomLocation = function () {
                this.im.style.top = Math.random() * (window.innerHeight - 200);
                this.im.style.left = Math.random() * (window.innerWidth - 200)
            };

            this.animate = function() {
                setInterval(() => {
                    $(this.im).animate({left: Math.random() * (window.innerWidth - 50),
                        top: Math.random() * (window.innerHeight - 50),
                        height: '150px',
                    }, 'slow')
                }, 800);

            }
        }
        let imageArray = [];
        for (i = 0; i < 3; i++) {
            imageArray.push(new image('images/nyancat.gif'));
            imageArray[i].animate()
        }
        var audio = new Audio ('sound/8_bit_NYAN.mp3');
        audio.play();
    }
});

// Sidenav Content Script
$(function(){
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });

    $(window).resize(function(e) {
        if($(window).width()<=768){
            $("#wrapper").removeClass("toggled");
        }else{
            $("#wrapper").addClass("toggled");
        }
    });
});

