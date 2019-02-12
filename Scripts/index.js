////////////////////////////////////////////////////////////////////////
//////////////////////////////// GLOBALS ///////////////////////////////
////////////////////////////////////////////////////////////////////////

const GLOBALS = {
    textsToFit: document.getElementsByClassName('m-fit-text'),
    textIncrement : 1,
    sliderData: {}    
}
var menuGraph;



////////////////////////////////////////////////////////////////////////
////////////////////////////// FUNCTIONS ///////////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * It is called when page is fully loaded and setup all the necessary stuff.
 */
function setupPage() {
    menuGraph = new SM.Graph({shouldSave : true, logError : true});

    // Custom setup.
    bindAnimations();
    fitTexts();
    clickableItem();

    // Create slider.
    $('.m-slider').slider({ create: createSliderData, slide: updateSliderElements });
}

/**
 * Called on page resizing.
 */
function resizePage() {
    fitTexts();
}


/**
 * Resizes texts to perfectly fit container.
 */
function fitTexts() {
    // Resize all the visible texts.
    for (textToFit of GLOBALS.textsToFit) {

        if (textToFit.offsetParent) {
            const parentHeight = textToFit.parentElement.offsetHeight;
            const isLower = textToFit.offsetHeight < parentHeight ? 1 : -1;
            let currentSize = textToFit.style.fontSize ? parseInt(textToFit.style.fontSize, 10) : 20;

            while (currentSize && isLower > 0 ? textToFit.offsetHeight < parentHeight : textToFit.offsetHeight > parentHeight) {
                currentSize += GLOBALS.textIncrement * isLower;
                textToFit.style.fontSize = currentSize + 'px';
            }

            // If the height are equal, stop, otherwise make last change.
            if (textToFit.offsetHeight != parentHeight)
                textToFit.style.fontSize = currentSize - GLOBALS.textIncrement * isLower + 'px';
        }
    }
}

/**
 * Creates the logic behind the clickable items.
 */
function clickableItem() {
    $('.m-clickable').click(function () {
        window.open($(this).find('.m-link-target').attr("href"), '_blank');
    });
}

function createSliderData() {
    let childs = this.children;
    GLOBALS.sliderData[this.id] = { percentage: [], elems: [] };
    let elems = GLOBALS.sliderData[this.id].elems;
    let percentage = GLOBALS.sliderData[this.id].percentage;
    
    // Initialize array of percentage. The first position is for the current element's index.
    // The other positions are the max percentage to visualize that element.
    percentage.push(0);
    for(child of childs) {
        if (child.classList.contains('m-slider-percentage'))
            percentage.push(percentage[percentage.length - 1] + parseFloat(child.style.width));
    }

    // The index of the current element starts from 1, but 0 is needed to avoid
    // if branch into the for.
    percentage[0] = 1;

    // Set correct visibility.
    Array.from(document.getElementsByClassName('m-slider-section'))
        .filter(ele => ele.dataset.slider == this.id)
        .forEach(ele => { elems.push(ele); ele.style.display='none'; });

    elems[0].style.display = '';
}

function updateSliderElements(event, ui) {
    let percentage = GLOBALS.sliderData[this.id].percentage;
    let currEle = percentage[0];

    // Check if previous element need to be shown.
    if (currEle > 1 && percentage[currEle - 1] >= ui.value) {
        let elems = GLOBALS.sliderData[this.id].elems;
        
        $(elems[currEle - 2]).show();
        $(elems[currEle - 1]).hide();
        --percentage[0];
    }
    // Check if next item need to be shown.
    else if (currEle < percentage.length - 1 && percentage[currEle] < ui.value)
    {
        let elems = GLOBALS.sliderData[this.id].elems;

        $(elems[currEle - 1]).hide();
        $(elems[currEle]).show();
        ++percentage[0];
    }
}



////////////////////////////////////////////////////////////////////////
////////////////////////////// UTILITIES ///////////////////////////////
////////////////////////////////////////////////////////////////////////







////////////////////////////////////////////////////////////////////////
///////////////////////////// ANIMATIONS ///////////////////////////////
////////////////////////////////////////////////////////////////////////

function bindAnimations() {
    itemHovering();
}

function itemHovering() {
    let $items = $('.sm-item');

    $items.mouseenter( function () { 
        // Enter the item.
        let $hover = $(this).find('.m-item-hover');

        $hover.addClass('m-active');
        TweenMax.to($hover, 0.1, { top: '-100%' });
    });

    $items.mouseleave(function () {
        // Exit the item.
        let $hover = $(this).find('.m-item-hover');

        TweenMax.to($hover, 0.05, { top: 0, onComplete: () => { $hover.removeClass('m-active'); } });
    });
}

function inExperience($from, $experience, isBack) {
    $experience.show();

    updateSliderData();
}

////////////////////////////////////////////////////////////////////////
////////////////////////////// UTILITIES ///////////////////////////////
////////////////////////////////////////////////////////////////////////

