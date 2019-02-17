////////////////////////////////////////////////////////////////////////
//////////////////////////////// GLOBALS ///////////////////////////////
////////////////////////////////////////////////////////////////////////

const GLOBALS = {
    projCurrIndex: 0,
    sliderData: {},
    textsToFit: document.getElementsByClassName('m-fit-text'),
    textIncrement : 1
}
var menuGraph;



////////////////////////////////////////////////////////////////////////
////////////////////////////// FUNCTIONS ///////////////////////////////
////////////////////////////////////////////////////////////////////////

/**
 * It is called when page is fully loaded and setup all the necessary stuff.
 */
function setupPage() {
    // Dynamic generation of contents.
    dynamicGeneration();

    // Build the menu graph.
    menuGraph = new SM.Graph({shouldSave : true, logError : true});
    SM.input.bindInput(document, menuGraph);

    // Custom setup.
    bindAnimations();
    fitTexts();

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
            const min = textToFit.dataset.minfont;
            const max = textToFit.dataset.maxfont;
            const parentHeight = textToFit.parentElement.offsetHeight;
            const isLower = textToFit.offsetHeight < parentHeight ? 1 : -1;
            // Set the right starter size.
            let currentSize = textToFit.style.fontSize ? parseInt(textToFit.style.fontSize, 10) : 20;
            currentSize = currentSize.clamp(min, max);

            // Resize the text until the father size is not reached or text size overflows a range.
            while (currentSize && (isLower > 0 ? textToFit.offsetHeight < parentHeight : textToFit.offsetHeight > parentHeight)
                    && isWithinRange(currentSize, min, max, isLower)) {
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
//////////////////////////////// INPUT /////////////////////////////////
////////////////////////////////////////////////////////////////////////






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
    let skillRows = ['<div class="row">', '<div class="row">', '<div class="row">', '<div class="row">'];
    const itemPerRow = GLOBALS.skills.length / skillRows.length;
    let i = 0;

    // Creates all the rows.
    for (skill of GLOBALS.skills) {
        skillRows[parseInt(i++ / itemPerRow)] += `
            <div class="col h-100">
                <div class="m-skills-header">
                    ${skill.icon}
                    <h2>${skill.name}</h2>
                </div>
                <div class="m-skills-description">
                    <p class="m-fit-text">${skill.description}</p>
                </div>
            </div>
        `;
    }

    // Close rows
    for (i = 0; i < skillRows.length; ++i)
        skillRows[i] += '</div>';

    
    // Add it to the dom.
    document.querySelector('#m-skills > .sm-main-layout').innerHTML = skillRows[0] + skillRows[1] + skillRows[2] + skillRows[3];
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
            <div class="m-projects-row d-flex align-items-center">
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
                    <p class="m-fit-text" data-maxfont="30">
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

    $items.bind( 'sm-activate', function () { 
        // Enter the item.
        let $hover = $(this).find('.m-item-hover');

        $hover.addClass('m-active');
        TweenMax.to($hover, 0.1, { top: '-100%' });
    });

    $items.bind( 'sm-deactivate', function () {
        // Exit the item.
        let $hover = $(this).find('.m-item-hover');

        TweenMax.to($hover, 0.05, { top: 0, onComplete: () => { $hover.removeClass('m-active'); } });
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

            projectRows[i].addEventListener("mouseover", () => {
                // Change active item.
                projectRows[GLOBALS.projCurrIndex].classList.remove('active');
                projectRows[i].classList.add('active');
                
                // Change visibility.
                projects[GLOBALS.projCurrIndex].style.display = 'none';
                projects[i].style.display = 'block';
                GLOBALS.projCurrIndex = i;

                // Fit text.
                fitTexts();
            });
        }

        // Call the visibility on first project.
        projectRows[0].fireEvent('mouseover');
    }
    else {
        console.error("At least one project is not correctly setup.");
    }
}