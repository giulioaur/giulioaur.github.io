var $GLOBAL = [];

function init(){
    $GLOBAL['fixHeader'] = parseInt($('#header_collapse').css('margin-top'));
    $GLOBAL['fixPhoto'] = $('#me_photo').position().top + parseInt($('#me_photo').css('height')) - 85;

    //Recall function to init components.
    fixElement();

    //Bind Events
    $(window).scroll(fixElement);
    $('#header_collapse a').click(toggleCollapsedMenu);
}

function fixElement(){
    var $window = $(window)[0];

    if($window.scrollY > $GLOBAL['fixHeader']){
        $('#header').addClass('navbar-fixed-top');
        $('#fix_header').css('display', 'block');
    } else {
        $('#header').removeClass('navbar-fixed-top');
        $('#fix_header').css('display', 'none');
    }

    if ($window.scrollY > $GLOBAL['fixPhoto']) {
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

