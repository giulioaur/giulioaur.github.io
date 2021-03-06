////////////////////////////////////////////////////////////////////////
////////////////////////// CAROUSEL FUNCTION ///////////////////////////
////////////////////////////////////////////////////////////////////////
"use strict";

// use a "namespace".
const m_carousel = 
{
  
carousel : null,
innerContainer : null,
items : [],
carouselState: {},
activeItemClass: "m-carousel-item-active",
currentTween: null,
width: 0,


initCarousel()
{
    this.carousel = document.getElementById("m-carousel");
    this.innerContainer = this.carousel.children[0];
    this.items = this.carousel.querySelectorAll(".m-carousel-item");

    //#TODO make it onmouseover.
    this.carousel.querySelector(".m-carousel-control-left").onmouseenter = 
        () => { this.goToItem(this.getLeftOuterElement()); };
    this.carousel.querySelector(".m-carousel-control-right").onmouseenter = 
        () => { this.goToItem(this.getRightOuterElement()); };

    this.resize();

    this.bindTouchEvents();
},

goToItem(toIndex)
{
    if (toIndex < 0 || toIndex >= this.items.length || !this.innerContainer)     return;

    const previousElement = this.innerContainer.querySelector(`.${this.activeItemClass}`);
    const nextElement = this.items[toIndex];

    const position = $(nextElement).position().left;
    const x = gsap.getProperty(this.innerContainer, "x");
    
    if (position <= -x)
    {
        this.stopAnim();
        this.currentTween = gsap.to(this.innerContainer, {x: Math.min(0, x + nextElement.offsetWidth), duration: 0.7});
    }
    else if (position + nextElement.offsetWidth >= -x + this.carousel.offsetWidth)
    {
        this.stopAnim();
        this.currentTween = gsap.to(this.innerContainer, {x: x - nextElement.offsetWidth, duration: 0.7});
    }


    if (previousElement)    previousElement.classList.remove(this.activeItemClass);
    nextElement.classList.add(this.activeItemClass);
},

getLeftOuterElement()
{
    const x = gsap.getProperty(this.innerContainer, "x");

    for (let i = 0; i < this.items.length; ++i)
    {
        if ($(this.items[i]).position().left > -x)
        {
            return i - 1;
        }
    }
},

getRightOuterElement()
{
    const x = gsap.getProperty(this.innerContainer, "x");

    for (let i = this.items.length - 1; i > 0; --i)
    {
        const currItem = this.items[i];
        if ($(currItem).position().left + currItem.offsetWidth < -x + this.carousel.offsetWidth)
        {
            return i + 1;
        }
    }
},

stopAnim()
{
    if (this.currentTween)
    {
        this.currentTween.kill();
    }
},

clearItem(item)
{
    item.classList.remove(m_carousel.activeItemClass);
},

restoreItem(item, isActive)
{
    if (isActive)   item.classList.add(m_carousel.activeItemClass);
},

resize()
{
    this.width = 0;
    
    if (this.items.length > 0)
    {
        this.items.forEach((item, i) =>
        {
            this.width += item.offsetWidth;
        });
    
        this.width = Math.max(this.width + ((4.0 / 5.0) * this.width), document.getElementById('m-carousel').offsetWidth);
    }

    // The width of the inner container must be at least as big as the sum of the child's width.
    // Add some more space too to allow spacing among elements.
    this.innerContainer.style.width = this.width + "px";
},

bindTouchEvents()
{
    const self = this;
    const minRight = - (this.innerContainer.offsetWidth - this.items[0].offsetWidth * 3);
    let current = 0;
    let momentum = 0;
    let momentumDecreaser;

    this.innerContainer.addEventListener("touchstart", evt => {
        const touch = evt.changedTouches[0];

        if (!touch) return;

        current = touch.pageX;

        momentumDecreaser = setInterval(() => momentum = momentum > 0 ? Math.max(momentum - 1, 0) : Math.min(momentum + 1, 0), 0.2);
    }, false);

    this.innerContainer.addEventListener("touchend", evt => {
        const touch = evt.changedTouches[0];

        if (!touch) return;

        const x = gsap.getProperty(self.innerContainer, "x");
        const target = x - momentum;
        
        self.stopAnim();
        self.currentTween = gsap.to(self.innerContainer, { x: target.clamp(minRight, 0) });

        clearInterval(momentumDecreaser);
    }, false);

    this.innerContainer.addEventListener("touchmove", evt => {
        const touch = evt.changedTouches[0];

        if (!touch) return;

        const prev = current;
        const curr = touch.pageX;
        const x = gsap.getProperty(self.innerContainer, "x");
        const target = x - (prev - curr) * 10;
        momentum += 4 * Math.sign(prev - curr);

        self.currentTween = gsap.to(self.innerContainer, { x: target.clamp(minRight, 0)});
        current = curr;
    }, false);
}

}


////////////////////////////////////////////////////////////////////////
//////////////////////////// RUNTIME SETUP /////////////////////////////
////////////////////////////////////////////////////////////////////////

$(document).ready(() => {
    m_carousel.initCarousel();
});

$(window).resize(() => {
    m_carousel.resize();
});