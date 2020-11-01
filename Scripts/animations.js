////////////////////////////////////////////////////////////////////////
////////////////////////////// MAIN MENU ///////////////////////////////
////////////////////////////////////////////////////////////////////////

const ANIM_DATA = {
    mainMenu: { oldPos: 0 }
}



////////////////////////////////////////////////////////////////////////
////////////////////////////// MAIN MENU ///////////////////////////////
////////////////////////////////////////////////////////////////////////

function mainMenuOutAnimation(from, to, isBack) 
{
    const carouselContainer = document.getElementById("m-carousel").children[0];
    const selectedItem = document.querySelector("#sm-main-menu .sm-item[data-goto=\"" + to.id + "\"]");
    const items = document.querySelectorAll("#sm-main-menu .sm-item");
    const textContainer = selectedItem.querySelector(".m-item-title");
    const iconContainer = selectedItem.querySelector(".m-item-hover");
    const containerX = gsap.getProperty(carouselContainer, "x");
    const x = $(selectedItem).position().left + (containerX ? containerX : 0);

    ANIM_DATA.mainMenu.oldPos = - $(selectedItem).position().left;

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
        .add("nowTogether")
        .from(selectedItem, { x: x, duration: 0.5 }, "nowTogether")
        .set(selectedItem, { transformOrigin: "top left" }, "nowTogether")                      // While scaling it.
        .to(selectedItem, { scale: 0.35, duration: 0.5 }, "nowTogether")
        .set(textContainer, {background: 'none'})                                               // Move the background to the right.
        .to(textContainer, {x: selectedItem.offsetWidth});
}

function mainMenuInAnimation(from, to, isBack) 
{
    const carouselContainer = document.getElementById("m-carousel").children[0];
    const selectedItem = document.querySelector("#sm-main-menu .sm-item[data-goto=\"" + from.id + "\"]");
    const items = document.querySelectorAll("#sm-main-menu .sm-item");    
    const textContainer = selectedItem.querySelector(".m-item-title");
    
    const tl = gsap.timeline();

    tl
        .to(textContainer, {x: 0})
        .set(textContainer, {background: ''})  
        .call(DOMTokenList.prototype.remove.bind(selectedItem.classList), ["m-item-selected"])
        .to(selectedItem, { scale: 1, duration: 0.5 })
        .set(carouselContainer, { justifyContent: "" })
        .call(m_carousel.restoreItem, [selectedItem, true])
        .call(element => { $(element).show(); }, [items])
        .set(carouselContainer, { x: ANIM_DATA.mainMenu.oldPos });

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
        .call(createScroller, [to])
        .set(to, { y: 0})
        .from(skills, {
            duration: 0.7,
            y: windowHeight + skillHeight,
            stagger: 0.1
        });
}

function skillsOutAnimation(from, to, isBack) 
{
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const skillHeight = 100;

    gsap.timeline()
        .to(from, {
            duration: 1,
            y: windowHeight + skillHeight,
        })
        .call(jQuery.fn.hide.bind($(from)));
}



////////////////////////////////////////////////////////////////////////
/////////////////////////////// CREDITS ////////////////////////////////
////////////////////////////////////////////////////////////////////////

function creditsInAnimation(from, to, isBack) 
{
    const swContainer = document.getElementById("m-sw-container");
    const swBox = swContainer.querySelector("#m-sw-box");
    const swBoxContent = swBox.querySelector("#m-sw-box-content");
    const firstText = swContainer.querySelector("#m-sw-intro p");
    const secondText = swContainer.querySelector("#m-sw-intro h1");
    const creditsContainer = to.querySelector("#m-credits-container");

    gsap.timeline()
        .call(jQuery.fn.show.bind($(swContainer)), [] )
        .call(jQuery.fn.show.bind($(firstText)), [] )
        .add(gsap.delayedCall(2, jQuery.fn.hide.bind($(firstText)), [] ))
        .set(swBoxContent, { innerHTML: creditsContainer.innerHTML, y: '80%' })
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
        .to(swBoxContent, {y: '-100%', duration: 60, delay: 10}, "nowTogether");
}



////////////////////////////////////////////////////////////////////////
/////////////////////////////// HELPER /////////////////////////////////
////////////////////////////////////////////////////////////////////////


function simpleScrollerInAnimation(from, to, isBack) {
    $(to).show();

    createScroller(to);
}

function createScroller(menu, useGhostScroller = true) {
    $(menu).jScrollPane({
        contentWidth: 1,
        maintainPosition: false
    });

    if (useGhostScroller)
    {
        $(menu).bind(
            'jsp-will-scroll-y',
            getGhostScrollbarCallback(menu)
        );
    
        getGhostScrollbarCallback(menu)();
    }
}

function getGhostScrollbarCallback(container, delay = 1000) {
    let fadingCallback;

    return (event, destY) => {
        const $scrollBar = $(container.querySelector(".jspVerticalBar"));
        const effectDurability = 300;

        $scrollBar.fadeIn(effectDurability);

        if (fadingCallback)
        {
            clearTimeout(fadingCallback);
        }

        fadingCallback = setTimeout(() => { $scrollBar.fadeOut(effectDurability); }, delay);
    };
}