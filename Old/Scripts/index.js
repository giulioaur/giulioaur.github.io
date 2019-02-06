var $GLOBAL = {};

// Initialization function.
function init(){
    $GLOBAL.collapseHeader = parseInt($('#header_collapse').css('margin-top'));
    $GLOBAL.fixPhoto = $('#me_photo').position().top + parseInt($('#me_photo').css('height')) - 85;
    $GLOBAL.hiddenRows = $('.hidden_row');

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

    $('[data-toggle="popover"]').popover('show');
}

// Initializes dynamic elements in correct position.
function initElement(){
    // Make the skills visible.
    let windowScroll = $(window)[0].scrollY,
        skillTop = $('#skills').offset().top;

    for(i = 0; i < $GLOBAL.hiddenRows.length; ++i)
        if(windowScroll >= skillTop + -250 + 350 * i)
            $($GLOBAL.hiddenRows[i]).css({marginTop:"0", opacity:"1"});

    fixElement();
}

// Resize function.
function resize() { 
    $('[data-toggle="popover"]').popover('show');
}

// Sticky elementes.
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

// Colors navbar based on current scroll position.
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

// Lets skills section appear gradually.
function showSkills(){
    let windowScroll = $(window)[0].scrollY,
        skillTop = $('#skills').offset().top,
        start = -380,
        end = start + 350 * ($GLOBAL.hiddenRows.length - 1);
    
    for(i = $GLOBAL.hiddenRows.length - 1; i >= 0; --i)
        if(windowScroll >= skillTop + start + 350 * i)
            $($GLOBAL.hiddenRows[i]).animate({marginTop:"0", opacity:"1"}, 500);
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