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
    projCurrIndex: -1,
    textsToFit: document.getElementsByClassName('m-fit-text'),
    textIncrement : 1,
    tip: [
        'You can navigate the site also using your keyboard.',
        'Do you know? Sometimes a bug can be called "feature".',
        'Stealing data from your pc....',
        'Have a puuuurfect day :3'
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
    menuGraph = new SM.Graph({ shouldSave: false, logError: true, layoutMap: chooseLayout, playFirstAnimation: false});
    GLOBALS.loadingPercentage = 70;

    // Custom setup. Put here to animate after first focus.
    bindAnimations();
    GLOBALS.loadingPercentage = 73;

    // Setup graph input.
    SM.input.bindInput(menuGraph, GLOBALS.inputMap, {firstFocus: true});
    GLOBALS.loadingPercentage = 87;

    // Custom setup.
    fitTexts();
    GLOBALS.loadingPercentage = 93;

    initScrollbar();
    menuGraph.addDataCallback((oldMenu, newMenu) => { $(newMenu).show(); initScrollbar(); return true; }, true);
    menuGraph.addDataCallback(initScrollbar, false);
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


function initScrollbar(shouldMantain = false) {
    const scrollPanels = document.getElementById("m-menu-container");

    $(scrollPanels).jScrollPane({
        contentWidth: 1,
        maintainPosition: shouldMantain
    });

    $(scrollPanels).bind(
        'jsp-will-scroll-y',
        getGhostScrollbarCallback(scrollPanels)
    );

    getGhostScrollbarCallback(scrollPanels)();

    updateScrollingPanelHeight();
}

function getGhostScrollbarCallback(container, delay = 1000) {
    let fadingCallback;

    return (event, destY) => {
        const $scrollBar = $(container.querySelector(".jspVerticalBar"));
        const effectDurability = 300;

        $scrollBar.fadeIn(effectDurability);

        if (fadingCallback) {
            clearTimeout(fadingCallback);
        }

        fadingCallback = setTimeout(() => { $scrollBar.fadeOut(effectDurability); }, delay);
    };
}

function updateScrollingPanelHeight() {
    const jspContainer = document.querySelector("#sm-viewport .jspContainer");
    const height = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    jspContainer.style.height = height - document.getElementById("sm-main-menu").offsetHeight + "px";
}

////////////////////////////////////////////////////////////////////////
///////////////////////// DYNAMIC GENERATION ///////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * Add all the dynamic-generated content.
 */
function dynamicGeneration() {
    // generateProjects();
    generateSkills();
    generateExperiences();
}

/**
 * Fill the skills' session.
 */
function generateSkills() {
    let skillsList = "";
    let skillCategory;

    for (skillCategory of GLOBALS.skills) 
    {
        skillCategory.forEach((skill) => {
            let skillImg = "";
            const skillTag = skill.name.replace(/\s+/g, '-');
            // Create svg or img for logo representation.
            if (skill.icon) {
                const content = skill.iconContent ? skill.iconContent : "";
                skillImg = `<i id="m-skills-${skillTag}-img" ${skill.icon}>${content}</i>`;
            }
            if (skill.svg) {
                skillImg = `<svg viewBox="0 0 128 128" id="m-skills-${skillTag}-img">${skill.svg}</svg>`;
            }
            else if (skill.img) {
                skillImg = `<img id="m-skills-${skillTag}-img" src="${skill.img}">`;
                imageLoader.loadImage(skill.img);
            }

            skillsList += `
            <div class="m-skill w-100 row m-0">
                <div class="m-skill-left col-3 d-flex flex-row justify-content-around align-items-center">
                    <span id="m-skill-symbol">${skillImg}</span>
                    <i class="icomoon icomoon-trophy-plain ${skill.level}"></i>
                </div>
                <div class="m-skill-right col-9">
                    <div class="m-skill-body row m-0 d-flex flex-col">
                        <div class="m-skill-header">
                            ${skill.name}
                        </div>
                        <div class="m-skill-desc">
                            ${skill.description}
                        </div>
                    </div>
                </div>   
                <div class="h-divider col-12">
                    <div class="m-shadow"></div>
                </div>
            </div>
            `
        });
    }

    // Add it to the dom.
    document.querySelector('#m-skills > .sm-main-layout > #m-skills-accordion').innerHTML = skillsList;
}

/**
 * Fill the skills' session.
 */
function generateExperiences() {
    let experienceList = "";
    let exp;
    const today = (new Date()).toLocaleString('en-US', {year: 'numeric', month: 'numeric'}).split('/');

    GLOBALS.experiences.forEach((exp, index) => {
        const dates = exp.time.replace(/\s+/g, '').split("-");
        const startDates = dates[0].split("/");
        const startDate = new Date(startDates[1], startDates[0] - 1);
        const [elapsedYears, elapsedMonths] = computeElapsedTime(dates[0], dates[1].length <= 1 ? today[1] + '/' + today[0] : dates[1]);
        const dateOptions = {
			year: 'numeric',
			month: 'long'
        };
        const progress = dates[1].length <= 1 ? 25 : 100;

        experienceList += `
            <div class="m-exp">
                <div class="m-exp-header" id="headingOne">
                    <div class="row" data-toggle="collapse" data-target="#exp-${index}" aria-expanded="${index == 0}" aria-controls="exp-${index}">
                        <div class="col-12 col-lg-5 d-flex flex-column m-exp-title">
                            <h4>${exp.name}</h4>
                            <h5>${exp.company}</h4>
                        </div>
                        <div class="col-6 col-lg-2 offset-lg-1 d-flex flex-column m-exp-start">
                            <h4>First boot:</h4>
                            <h5>${startDate.toLocaleString('en-US', dateOptions)}</h5>
                        </div>
                        <div class="col-6 col-lg-2 d-flex flex-column m-exp-total">
                            <h4>Total time:</h4>
                            <h5>${elapsedYears}y ${elapsedMonths}m</h5>
                        </div>
                        <div class="col-6 col-lg-2 d-flex flex-column m-exp-progress">
                            <h4>Progress:</h4>
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" style="width: ${progress}%;" aria-valuenow="${progress}" 
                                    aria-valuemin="0" aria-valuemax="100"><span>${progress}%</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="exp-${index}" class="collapse" aria-labelledby="headingOne" data-parent="#m-exp-accordion">
                    <div class="m-exp-body">
                        ${exp.desc}   
                    </div>
                </div>
            </div>
        `
    });

    const expAccordion = document.querySelector('#m-experience > .sm-main-layout > #m-exp-accordion');
    expAccordion.innerHTML = experienceList;

    $(expAccordion.querySelectorAll('.m-exp')).on('show.bs.collapse', function () {
        this.classList.add("m-active");
    });
    $(expAccordion.querySelectorAll('.m-exp')).on('shown.bs.collapse', function () {
        // Recreate scroll effect. 
        initScrollbar(true);
    });

    $(expAccordion.querySelectorAll('.m-exp')).on('hide.bs.collapse', function () {
        this.classList.remove("m-active");
    });
}

/**
 * Fill the projects' session.
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
    const first = min !== undefined ? Math.max(this, min) : this;
    return max !== undefined ? Math.min(first, max) : first;
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
 * @returns {[Number]} The elapsed years and months.
 */
function myParseInt(str, radix = 10)
{
    const result = parseInt(str, radix);
    return result ? result : 0;
}

/**
 * A parseInt function that returns 0 instead of NaN.
 * 
 * @param {String} from The starting date in the format "mm/yyyy".
 * @param {String} to The ending date in the format "mm/yyyy".
 */
function computeElapsedTime(from, to)
{
    const startDates = from.split('/');
    const endDates = to.split('/');
    const elapsedYears = endDates[1] - startDates[1];
    
    if (endDates[0] < startDates[0])
    {
        return [Math.max(elapsedYears - 1, 0), 12 - (startDates[0] - endDates[0])];
    }

    return [elapsedYears, endDates[0] - startDates[0]];
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
    let $items = $('#m-carousel .sm-item');

    $items.bind( 'sm-activate', function (event) { 
        // Enter the item.
        if (menuGraph.currentMenu.id == "sm-main-menu")
        {
            let hover = this.querySelector('.m-item-hover');

            if (hover) 
            {
                hover.classList.add('m-active');
                gsap.to(hover, { 
                    top: '-100%', 
                    duration: event.detail.reason != SM.CONST.inputEvent.restoreFocus ?  0.1 : 0.001 
                });
            }

            // Change the background.
            const backs = this.dataset["backg"].split(",");
            document.getElementById("m-background-land").style.backgroundImage = 
                `url("Styles/Images/${backs[0]}")`;

            m_carousel.goToItem($items.index(this));
        }
    });

    $items.bind( 'sm-deactivate', function (event) {
        // Exit the item.
        if (menuGraph.currentMenu.id == "sm-main-menu")
        {
            let hover = this.querySelector('.m-item-hover');

            if (hover && event.detail.reason != SM.CONST.inputEvent.leaveMenu)
            {
                gsap.to(hover, { 
                    top: 0,
                    duration: event.detail.reason != SM.CONST.inputEvent.restoreFocus ?  0.1 : 0.001,
                    onComplete: () => { hover.classList.remove('m-active'); } 
                });        
            }
        }
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