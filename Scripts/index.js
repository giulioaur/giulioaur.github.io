////////////////////////////////////////////////////////////////////////
//////////////////////////////// GLOBALS ///////////////////////////////
////////////////////////////////////////////////////////////////////////

const GLOBALS = {
    inputMap: {
        back: [66, 27],
        select: [13],
        down: [83, 40],
        left: [65, 37],
        up: [87, 38],
        right: [68, 39],
    },
    isSkillPicked: false,
    loadingPercentage: 0,
    projCurrIndex: -1,
    sliderData: {},
    textsToFit: document.getElementsByClassName('m-fit-text'),
    textIncrement : 1,
    tip: [
        'You can navigate the site also using your keyboard.',
        'Do you know? Sometimes a bug can be called "feature".',
        'Stealing data from your pc....',
        'Dogs are better than cats in anything but evilness.'
    ]
}
var menuGraph;



////////////////////////////////////////////////////////////////////////
//////////////////////////////// GLOBALS ///////////////////////////////
////////////////////////////////////////////////////////////////////////

const imageLoader = {

    _images : [],
    
    /**
     * Adds a new image to the list of the dynamically loaded images.
     * 
     * @param {String} url The url of the image to load.
     */
    loadImage(url) {
        // Add a new promises which is resolved after the image has been loaded.
        this._images.push(new Promise((resolve, reject) => {
            const image = new Image();
            img.addEventListener("load", () => resolve());
            img.addEventListener("error", () => reject());
            image.url = url;
        }));
    }, 

    /**
     * Waits for all the dynamic images to be fully loaded.
     * 
     * @returns {Boolean} True if all go well, false in case of error.
     */
    async waitForLoading() {
        const areCorrectlyLoaded = await Promise.all(this._images)
            .then(() => true)
            .catch(() => false);

        return areCorrectlyLoaded;
    }
};



////////////////////////////////////////////////////////////////////////
////////////////////////////// FUNCTIONS ///////////////////////////////
////////////////////////////////////////////////////////////////////////

(function startLoading() {
    // Here a function is created to reuse it in case of dynamic changing tips.
    const setTip = () => {
        const tipBox = document.getElementById('m-loading-tip');
        if (tipBox){
            tipBox.textContent = GLOBALS.tip[Math.floor(Math.random() * GLOBALS.tip.length)];
            tipBox.classList.remove('m-black');
            return true;
        }
        return false;
    }

    const startAnimation = () => {
        const image = document.getElementById('m-loading-image');
        if (image){
            const animation = TweenMax.to(image, 3, { rotationY: 360 * 3, ease: Power4.easeOut, onComplete: () => {
                if (GLOBALS.loadingPercentage != 100) {
                    animation.restart();
                }
            } });
            return true;
        }
        return false;
    }
    
    
    let isTipCreated = false, startedAnimation = false;
    let loadingCheck = setInterval(() => {
        // The tip element could not be loaded.
        if (!isTipCreated) 
            isTipCreated = setTip();

        if (!startedAnimation)
            startedAnimation = startAnimation();

        // Set correct percentage.
        const percentageBar = document.getElementById('m-loading-bar-percentage');
        if (percentageBar)
            percentageBar.style.width = GLOBALS.loadingPercentage + '%';

        if (GLOBALS.loadingPercentage == 100){
            setTimeout(() => {
                document.getElementById("m-loading").style.display = 'none';
                clearInterval(loadingCheck);
    
                // Play an enter animation for the menu.
                deferredEnterAnimation();
            }, 800)
        }
    }, 200);
})();


/**
 * It is called when page is fully loaded and setup all the necessary stuff.
 */
function setupPage() {
    GLOBALS.loadingPercentage = 30;
    // Dynamic generation of contents.
    dynamicGeneration();
    GLOBALS.loadingPercentage = 50;

    // Build the menu graph.
    menuGraph = new SM.Graph({ shouldSave: true, logError: false, layoutMap: chooseLayout, playFirstAnimation: false});
    GLOBALS.loadingPercentage = 70;

    // Custom setup. Put here to animate after first focus.
    bindAnimations();
    bindCustomEvents();
    GLOBALS.loadingPercentage = 73;

    // Setup graph input.
    SM.input.bindInput(menuGraph, GLOBALS.inputMap);
    GLOBALS.loadingPercentage = 87;

    // Custom setup.
    fitTexts();
    GLOBALS.loadingPercentage = 93;

    // Create slider.
    $('.m-slider').slider({ create: createSliderData, slide: updateSliderElements, change: updateSliderElements});
    $('.m-slider').draggable();
    GLOBALS.loadingPercentage = 95;

    imageLoader.waitForLoading();
    GLOBALS.loadingPercentage = 100;
}

/**
 * Called on page resizing.
 */
function resizePage() {
    fitTexts(menuGraph.currentMenu.getElementsByClassName('m-fit-text'));
}

/**
 * The function used to choose the correct menu.
 * 
 * @param {HTMLElement} menu The current menu.
 */
function chooseLayout(menu) {
    const width = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const aspectRatio = height / width;

    return aspectRatio <= 1 ? 'main' : 'portrait';
}

/**
 * Resizes texts to perfectly fit container.
 * 
 * @param {HTMLCollection} [textsToResizes] The texts to resize. If null, all visibles elements will be resized.
 *                                           It may be used due to performance reasons.
 */
function fitTexts(textsToResizes = null) {
    if (!textsToResizes) 
        textsToResizes = GLOBALS.textsToFit;

    // Resize all the visible texts.
    for (let textToFit of textsToResizes) {
        if (textToFit.offsetParent) {
            const min = textToFit.dataset.minfont;
            const max = textToFit.dataset.maxfont;
            const parentHeight = getElementSize(textToFit.parentElement)[0];
            const parentWidth = textToFit.parentElement.offsetWidth;
            
            // Set the right starter size.
            let currentSize = textToFit.style.fontSize ? parseInt(textToFit.style.fontSize, 10) : 20;
            currentSize *= (parentHeight / textToFit.offsetHeight);     // This helps to make much less cycle below
            currentSize = currentSize.clamp(min, max);
            textToFit.style.fontSize = currentSize + 'px';

            const isLower = textToFit.offsetHeight < parentHeight ? 1 : -1;

            // Resize the text until the father size is not reached or text size overflows a range.
            while (currentSize &&
                (isLower > 0 ? textToFit.offsetHeight < parentHeight : textToFit.offsetHeight > parentHeight) &&
                currentSize.isWithinRange(min, max)) {
                currentSize += GLOBALS.textIncrement * isLower;
                textToFit.style.fontSize = currentSize + 'px';
            }

            // If the height are equal, stop, otherwise make last change.
            if (isLower > 0 && textToFit.offsetHeight > parentHeight) {
                currentSize -= GLOBALS.textIncrement * isLower;
                textToFit.style.fontSize = currentSize + 'px';
            }

            // This normalize the result.
            textToFit.style.fontSize = currentSize.clamp(min, max) + 'px';

            // // Get an extra check on the width since the text could oveflow by width.
            // while (currentSize && textToFit.offsetWidth > parentWidth && currentSize.isWithinRange(min, max)) {
            //     currentSize -= GLOBALS.textIncrement;
            //     textToFit.style.fontSize = currentSize + 'px';
            // }

            // Change overflow.
            textToFit.parentElement.style.overflowY = textToFit.offsetHeight > parentHeight ? 'scroll' : 'hidden';
        }
    }
}







////////////////////////////////////////////////////////////////////////
//////////////////////////////// EVENTS ////////////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * Binds all the custom events.
 */
function bindCustomEvents() {
    skillsNavigation();

    touchEvents();

    // Correctly bind event in m-experience, since no starting animation is played.
    if (menuGraph.currentMenu.id == 'm-experience')
        document.addEventListener('keydown', changeSliderValue);
}

/**
 * Allows the navigation of skills section with keyboard/gamepad.
 */
function skillsNavigation() {
    const skills = document.querySelectorAll('#m-skills #m-skills-trees .m-skills-skill.sm-item');

    for(let skill of skills) {
        const changeItem = (event) => {
            // Change visualized item only if item changing is not fired by mouse.
            if (!event.detail.isMouseTrigger || event.detail.direction == 'click') {
                // Simulate drag and drop.
                const ev = { dataTransfer: new DataTransfer(), target: event.target.nodeName.toLowerCase() == 'i' ? event.target : event.target.getElementsByTagName("i")[0] };
                pickUpSkill(ev);
                ev.target = document.querySelector('#m-skills #m-skills-description #m-skills-icon-container > div');
                dropSkill(ev);
            }
        }
        skill.addEventListener('sm-activate', changeItem);
        skill.addEventListener('click', changeItem);
    }

    // For portrait carousel.
    skillsPortrait();
}

function skillsPortrait() {
    // Before sliding.
    $('#m-skills-carousel').on('slide.bs.carousel', function (event) {
        // Prevent carousel sliding if holding an item.
        if (GLOBALS.isSkillPicked)
            event.preventDefault();
    });

    // After sliding.
    $('#m-skills-carousel').on('slid.bs.carousel', function () {
        fitTexts();

        // Simulate drag and drop.
        const ev = { dataTransfer: new DataTransfer(), target: document.querySelector('#m-skills-carousel .active i:first-of-type') };
        pickUpSkill(ev);
        ev.target = document.querySelector('#m-skills #m-skills-description #m-skills-icon-container > div');
        dropSkill(ev);
    });
    // $('#m-skills-carousel').trigger('slid.bs.carousel');

    // Correctly resizes all icons within carousel (even if the not shown ones).
    const items = document.querySelectorAll('#m-skills-carousel .carousel-item');

    for (let item of items) {
        item.style.display = 'block';
        fitTexts(item.getElementsByClassName('m-fit-text'));
        item.style.display = '';
    }
}

/**
 * Recalled on dragging a skills icon. Saves some skill's attributes to use them 
 * on dropping event.
 * 
 * @param {DOMEvent} ev The drag event.
 */
function pickUpSkill(ev) {
    const style = window.getComputedStyle(ev.target.closest('.sm-item.sm-no-input'));

    // Save some attributes of the dragged skill.
    ev.dataTransfer.setData("background", style.getPropertyValue('background-color'));
    ev.dataTransfer.setData("id", ev.target.parentElement.id);

    GLOBALS.isSkillPicked = true;
}

/**
 * Recalled when a skill is dropped. Apply some changes to the skill's description div.
 * 
 * @param {DOMEvent} ev The drop event.
 */
function dropSkill(ev) {
    const descrDiv = ev.target.closest('#m-skills-description');

    // Change background color.
    descrDiv.style.backgroundColor = ev.dataTransfer.getData("background");

    // Show the right description.
    const oldDescr = descrDiv.querySelector('p.m-active');
    
    if(oldDescr)    oldDescr.classList.remove('m-active');
    descrDiv.querySelector(`p#${ev.dataTransfer.getData("id")}-descr`).classList.add('m-active');

    // Show the right img.
    const oldImg = descrDiv.querySelector('#m-skills-icon-container .m-active');

    if (oldImg)     oldImg.classList.remove('m-active');
    descrDiv.querySelector(`#m-skills-icon-container #${ev.dataTransfer.getData("id")}-img`).classList.add('m-active');

    // Resize texts.
    fitTexts(descrDiv.querySelectorAll(`p#${ev.dataTransfer.getData("id")}-descr`));

    GLOBALS.isSkillPicked = false;
}


/**
 * Slider callback to initiliaze slider data.
 */
function createSliderData() {
    let childs = this.children;
    GLOBALS.sliderData[this.id] = { percentage: [], elems: [] };
    let elems = GLOBALS.sliderData[this.id].elems;
    let percentage = GLOBALS.sliderData[this.id].percentage;

    // Initialize array of percentage. The first position is for the current element's index.
    // The other positions are the max percentage to visualize that element.
    percentage.push(0);
    for (child of childs) {
        if (child.classList.contains('m-slider-percentage'))
            percentage.push(percentage[percentage.length - 1] + parseFloat(child.style.width));
    }

    // The index of the current element starts from 1, but 0 is needed to avoid
    // if branch into the for.
    percentage[0] = 1;

    // Set correct visibility.
    Array.from(document.getElementsByClassName('m-slider-section'))
        .filter(ele => ele.dataset.slider == this.id)
        .forEach(ele => { elems.push(ele); ele.style.display = 'none'; });

    elems[0].style.display = '';
}

/**
 * Slider callback to change visualized element based on slider value.
 * 
 * @param {*} event 
 * @param {*} ui 
 */
function updateSliderElements(event, ui) {
    let percentage = GLOBALS.sliderData[this.id].percentage;
    let currEle = percentage[0];

    // Check if previous element need to be shown.
    if (currEle > 1 && percentage[currEle - 1] >= ui.value) {
        let elems = GLOBALS.sliderData[this.id].elems;

        elems[currEle - 2].style.display = '';
        elems[currEle - 1].style.display = 'none';
        --percentage[0];

        fitTexts(elems[currEle - 2].getElementsByClassName('m-fit-text'));
    }
    // Check if next item need to be shown.
    else if (currEle < percentage.length - 1 && percentage[currEle] < ui.value) {
        let elems = GLOBALS.sliderData[this.id].elems;

        elems[currEle - 1].style.display = 'none';
        elems[currEle].style.display = '';
        ++percentage[0];

        fitTexts(elems[currEle].getElementsByClassName('m-fit-text'));
    }
}


/**
 * Change the value of the sliders.
 * 
 * @param {Event} event 
 */
function changeSliderValue(event) {
    const increaseSlider = event.key == 'w' || event.key == 's';
    const decreaseSlider = event.key == 'q' || event.key == 'a';
    if (increaseSlider || decreaseSlider) {
        const $slider = event.key == 'q' || event.key == 'w' ? $('#m-edu-slider') : $('#m-job-slider');
        $slider.slider('value', $slider.slider('value') + (increaseSlider ? 1 : -1));
    }
}

function touchEvents() {
    // Allow sliding also if picked skill is not correctly dropped.
    if ('ontouchend' in window || (window.DocumentTouch && document instanceof DocumentTouch))
        document.addEventListener('touchend', e => GLOBALS.isSkillPicked = false);

}


////////////////////////////////////////////////////////////////////////
///////////////////////// DYNAMIC GENERATION ///////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * Add all the dynamic-generated content.
 */
function dynamicGeneration() {
    generateProjects();
    generateSkills();
}

/**
 * Fullify the skills' session.
 */
function generateSkills() {
    let skillRows = ['<div class="col h-100 p-0"><div id="m-skills-programming" class="sm-item sm-no-input m-programming-skill w-100 h-100"><div class="w-100 m-skills-title"><h1 class="m-fit-text">Programming</h1></div>', 
                     '<div class="col h-100 p-0"><div id="m-skills-tools" class="sm-item sm-no-input m-tools-skill w-100 h-100"><div class="w-100 m-skills-title"><h1 class="m-fit-text">Tools</h1></div>', 
                     '<div class="col h-100 p-0"><div id="m-skills-knowledge" class="sm-item sm-no-input m-knowledge-skill w-100 h-100"><div class="w-100 m-skills-title"><h1 class="m-fit-text">Knowledge</h1></div>'];
    let skillDescr = '';
    let skillImgs = '';
    const rowNums = 5;

    skillDescr += `
    <p id="m-skills-start-descr" class="m-fit-text m-active" data-minfont="13">
        Drag the skill into the square to the left or click on it to read its description. It works also on mobile, even if the item seems not to be dragged.
    </p>
    `

    for (let i = 0; i < GLOBALS.skills.length; ++i) {
        const category = GLOBALS.skills[i];

        // Creates the levels of each category.
        for (let j = 0; j < rowNums; ++j) {
            const row = j < category.length ? category[j] : null;
            skillRows[i] += '<div class="row justify-content-center w-100 m-0">';

            // Creates all the element skills-related.
            for (let k = 0; row && k < row.length; ++k) {
                skillRows[i] += `
                    <div id="m-skills-${row[k].name}" class="col-4 m-skills-skill sm-item h-100 p-0">
                        <i draggable="true" ondragstart="pickUpSkill(event)" ${row[k].icon}></i>
                    </div>
                `;

                skillDescr += `<p id="m-skills-${row[k].name}-descr" class="m-fit-text" data-minfont="13" data-maxfont="22">${row[k].description}</p>`;
                
                // Create svg or img for logo representation.
                if (row[k].svg){
                    skillImgs += `<svg viewBox="0 0 128 128" id="m-skills-${row[k].name}-img">${row[k].svg}</svg>`;
                }
                else if (row[k].img){
                    skillImgs += `<img id="m-skills-${row[k].name}-img" src="${row[k].img}">`;
                    imageLoader.loadImage(row[k].img);
                }
            }

            skillRows[i] += '</div>';
        }
    }

    // Close rows
    let allRows = '';

    for (let i = 0; i < skillRows.length; ++i) {
        skillRows[i] += '</div></div>';
        allRows += skillRows[i];
    }

    
    // Add it to the dom.
    document.querySelector('#m-skills > .sm-main-layout > #m-skills-trees').innerHTML = allRows;
    document.querySelector('#m-skills #m-skills-icon-container > div').innerHTML = skillImgs;
    document.querySelector('#m-skills > #m-skills-description > div:nth-child(2)').innerHTML = skillDescr;

    // Add fit text class to all icon
    const icons = document.querySelectorAll('#m-skills > .sm-main-layout > #m-skills-trees i');
    for (let icon of icons)     icon.classList.add("m-fit-text");
}

/**
 * Fullify the projects' session.
 */
function generateProjects() {
    let list = '';
    let descriptions = '';

    // Creates all the project.
    for (project of GLOBALS.projects) {
        list += `
            <div class="m-projects-row sm-item d-flex align-items-center">
                ${project.title}
            </div>
        `;

        descriptions += `
            <div class="m-projects-container h-100 sm-redirect-blank-item" data-goto="${project.link}">
                <div class="m-projects-banner d-flex align-items-center justify-content-center"
                style="background-image: url('${project.screen}')">
                    <h1>${project.extendedTitle}</h1>
                </div>
                <div class="m-projects-description">
                    <p class="m-fit-text" data-maxfont="30" data-minfont="15">
                        ${project.description}
                    </p>
                </div>
            </div>
        `;

        // Add the image to the dynamically loaded list.
        imageLoader.loadImage(project.screen);
    }

    // Add it to the dom.
    document.querySelector('#m-projects > .sm-main-layout > .row > div:first-child').innerHTML = list;
    document.querySelector('#m-projects > .sm-main-layout > .row > div:nth-child(2)').innerHTML = descriptions;
}







////////////////////////////////////////////////////////////////////////
////////////////////////////// UTILITIES ///////////////////////////////
////////////////////////////////////////////////////////////////////////


/**
 * Returns a number whose value is limited to the given range.
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function (min, max) {
    const first = min ? Math.max(this, min) : this;
    return max ? Math.min(first, max) : first;
};

Number.prototype.lowerWithinTreshold = function(limit, threshold) {
    return this <= limit && this >= limit - threshold; 
};

/**
 * Checks if a number has not overcame a certain boundaries.
 * 
 * @param {Number} min The minimum.
 * @param {Number} max The maximum.
 * @returns {bool} true if the number has not overcame boundaries, false otherwise.
 */
Number.prototype.isWithinRange = function(min, max) {
    return  (!min || this >= min) && (!max || this <= max); 
};

/**
 * Call an event on an HTMLElement.
 * 
 * @param {string} eventName The event name.
 * @param {bool} [bubbles = true] True if event should be called during bubbling.
 * @param {bool} [cancelable = true] if event could be cancelled. 
 */
HTMLElement.prototype.fireEvent = function (eventName, bubbles = true, cancelable = true) {
    let event = new Event(eventName, { 'view': window, 'bubbles': bubbles, 'cancelable': cancelable });
    this.dispatchEvent(event);
};

/**
 * Return the true sizes of an element, without padding.
 * 
 * @returns {[Number]} The height and the width of an element.
 */
function getElementSize(element)
{
    const style = window.getComputedStyle(element);
    const verticalEmptySpace = Math.max(myParseInt(style.paddingTop), 0) + Math.max(myParseInt(style.paddingBottom), 0) +
        Math.max(myParseInt(style.borderTop), 0) + Math.max(myParseInt(style.borderBottom), 0);
    const horizontalEmptySpace = Math.max(myParseInt(style.paddingLeft), 0) + Math.max(myParseInt(style.paddingRight), 0) +
        Math.max(myParseInt(style.borderLeft), 0) + Math.max(myParseInt(style.borderRight), 0);
    return [element.offsetHeight - verticalEmptySpace , element.offsetWidth - horizontalEmptySpace];
}

/**
 * A parseInt function that returns 0 instead of NaN.
 * 
 * @param {String} str The string to parse.
 * @param {Number} radix The radix of the result.
 */
function myParseInt(str, radix = 10)
{
    const result = parseInt(str, radix);
    return result ? result : 0;
}




////////////////////////////////////////////////////////////////////////
///////////////////////////// ANIMATIONS ///////////////////////////////
////////////////////////////////////////////////////////////////////////

function bindAnimations() {
    itemHovering();
    projectsSelection();
}

/**
 * Plays an enter animation for the current menu.
 */
function deferredEnterAnimation() {
    if (menuGraph.currentMenu.id == 'm-projects')
        enterProjects(null, menuGraph.currentMenu);
}

/**
 * Creates the hovering effect on the menu's items.
 */
function itemHovering() {
    let $items = $('.sm-item');

    $items.bind( 'sm-activate', function (event) { 
        // Enter the item.
        let hover = this.querySelector('.m-item-hover');

        if (hover) {
            hover.classList.add('m-active');
            TweenMax.to(hover, event.detail.direction != 'restoreFocus' ?  0.1 : 0.001, { top: '-100%' });
        }
    });

    $items.bind( 'sm-deactivate', function (event) {
        // Exit the item.
        let hover = this.querySelector('.m-item-hover');

        if (hover)
            TweenMax.to(hover, event.detail.direction != 'leaveMenu' ? 0.05 : 0.001, { top: 0, onComplete: () => { hover.classList.remove('m-active'); } });        
    });
}

/**
 * Setup the projects section adding the possibility of switching between
 * the projects with mouse hovering.
 */
function projectsSelection() {
    const projectRows = document.getElementsByClassName('m-projects-row');
    const projects = document.getElementsByClassName('m-projects-container');

    if (projects.length == projectRows.length) {
        // Bind project's changing on hovering the mouse.
        for (let i = 0; i < projectRows.length; ++i) {
            projects[i].style.display = 'none';

            projectRows[i].addEventListener(SM.CONST.inputActivationEvent, (event) => {                
                // Change visibility.
                if (GLOBALS.projCurrIndex >= 0 && GLOBALS.projCurrIndex < projects.length)
                    projects[GLOBALS.projCurrIndex].style.display = 'none';
                projects[i].style.display = 'block';
                GLOBALS.projCurrIndex = i;

                // Fit text.
                fitTexts();
            });
        }
    }
    else {
        console.error("At least one project is not correctly setup.");
    }
}


/**
 * Show the new menu with a basic transition, fitting the texts before entering.
 * 
 * @param {HTMLElement} from The old menu.
 * @param {HTMLElement} to The menu to show.
 * @param {Boolean} isBack True if this is a back transition.
 */
function enterWithText(from, to, isBack) {
    to.style.opacity = 0;
    to.style.display = '';

    fitTexts(to.getElementsByClassName('m-fit-text'));

    to.style.opacity = 1;
}

/**
 * Show the new menu with a basic transition, fitting the texts before entering and 
 * setting focus on the last focused element if transition has been triggered by mouse.
 *
 * @param {HTMLElement} from The old menu.
 * @param {HTMLElement} to The menu to show.
 * @param {Boolean} isBack True if this is a back transition.
 */
function enterWithRestore(from, to, isBack) {
    enterWithText(from, to, isBack);

    if (from && SM.input.wasKeyboard) {
        SM.input.restoreFocus(to);
    }
}

/**
 * Show the new menu with a basic transition, fitting the texts before entering and
 * setting focus on the first item if transition has been triggered by mouse.
 *
 * @param {HTMLElement} from The old menu.
 * @param {HTMLElement} to The menu to show.
 * @param {Boolean} isBack True if this is a back transition.
 */
function enterWithFirstFocus(from, to, isBack) {
    enterWithText(from, to, isBack);

    if (from && SM.input.wasKeyboard) {
        SM.input.setFocusOn(to, 0);
    }
}

/**
 * There are a lot of texts to resize, but since only icons are visible at beginning, it is
 * enough to resize just them.
 * 
 * @param {HTMLElement} from The old menu.
 * @param {HTMLElement} to The menu to show.
 * @param {Boolean} isBack True if this is a back transition.
 */
function exitWithSaving(from, to, isBack) {
    SM.input.saveFocus(from);
    from.style.display = 'none';
}

/**
 * Show the new menu with a basic transition, fitting the texts before entering.
 * 
 * @param {HTMLElement} from The old menu.
 * @param {HTMLElement} to The menu to show.
 * @param {Boolean} isBack True if this is a back transition.
 */
function enterSkills(from, to, isBack) {
    const portraitMode = chooseLayout(to) == 'portrait';
    to.style.opacity = 0;
    to.style.display = '';

    // Resize all carousel items.
    if (portraitMode) {
        const hiddenItem = to.querySelectorAll('.carousel-item:not(.active)');
        hiddenItem.forEach( i => i.style.display = 'block');

        fitTexts(to.getElementsByClassName('m-fit-text'));

        hiddenItem.forEach(i => i.style.display = '');
    }
    else {
        fitTexts(to.getElementsByClassName('m-fit-text'));
    }

    to.style.opacity = 1;
}

/**
 * Highlights the first project entering the project menu.
 * 
 * @param {HTMLElement} from The old menu.
 * @param {HTMLElement} to The menu to show.
 * @param {Boolean} isBack True if this is a back transition.
 */
function enterExperience(from, to, isBack) {
    document.addEventListener('keydown', changeSliderValue);
    enterWithFirstFocus(from, to, isBack);
}

/**
 * Highlights the first project entering the project menu.
 * 
 * @param {HTMLElement} from The old menu.
 * @param {HTMLElement} to The menu to show.
 * @param {Boolean} isBack True if this is a back transition.
 */
function exitExperience(from, to, isBack) {
    document.removeEventListener('keydown', changeSliderValue);
    from.style.display = 'none';
}

/**
 * Highlights the first project entering the project menu.
 * 
 * @param {HTMLElement} from The old menu.
 * @param {HTMLElement} to The menu to show.
 * @param {Boolean} isBack True if this is a back transition.
 */
function enterProjects(from, to, isBack) {
    enterWithText(from, to, isBack);
    SM.input.restoreFocus(to);
}