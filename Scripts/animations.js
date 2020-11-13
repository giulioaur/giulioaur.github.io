////////////////////////////////////////////////////////////////////////
////////////////////////////// MAIN MENU ///////////////////////////////
////////////////////////////////////////////////////////////////////////

const ANIM_DATA = {
    mainMenu: { oldPos: 0 },
    credits: { tl: undefined }
}



////////////////////////////////////////////////////////////////////////
////////////////////////////// MAIN MENU ///////////////////////////////
////////////////////////////////////////////////////////////////////////

function mainMenuOutAnimation(from, to, isBack) 
{
    const carousel = document.getElementById("m-carousel");
    const carouselContainer = carousel.children[0];
    const selectedItem = document.querySelector("#sm-main-menu .sm-item[data-goto=\"" + to.id + "\"]");
    const items = document.querySelectorAll("#sm-main-menu .sm-item");
    const textContainer = selectedItem.querySelector(".m-item-title");
    const iconContainer = selectedItem.querySelector(".m-item-hover");
    const background = document.getElementById("m-background-land");
    const back = carousel.querySelector("#m-main-esc");
    const containerX = gsap.getProperty(carouselContainer, "x");
    const x = $(selectedItem).position().left + (containerX ? containerX : 0);

    ANIM_DATA.mainMenu.oldPos = x;
    ANIM_DATA.mainMenu.oldScroll = containerX;
    ANIM_DATA.mainMenu.oldWidth = carouselContainer.offsetWidth;
    ANIM_DATA.mainMenu.backgroundHeight = getComputedStyle(background).height;

    // Avoid anim overlapping.
    m_carousel.stopAnim();

    const hideElements = elements => {
        elements.forEach(element => {
            if (element.dataset["goto"] != to.id) {
                $(element).hide();
            }
        });
    };

    const tl = gsap.timeline();

    tl
        .call(hideElements, [items])                                                            // Hide all other elements.
        .set(iconContainer, { top: '-100%' })                                                   // Simulate the "focus" effect
        .call(DOMTokenList.prototype.add.bind(selectedItem.classList), ["m-item-selected"])
        .set(carouselContainer, { x: 0 })                                                       // Slide the item in the first position.
        .set(carouselContainer, { justifyContent: "start" })
        .add("nowTogether0")
        .to(carouselContainer, { width: '100%' }, "nowTogether0")
        .from(selectedItem, { x: x, duration: 0.5 }, "nowTogether0")
        .set(selectedItem, { transformOrigin: "top left" }, "nowTogether0")                      // While scaling it.
        .to(selectedItem, { scale: 0.35, duration: 0.5, onUpdate: updateScrollingPanelHeight }, "nowTogether0")
        .to(carousel, { height: carousel.offsetHeight * 0.35, duration: 0.5 }, "nowTogether0")
        .to(background, { height: background.offsetHeight + (carousel.offsetHeight - carousel.offsetHeight * 0.35), duration: 0.5 }, "nowTogether0")
        .set(textContainer, {background: 'none'})                                               // Move the background to the right.
        .call(jQuery.fn.show.bind($(back)), [])
        .add("nowTogether1")
        .to(textContainer, { x: selectedItem.offsetWidth, duration: 0.5 }, "nowTogether1")
        .fromTo(back, { right: -100 }, { right: 0, duration: 0.5 }, "nowTogether1");
}

function mainMenuInAnimation(from, to, isBack) 
{
    const carousel = document.getElementById("m-carousel");
    const carouselContainer = carousel.children[0];
    const selectedItem = document.querySelector("#sm-main-menu .sm-item[data-goto=\"" + from.id + "\"]");
    const items = document.querySelectorAll("#sm-main-menu .sm-item");    
    const textContainer = selectedItem.querySelector(".m-item-title");
    const background = document.getElementById("m-background-land");
    const back = carousel.querySelector("#m-main-esc");
    
    const tl = gsap.timeline();

    tl
        .add("nowTogether0")
        .to(textContainer, { x: 0, duration: 0.5 }, "nowTogether0")
        .to(back, { right: -200, duration: 0.5, onComplete: jQuery.fn.hide.bind($(back)) }, "nowTogether0")
        .set(textContainer, {background: ''})  
        .call(DOMTokenList.prototype.remove.bind(selectedItem.classList), ["m-item-selected"])
        .add("nowTogether1")
        .to(background, { height: ANIM_DATA.mainMenu.backgroundHeight, duration: 0.5 }, "nowTogether1")
        .to(selectedItem, { scale: 1, x: ANIM_DATA.mainMenu.oldPos, duration: 0.5 }, "nowTogether1")
        .to(carousel, { height: () => { return selectedItem.offsetHeight; }, duration: 0.5 }, "nowTogether1")
        .to(carouselContainer, { width: ANIM_DATA.mainMenu.oldWidth }, "nowTogether1")
        .set(carousel, { height: "auto" })
        .set(carouselContainer, { justifyContent: "" })
        .set(selectedItem, { x: 0 })
        .call(m_carousel.restoreItem, [selectedItem, true])
        .call(jQuery.fn.show.bind($(items)), [])
        .set(carouselContainer, { x: ANIM_DATA.mainMenu.oldScroll });

    SM.input.restoreFocus(to);
}





////////////////////////////////////////////////////////////////////////
/////////////////////////////// ABOUT ME ///////////////////////////////
////////////////////////////////////////////////////////////////////////

function aboutMeInAnimation(from, to, isBack) {
    const text1 = to.querySelector('#m-aboutme-name h1');
    const text2 = to.querySelector('#m-aboutme-title h2');
    const text3 = to.querySelector('#m-aboutme-body p');
    const innerText1 = text1.innerHTML;
    const innerText2 = text2.innerHTML;
    const innerText3 = text3.innerHTML;

    gsap.timeline()
        .call(jQuery.fn.show.bind($(to)), [])
        .set(text1, { innerHTML: "" })
        .set(text2, { innerHTML: "" })
        .set(text3, { innerHTML: getLoremImpsum(innerText3.replace(/\s+/g, '-').length) })
        .addLabel("nowTogether")
        .to(text1, { duration: 1.2, text: innerText1 }, "nowTogether")
        .to(text2, { duration: 1.2, text: innerText2 }, "nowTogether")
        .to(text3, { duration: 8, text: innerText3, delay: 1.5 }, "nowTogether")
        .from(to.querySelector("#m-my-photo"), { duration: 0.8, x: '-200%' }, "nowTogether")
        .from(to.querySelectorAll("#m-contact-me >div"), { duration: 0.8, x: '-200%', stagger: 0.2 }, "nowTogether")
        .from(to.querySelectorAll("#m-aboutme-doggo"), { duration: 0.8, x: '+300%', stagger: 0.2 }, "nowTogether");
}

function getLoremImpsum(size){
    const tmp = ` Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet nisl at augue mattis varius id et tellus. Aenean rhoncus dapibus lectus id aliquet. Pellentesque volutpat rutrum nibh id convallis. Nullam ipsum tortor, congue id feugiat id, porttitor et lectus. Nulla finibus mauris eget iaculis malesuada. Nullam sollicitudin ac velit non semper. Sed sit amet gravida leo, id fermentum ex. Nunc aliquam eros eget tortor facilisis dictum. Mauris posuere libero eget rhoncus tristique. Fusce vel est ex. Nulla non tortor non orci sodales mattis sed interdum odio. Etiam semper urna vel odio tristique, eu molestie diam varius. Vivamus non sapien ipsum.
<br/><br/>
Phasellus tincidunt faucibus diam, a sollicitudin ante facilisis at. Nam accumsan accumsan velit sed suscipit. Fusce massa turpis, iaculis ut lorem ac, condimentum accumsan ante. Curabitur dignissim risus in convallis rhoncus. Donec euismod ipsum et tincidunt cursus. Maecenas pulvinar scelerisque quam, at porta libero lacinia et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec varius laoreet lacus sed iaculis. Suspendisse auctor orci ut ipsum dapibus, et molestie dolor gravida.
<br/><br/>
Maecenas accumsan id sapien ut rutrum. Nullam ut ultrices purus, nec ultrices tortor. Morbi pulvinar, risus a sodales commodo, ex purus aliquet tellus, non sagittis ipsum velit eu leo. Phasellus placerat enim et risus condimentum egestas. Aenean eros nulla, pulvinar nec consequat a, aliquet vitae lacus. Integer in lacus tellus. Suspendisse potenti. Sed est nisl, cursus eget mauris non, maximus convallis velit. Vestibulum porttitor ante a nibh malesuada semper.`
    
    return tmp.substring(0, size) + '.';
}






////////////////////////////////////////////////////////////////////////
//////////////////////////////// SKILLS ////////////////////////////////
////////////////////////////////////////////////////////////////////////

function skillsInAnimation(from, to, isBack) {
    const skills = to.querySelectorAll(".m-skill");
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const skillHeight = 100;

    gsap.timeline()
        .call(jQuery.fn.show.bind($(to)), [] )
        .set(to, { y: 0})
        .from(skills, {
            duration: 0.7,
            y: windowHeight + skillHeight,
            stagger: 0.1
        });
}

function skillsOutAnimation(from, to, isBack) 
{
    return new Promise((resolve, reject) => {
        const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
        const skillHeight = 100;
    
        gsap.timeline()
            .call(() => { GLOBALS.scrollPanel.scrollToY(0, { animateScroll: true, animateDuration: 0.7 }) })
            .to(from, {
                duration: 0.7,
                y: windowHeight + skillHeight,
            })
            .call(jQuery.fn.hide.bind($(from)))
            .eventCallback("onComplete", resolve);
    });
}





////////////////////////////////////////////////////////////////////////
///////////////////////////// EXPERIENCE ///////////////////////////////
////////////////////////////////////////////////////////////////////////

function experienceInAnimation(from, to, isBack) {
    const tl = gsap.timeline();
    const activeItem = to.querySelector(".m-exp.m-active");
    const shownItem = to.querySelector(".collapse.show");

    tl
        .call(jQuery.fn.show.bind($(to)), [])
        .call(activeItem ? DOMTokenList.prototype.remove.bind(activeItem.classList) : () => {}, ["m-active"])
        .call(shownItem ? DOMTokenList.prototype.remove.bind(shownItem.classList) : () => {}, ["show"])
        .addLabel("animation");

    to.querySelectorAll('.m-exp .progress').forEach((progress, index) => {
        const progressBar = progress.querySelector(".progress-bar");
        const progressCover = progress.querySelector(".m-cover");
        let x = {progress: 0};
        tl
            .fromTo(x,
                {
                    progress: 0 
                },
                {
                    progress: progressBar.getAttribute('aria-valuenow'),
                    duration: 1,
                    ease: "none",
                    onUpdate: () => {
                        const percentage = Math.ceil(x.progress);
                        const inversePercentage = Math.ceil(100 - x.progress);
                        progressBar.innerHTML =  percentage + '%';
                        progressCover.innerHTML = percentage + '%';
                        gsap.set(progressBar, { webkitClipPath: `inset(0 ${inversePercentage}% 0 0)` });
                        gsap.set(progressBar, { clipPath: `inset(0 ${inversePercentage}% 0 0)` });
                    },
                    onComplete: () => {
                        if (index == 0)
                        {
                            // Simulate collapsing, don't know why collapse() doesn't correclty work.
                            $(progress.closest('.row')).click();
                        }
                    }
                },
                "animation"
            )
    });
}

function experienceOutAnimation(from, to, isBack) {
    return new Promise((resolve, reject) => {
        const tl = gsap.timeline();

        tl
            .call(jQuery.fn.click.bind($(from.querySelector('.m-exp.m-active .row'))), [])
            .call(() => { GLOBALS.scrollPanel.scrollToY(0, { animateScroll: true, animateDuration: 0.7 }) })
            .addLabel("animation", '+0.7');

        from.querySelectorAll('.m-exp .progress').forEach((progress, index) => {
            const progressBar = progress.querySelector(".progress-bar");
            
            tl
                .set(progressBar,
                    {
                        webkitClipPath: ``,
                        clipPath: ``
                    },
                    "animation"
                );
        });
        
        tl
            .call(jQuery.fn.hide.bind($(from)), [])
            .eventCallback("onComplete", resolve);
    });
}





////////////////////////////////////////////////////////////////////////
/////////////////////////////// PROJECTS ///////////////////////////////
////////////////////////////////////////////////////////////////////////

function projectsInAnimation(from, to, isBack) {
    const tl = gsap.timeline();

    tl
        .call(jQuery.fn.show.bind($(to)), [])
        .addLabel("allTogether")
        .from(to.querySelectorAll('h1'), {
            x: "-100%",
            duration: 0.5,
            delay: 0.4
        }, "allTogether")
        .from(to.querySelectorAll('.m-game'), {
            scale: 0.01,
            duration: 0.7,
            stagger: 0.3
        }, "allTogether")
}






////////////////////////////////////////////////////////////////////////
/////////////////////////////// CREDITS ////////////////////////////////
////////////////////////////////////////////////////////////////////////

function creditsInAnimation(from, to, isBack) {
    if (shouldShowSWEffect()) {
        showSWEffect();
    }
    else{
        showCredits();
    }
}

function creditsOutAnimation(from, to, isBack) {
    return new Promise((resolve, reject) => {
        if (shouldShowSWEffect()) {
            hideSWEffect(resolve);
        }
        else {
            hideCredits(resolve);
        }
    });
}

function showSWEffect(resolve) {
    const swContainer = document.getElementById("m-sw-container");
    const swBox = swContainer.querySelector("#m-sw-box");
    const swBoxContent = swBox.querySelector("#m-sw-box-content");
    const firstText = swContainer.querySelector("#m-sw-intro p");
    const secondText = swContainer.querySelector("#m-sw-intro h1");
    const background = document.getElementById("m-background-land");

    ANIM_DATA.credits.tl = gsap.timeline();

    ANIM_DATA.credits.tl
        .call(jQuery.fn.hide.bind($('#m-credits')), [])
        .call(jQuery.fn.show.bind($('#sw-checkbox')), [])
        .call(jQuery.fn.hide.bind($(background)), [])
        .call(jQuery.fn.hide.bind($(secondText)), [])
        .set(swBoxContent, { y: '100%' })
        .call(jQuery.fn.show.bind($(swContainer)), [])
        .call(jQuery.fn.show.bind($(firstText)), [])
        .add(gsap.delayedCall(3, jQuery.fn.hide.bind($(firstText)), []))
        .call(jQuery.fn.show.bind($(secondText)), [])
        .add("nowTogether")
        .fromTo(secondText, {
            scale: 3,
        },
            {
                scale: 0.01,
                duration: 30,
                onComplete: () => { $(secondText).hide(); }
            }, 'nowTogether')
        .to(swBoxContent, { y: '-100%', duration: 60, delay: 8 }, "nowTogether")
        .call(initScrollbar, []);
}

function hideSWEffect(resolve) {
    if (ANIM_DATA.credits.tl)   ANIM_DATA.credits.tl.kill();

    $('#sw-checkbox').hide();
    $("#m-sw-container").hide();
    $("#m-background-land").show();

    if (resolve)        resolve();
}

function showCredits(resolve) {
    const credits = document.getElementById("m-credits-container");
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

    gsap.timeline()
        .call(jQuery.fn.show.bind($('#sw-checkbox')), [])
        .call(jQuery.fn.show.bind($('#m-credits')), [])
        .fromTo(credits, {
            y: windowHeight + 50,
        },
        {
            duration: 0.7,
            y: 0,
        })
        .eventCallback("onComplete", resolve ? resolve : () => { });
}

function hideCredits(resolve) {
    const credits = document.getElementById("m-credits-container");
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

    gsap.timeline()
        .call(() => { GLOBALS.scrollPanel.scrollToY(0, { animateScroll: true, animateDuration: 0.7 }) })
        .to(credits, {
            duration: 0.7,
            y: windowHeight + 50
        })
        .call(jQuery.fn.hide.bind($('#sw-checkbox')), [])
        .call(jQuery.fn.hide.bind($('#m-credits')), [])
        .eventCallback("onComplete", resolve ? resolve : () => { });
}






////////////////////////////////////////////////////////////////////////
/////////////////////////////// GENERIC ////////////////////////////////
////////////////////////////////////////////////////////////////////////

function scrollOutAnimation(from, to, isBack) {
    new Promise(resolve =>
    {
        gsap.timeline()
            .call(() => { GLOBALS.scrollPanel.scrollToY(0, { animateScroll: true, animateDuration: 0.7 }) })
            .add(gsap.delayedCall(0.7, jQuery.fn.hide.bind($(from))), [])
            .eventCallback("onComplete", resolve);
    });
}