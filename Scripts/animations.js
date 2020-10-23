////////////////////////////////////////////////////////////////////////
////////////////////////////// MAIN MENU ///////////////////////////////
////////////////////////////////////////////////////////////////////////
let tmp = 0;

function mainMenuOutAnimation(from, to, isBack) 
{
    const carouselContainer = document.getElementById("m-carousel").children[0];
    const selectedItem = document.querySelector("#sm-main-menu .sm-item[data-goto=\"" + to.id + "\"]");
    const items = document.querySelectorAll("#sm-main-menu .sm-item");
    const containerX = gsap.getProperty(carouselContainer, "x");
    const x = $(selectedItem).position().left + (containerX ? containerX : 0); // #TODO change offset with position, maybe pass logic to carousel.

    tmp = - $(selectedItem).position().left;

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
        .call(hideElements, [items])
        .call(m_carousel.clearItem, [selectedItem])
        .set(carouselContainer, { x: 0 })
        .set(carouselContainer, { justifyContent: "start" })
        .add("nowTogether")
        .from(selectedItem, { x: x, duration: 0.5 }, "nowTogether")
        .set(selectedItem, { transformOrigin: "top left" }, "nowTogether")
        .to(selectedItem, { scale: 0.35, duration: 0.5 }, "nowTogether");
}

function mainMenuInAnimation(from, to, isBack) 
{
    const carouselContainer = document.getElementById("m-carousel").children[0];
    const selectedItem = document.querySelector("#sm-main-menu .sm-item[data-goto=\"" + from.id + "\"]");
    const items = document.querySelectorAll("#sm-main-menu .sm-item");    
    
    const tl = gsap.timeline();

    tl
        .to(selectedItem, { scale: 1, duration: 0.5 })
        .set(carouselContainer, { justifyContent: "" })
        .call(m_carousel.restoreItem, [selectedItem, true])
        .call(element => { $(element).show(); }, [items])
        .set(carouselContainer, { x : tmp });

}