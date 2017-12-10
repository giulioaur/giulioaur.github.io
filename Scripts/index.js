var $GLOBAL = {};

function init(){
    $GLOBAL.collapseHeader = parseInt($('#header_collapse').css('margin-top'));
    $GLOBAL.fixPhoto = $('#me_photo').position().top + parseInt($('#me_photo').css('height')) - 85;

    //Recall function to init components.
    initElement();

    //Bind Events.
    $(window).scroll(fixElement);
    $(window).scroll(updateNavBar);
    $(window).scroll(showSkills);
    $('#header_collapse a').click(toggleCollapsedMenu);
    $('#email_container > input').blur(moveLabel);

    // Start with nav bar correctly setted.
    updateNavBar();
}

function initElement(){
    // Make the skills visible.
    let windowScroll = $(window)[0].scrollY,
    skillTop = $('#skills').offset().top;

    if(windowScroll >= skillTop + 450)
        $($('.hidden_row')[2]).css({marginTop:"0", opacity:"1"});
    if(windowScroll >= skillTop + 100)
        $($('.hidden_row')[1]).css({marginTop:"0", opacity:"1"});
    if(windowScroll >= skillTop - 250)
        $($('.hidden_row')[0]).css({marginTop:"0", opacity:"1"});

    fixElement();
}

function fixElement(){
    var $window = $(window)[0];
    // Fix and unfix nav bar.
    if($window.scrollY > $GLOBAL.collapseHeader){
        $('#header_collapse').addClass('collapsed');
    } else {
        $('#header_collapse').removeClass('collapsed');
    }

    // Fix and unfix photo.
    if ($window.scrollY > $GLOBAL.fixPhoto) {
        $('#me_photo').addClass('sticky');
    } else {
        $('#me_photo').removeClass('sticky');
    }    
}

function toggleCollapsedMenu(){
    var $window = $(window)[0]; 
    if($window.innerWidth < 900)
        $('.navbar-toggle').click();
}

function updateNavBar(){
    let sections = $('.my_section');
    let currentScroll = $(document).scrollTop();
    let currentSection = $(sections[0]).attr('id');

    for(let i = 1; i < sections.length; i++){
        if(currentScroll + 20 < $(sections[i]).offset().top)
            break;
        currentSection = $(sections[i]).attr('id');
    }

    $('#header_collapse li a').removeClass('current');
    $('#header_collapse li a[href=\'#' + currentSection + '\']').addClass('current');
}

function showSkills(){
    let windowScroll = $(window)[0].scrollY,
        skillTop = $('#skills').offset().top;

    
    if(windowScroll >= skillTop + 450)
        $($('.hidden_row')[2]).animate({marginTop:"0", opacity:"1"}, 500);
    else if(windowScroll >= skillTop + 100)
        $($('.hidden_row')[1]).animate({marginTop:"0", opacity:"1"}, 500);
    else if(windowScroll >= skillTop - 250)
        $($('.hidden_row')[0]).animate({marginTop:"0", opacity:"1"}, 500);
}

function moveLabel(){
    $('#email').val().length == 0 ? $('#email_container > label').removeClass('topper') : 
                                    $('#email_container > label').addClass('topper')
}

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});