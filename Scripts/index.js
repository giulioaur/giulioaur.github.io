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
    loadingPercentage: 0,
    projCurrIndex: 0,
    sliderData: {},
    textsToFit: document.getElementsByClassName('m-fit-text'),
    textIncrement : 1,
    tip: [
        'You can navigate the site also using your keyboard and your joypad.'
    ]
}
var menuGraph;



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
            tipCreated = setTip();

        if (!startedAnimation)
            startedAnimation = startAnimation();

        if (GLOBALS.loadingPercentage == 100){
            document.getElementById("m-loading").style.display = 'none';

            clearInterval(loadingCheck);
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
    menuGraph = new SM.Graph({ shouldSave: true, logError: true, layoutMap: chooseLayout});
    bindDataFunction();
    GLOBALS.loadingPercentage = 75;

    // Custom setup. Put here to animate after first focus.
    bindAnimations();
    bindCustomEvents();
    GLOBALS.loadingPercentage = 80;

    // Setup graph input.
    SM.input.bindInput(menuGraph, GLOBALS.inputMap);
    GLOBALS.loadingPercentage = 90;

    // Custom setup.
    fitTexts();
    GLOBALS.loadingPercentage = 95;

    // Create slider.
    $('.m-slider').slider({ create: createSliderData, slide: updateSliderElements });
    $('.m-slider').draggable();
    GLOBALS.loadingPercentage = 100;
}

/**
 * Called on page resizing.
 */
function resizePage() {
    fitTexts(menuGraph.currentMenu.getElementsByClassName('m-fit-text'));
    menuGraph.forceUpdateLayout();
}


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
    for (textToFit of textsToResizes) {
        if (textToFit.offsetParent) {
            const min = textToFit.dataset.minfont;
            const max = textToFit.dataset.maxfont;
            const parentHeight = textToFit.parentElement.offsetHeight;
            const parentWidth = textToFit.parentElement.offsetWidth;
            const isLower = textToFit.offsetHeight < parentHeight ? 1 : -1;
            // Set the right starter size.
            let currentSize = textToFit.style.fontSize ? parseInt(textToFit.style.fontSize, 10) : 20;
            currentSize = currentSize.clamp(min, max);

            // Resize the text until the father size is not reached or text size overflows a range.
            while (currentSize && 
                    (isLower > 0 ? textToFit.offsetHeight < parentHeight : textToFit.offsetHeight > parentHeight) && 
                    isWithinRange(currentSize, min, max, isLower)) {
                currentSize += GLOBALS.textIncrement * isLower;
                textToFit.style.fontSize = currentSize + 'px';
            }

            // If the height are equal, stop, otherwise make last change.
            if (isLower > 0 && textToFit.offsetHeight > parentHeight && isWithinRange(currentSize, min, max, isLower)) {
                currentSize -= GLOBALS.textIncrement * isLower;
                textToFit.style.fontSize = currentSize + 'px';
            }

            // This normalize the result.
            textToFit.style.fontSize = currentSize.clamp(min, max) + 'px';

            // Get an extra check on the width since the text could oveflow by width.
            while (currentSize && textToFit.offsetWidth > parentWidth && isWithinRange(currentSize, min, max, -1)) {
                currentSize -= GLOBALS.textIncrement;
                textToFit.style.fontSize = currentSize + 'px';
            }            

            // Change overflow.
            textToFit.parentElement.style.overflowY = textToFit.offsetHeight > parentHeight ? 'scroll' : 'hidden';
        }
    }
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
//////////////////////////////// EVENTS ////////////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * Binds all the custom events.
 */
function bindCustomEvents() {
    skillsNavigation();
}

/**
 * Allows the navigation of skills section with keyboard/gamepad.
 */
function skillsNavigation() {
    const skills = document.querySelectorAll('#m-skills #m-skills-trees .m-skills-skill.sm-item');

    for(let skill of skills) {
        skill.addEventListener('sm-activate', (event) => {
            // Change visualized item only if item changing is not fired by mouse.
            if (!event.detail.isMouseTrigger) {
                // Simulate drag and drop.
                const ev = { dataTransfer: new DataTransfer(), target: event.target.getElementsByTagName("i")[0] };
                pickUpSkill(ev);
                ev.target = document.querySelector('#m-skills #m-skills-description #m-skills-icon-container > div');
                dropSkill(ev);
            }
        })
    }

    // For portrait carousel.
    skillsPortrait();
}

function skillsPortrait() {
    $('#m-skills-carousel').on('slid.bs.carousel', function () {
        fitTexts();

        // Simulate drag and drop.
        const ev = { dataTransfer: new DataTransfer(), target: document.querySelector('#m-skills-carousel .active i:first-of-type') };
        pickUpSkill(ev);
        ev.target = document.querySelector('#m-skills #m-skills-description #m-skills-icon-container > div');
        dropSkill(ev);
    });
    $('#m-skills-carousel').trigger('slid.bs.carousel');

    // Correctly resizes all icons within carousel.
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
}


function bindDataFunction() {
    menuGraph.addDataCallback((from, to) => {
        if (from.id == 'sm-main-menu') 
            SM.input.saveFocus(this.currentMenu, false, 'last');
        return true;
    }, true);
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
                        <i draggable="true" ondragstart="pickUpSkill(event)" class="${row[k].icon} m-fit-text"></i>
                    </div>
                `;

                skillDescr += `<p id="m-skills-${row[k].name}-descr">${row[k].description}</p>`;
                
                // Create svg or img for logo representation.
                if (row[k].svg)
                    skillImgs += `<svg viewBox="0 0 128 128" id="m-skills-${row[k].name}-img">${row[k].svg}</svg>`;
                else if (row[k].img)
                    skillImgs += `<img id="m-skills-${row[k].name}-img" src="${row[k].img}">`;
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
            <div class="m-projects-container h-100">
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


/**
 * Checks if a number has not overcame a certain boundaries.
 * 
 * @param {Number} number The current number.
 * @param {Number} min The minimum.
 * @param {Number} max The maximum.
 * @param {Number} isLower > 0 if current increases, < 0 if it decreases.
 * @returns {bool} true if the number has not overcame boundaries, false otherwise.
 */
function isWithinRange (number, min, max, isLower) {
    return !(isLower > 0 ? max && number > max : min && number < min); 
}

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
}




////////////////////////////////////////////////////////////////////////
///////////////////////////// ANIMATIONS ///////////////////////////////
////////////////////////////////////////////////////////////////////////

function bindAnimations() {
    itemHovering();
    projectsSelection();
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
            TweenMax.to(hover, event.detail.direction != 'last' ? 0.05 : 0.001, { top: 0, onComplete: () => { hover.classList.remove('m-active'); } });        
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

            projectRows[i].addEventListener(SM.CONST.inputActivationEvent, () => {                
                // Change visibility.
                projects[GLOBALS.projCurrIndex].style.display = 'none';
                projects[i].style.display = 'block';
                GLOBALS.projCurrIndex = i;

                // Fit text.
                fitTexts();
            });
        }

        // Call the visibility on first project.
        projectRows[0].fireEvent(SM.CONST.inputActivationEvent);
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
 * Highlights the first project entering the project menu.
 * 
 * @param {HTMLElement} from The old menu.
 * @param {HTMLElement} to The menu to show.
 * @param {Boolean} isBack True if this is a back transition.
 */
function enterProjects(from, to, isBack) {
    enterWithText(from, to, isBack);

    if (!document.querySelector('.m-projects-row.sm-active')) {
        document.querySelector('.m-projects-row').classList.add('sm-active');
        GLOBALS.projCurrIndex = 0;
    }
}