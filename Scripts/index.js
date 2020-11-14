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
    tip: [
        // 'You can navigate the site also using your keyboard.',
        'Do you know? Sometimes a bug can be called "feature".',
        'Stealing data from your pc....',
        'Optimizing assembly code...',
        'Have a puuuurfect day :3',
        'Once a great sage said: "Bau Bau Bau"',
        'Stop procrastinating and do your job!!'
    ],
    scrollPanel: undefined
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
    menuGraph = new SM.Graph({ shouldSave: false, logError: true, playFirstAnimation: false});
    GLOBALS.loadingPercentage = 70;

    // Custom setup. Put here to animate after first focus.
    bindAnimations();
    GLOBALS.loadingPercentage = 73;

    // Setup graph input.
    SM.input.bindInput(menuGraph, GLOBALS.inputMap, {firstFocus: true});
    GLOBALS.loadingPercentage = 87;

    // Custom setup.
    GLOBALS.loadingPercentage = 93;

    initScrollbar();
    menuGraph.addDataCallback((oldMenu, newMenu) => { $(newMenu).show(); initScrollbar(true); return true; }, true);
    menuGraph.addDataCallback(initScrollbar, false);
    GLOBALS.loadingPercentage = 95;

    setupCredits();

    imageLoader.waitForLoading();
    GLOBALS.loadingPercentage = 100;
}

/**
 * Called on page resizing.
 */
function resizePage() {
    initScrollbar();
}

/**
 * Re-inits the jscrollpane and correctly set scrollbar.
 */
function initScrollbar(shouldMantain = false) {
    const scrollPanels = document.getElementById("m-menu-container");

    GLOBALS.scrollPanel = $(scrollPanels).jScrollPane({
        contentWidth: 1,
        maintainPosition: shouldMantain
    }).data('jsp');

    $(scrollPanels).bind(
        'jsp-will-scroll-y',
        getGhostScrollbarCallback(scrollPanels)
    );

    getGhostScrollbarCallback(scrollPanels)();

    updateScrollingPanelHeight();
}

/**
 * Applies the appear/disappear scrollbar effect.
 */
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

/**
 * Makes the scrollable panel as big as the page remaining available space.
 */
function updateScrollingPanelHeight() {
    const jspContainer = document.querySelector("#sm-viewport .jspContainer");
    const height = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    jspContainer.style.height = height - document.getElementById("sm-main-menu").offsetHeight + "px";
}

function setupCredits() 
{
    if (localStorage.getItem('swEffect') === null) {
        localStorage.setItem('swEffect', true);
    }

    if (localStorage.getItem('swEffect') == 'false')    $('#sw-checkbox .form-check-input').click();

    $('#sw-checkbox .form-check-input').change(function () {
        const mustShowSWEffect = !$(this).is(':checked');
        localStorage.setItem('swEffect', mustShowSWEffect);

        if (mustShowSWEffect) {
            hideCredits(() => showSWEffect(initScrollbar));
        }
        else
        {
            hideSWEffect(() => showCredits(initScrollbar));
        }

        initScrollbar();
    });

    const creditsContainer = document.getElementById("m-credits-container");
    document.getElementById("m-sw-box-content").innerHTML = creditsContainer.innerHTML;
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
                <div class="m-skill-left col-3 d-flex justify-content-around align-items-center">
                    <span id="m-skill-symbol">${skillImg}</span>
                    <i class="icomoon icomoon-trophy-plain ${skill.level}"></i>
                </div>
                <div class="m-skill-right col-9">
                    <div class="m-skill-body row m-0 d-flex flex-col">
                        <div class="m-skill-header w-100">
                            ${skill.name}
                        </div>
                        <div class="m-skill-desc w-100">
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
        const [elapsedYears, elapsedMonths] = computeElapsedTime(dates[0], dates[1] == 'now' ? today[0] + '/' + today[1] : dates[1]);
        const dateOptions = {
			year: 'numeric',
			month: 'long'
        };
        const progress = dates[1] == 'now' ? Math.ceil((elapsedMonths + elapsedYears * 12) * 100 / 120) : 100;

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
                        <div class="col-12 col-lg-2 d-flex flex-column align-items-center m-exp-progress">
                            <h4>Progress:</h4>
                            <div class="progress position-relative w-100">
                                <div class="progress-bar position-absolute w-100 h-100" role="progressbar" aria-valuenow="${progress}" 
                                    aria-valuemin="0" aria-valuemax="100"></div>
                                <div class="m-cover justify-content-center d-flex position-absolute w-100 h-100 m-primary-color">${progress}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="exp-${index}" class="collapse" aria-labelledby="headingOne" data-parent="#m-exp-accordion">
                    <div class="m-exp-body">
                        ${exp.description}   
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

// /**
//  * Fill the projects' session.
//  */
// function generateProjects() {

// }







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

/**
 * Check if the window is in portrait mode.
 *
 * @return True if the current windows has height > width.
 */
function isPortraitMode() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    const height = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const aspectRatio = height / width;

    return aspectRatio > 1;
}

////////////////////////////////////////////////////////////////////////
///////////////////////////// ANIMATIONS ///////////////////////////////
////////////////////////////////////////////////////////////////////////

function bindAnimations() {
    itemHovering();
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
            document.getElementById("m-background-port").style.backgroundImage =
                `url("Styles/Images/${backs[backs.length > 1 ? 1 : 0]}")`;

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


////////////////////////////////////////////////////////////////////////
///////////////////////////// SW-EFFECT ////////////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * Returns true if must show the sw credits page.
 */
function shouldShowSWEffect()
{
    return localStorage.getItem('swEffect') == "true";
}