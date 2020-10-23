////////////////////////////////////////////////////////////////////////
////////////////////////// CAROUSEL FUNCTION ///////////////////////////
////////////////////////////////////////////////////////////////////////
"use strict";

// use a "namespace".
const m_carousel = 
{
  
carousel : {},
innerContainer : {},
items : {},
carouselState: {},
activeItemClass: "m-carousel-item-active",
currentTween: null,


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

    let width = 0;

    this.items.forEach((item, i) =>
    {
        width += item.offsetWidth;

        item.onmouseenter = () => { this.goToItem(i); };
    });

    // The width of the inner container must be at least as big as the sum of the child's width.
    // Add some more space too to allow spacing among elements.
    this.innerContainer.style.width = width + ((4.0/5.0) * width) + "px";

    // One element at time must always be active.
    if (!this.innerContainer.querySelector(`.${this.activeItemClass}`))
    {
        this.items[0].classList.add(this.activeItemClass);
    }
},

goToItem(toIndex)
{
    if (toIndex < 0 || toIndex >= this.items.length)     return;

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
    item.onmouseenter = null;
},

restoreItem(item, isActive)
{
    if (isActive)   item.classList.add(m_carousel.activeItemClass);
    
    let itemIndex = 0;
    for (itemIndex; itemIndex < m_carousel.items.length; ++itemIndex)
    {
        if (m_carousel.items[itemIndex] == item)  break;
    }

    item.onmouseenter = () => { m_carousel.goToItem(itemIndex); };
}

}


////////////////////////////////////////////////////////////////////////
//////////////////////////// RUNTIME SETUP /////////////////////////////
////////////////////////////////////////////////////////////////////////

$(document).ready(() => {
    m_carousel.initCarousel();
});