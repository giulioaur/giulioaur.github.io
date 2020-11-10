////////////////////////////////////////////////////////////////////////
////////////////////////////// MAIN MENU ///////////////////////////////
////////////////////////////////////////////////////////////////////////

const ANIM_DATA = {
    mainMenu: { oldPos: 0 },
    credits: { tl: {} }
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
        .set(carousel, { height: "auto" })
        .set(carouselContainer, { justifyContent: "" })
        .set(selectedItem, { x: 0 })
        .call(m_carousel.restoreItem, [selectedItem, true])
        .call(jQuery.fn.show.bind($(items)), [])
        .set(carouselContainer, { x: ANIM_DATA.mainMenu.oldScroll });

    SM.input.restoreFocus(to);
}



////////////////////////////////////////////////////////////////////////
//////////////////////////////// SKILLS ////////////////////////////////
////////////////////////////////////////////////////////////////////////

function skillsInAnimation(from, to, isBack) 
{
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
            .to(from, {
                duration: 1,
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

    tl
        .call(jQuery.fn.show.bind($(to)), [])
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
            .addLabel("animation");

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
/////////////////////////////// CREDITS ////////////////////////////////
////////////////////////////////////////////////////////////////////////

function creditsInAnimation(from, to, isBack) {
    const swContainer = document.getElementById("m-sw-container");
    const swBox = swContainer.querySelector("#m-sw-box");
    const swBoxContent = swBox.querySelector("#m-sw-box-content");
    const firstText = swContainer.querySelector("#m-sw-intro p");
    const secondText = swContainer.querySelector("#m-sw-intro h1");
    const creditsContainer = to.querySelector("#m-credits-container");
    const background = document.getElementById("m-background-land");

    ANIM_DATA.credits.tl = gsap.timeline();
    
    ANIM_DATA.credits.tl
        .call(jQuery.fn.hide.bind($(to)), [])
        .call(jQuery.fn.hide.bind($(background)), [])
        .call(jQuery.fn.hide.bind($(secondText)), [])
        .set(swBoxContent, { innerHTML: creditsContainer.innerHTML, y: '80%' })
        .call(jQuery.fn.show.bind($(swContainer)), [])
        .call(jQuery.fn.show.bind($(firstText)), [] )
        .add(gsap.delayedCall(2, jQuery.fn.hide.bind($(firstText)), [] ))
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
        .to(swBoxContent, {y: '-100%', duration: 60, delay: 10}, "nowTogether")
        .call(initScrollbar, []);
}

function creditsOutAnimation(from, to, isBack) {
    return new Promise((resolve, reject) => {
        ANIM_DATA.credits.tl.kill();

        $(document.getElementById("m-sw-container")).hide();
        $(document.getElementById("m-background-land")).show();

        resolve();
    });
}

////////////////////////////////////////////////////////////////////////
/////////////////////////////// HELPER /////////////////////////////////
////////////////////////////////////////////////////////////////////////