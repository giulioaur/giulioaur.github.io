/*********************************************************
 *          Created By Dr.Sushi (Giulio Auriemma)        *
 *        Licensed with...                               *
 *********************************************************/

//#todo insert an exemple for the call of a static method for animation.
//#todo Test with console.profile() and console.timer() and maybe use same plain JS instead of Jquery.

var SM = {

CONST: {
    history: 'sm-history',
    current: 'sm-current',
    viewportId: '#sm-viewport',
    menuClass: '.sm-menu',
    itemClass: '.sm-item',
    backItemClass: '.sm-back-item',
    redirectItemClass: '.sm-redirect-item',
    redirectBlankItemClass: '.sm-redirect-blank-item',
    clearItemClass: '.sm-clear-item',
    itemContainerClass: '.sm-item-container',
    mainMenuId: '#sm-main-menu',
    mainLayoutClass: '.sm-main-layout',
    layoutClass: '.sm-layout',
    currentLayoutClass: '.sm-current-layout',
    layoutItemData: 'item',
    gotoData: 'goto',
    backData: 'back',
    inAnimData: 'sm-in',
    outAnimData: 'sm-out'
},
    
/**
 * Class for the graph of menu.
 * It automatically builds the graph using sm-* classes and data-goto attribute.
 * This way the generation is completely automatic and no change is required on js when changing the 
 * graph structure.
 */
Graph: class Graph {
    //////////////////////// TYPE DEF ////////////////////////

    /**
     * Callback for getting the layout to use in current configuration.
     *
     * @callback layoutGetter
     * @param {string} menu The id of the current menu.
     * @returns {string} The name of the class of layout to use for the given menu (without sm- prefix and -layout suffix). 
     */

    /**
     * Sets some options for the Graph class.
     * 
     * @typedef {Object} Options
     * @param {Boolean} shouldSave Wherever on not the menu state must be saved into session storage.
     * @param {layoutGetter} layoutMap What layout to use for a given menu.
     * @param {Boolean} logError True if errors must be logged on console, false otherwise. Usually set to true only in development.
     */

    //////////////////////// CONSTRUCT GRAPH ////////////////////////

    /**
     * Buils a new menu graph parsing the html file.
     * 
     * 
     * @param {Object} [options={shouldSave : true, layoutMap : ()=>{return 'main'}, logError : false}] The configuration options for the graph.
     */
    constructor(options) {
        this.saving = options && options.shouldSave != undefined ? options.shouldSave : true;
        this.layoutGetter = options && options.layoutMap ? options.layoutMap : () => { return 'main' };
        this.shouldLog = options && options.logError != undefined ? options.logError : true;

        if (this._setAttributes())
        {
            this._buildGraph();
        }        
        
    }

    /**
     * Sets the base graph attribute.
     * 
     * @returns {Boolean} true if all goes the right way, false otherwise.
     */
    _setAttributes() {
        if (document.getElementById(SM.CONST.mainMenuId.substr(1))) {
            // Use sessionStorage.
            if (this.saving && typeof (Storage) !== 'undefined') {
                // If no previous saving, create new one.                
                this._history = sessionStorage.getItem(SM.CONST.history) ? sessionStorage.getItem(SM.CONST.history).split(',') : [];
                this._current = document.getElementById(`${sessionStorage.getItem(SM.CONST.current) ? 
                    sessionStorage.getItem(SM.CONST.current) : SM.CONST.mainMenuId.substr(1)}`);
            }
            // Do not use session storage.
            else {
                this._history = [];
                this._current = document.getElementById(SM.CONST.mainMenuId);
            }

            this.nodes = {};
            return true;
        }

        console.log(`No main menu declared (${SM.CONST.mainMenuId})`);
        return false;
    }

    /**
     * Creates the nodes of the graph and enables goto links.
     */
    _buildGraph() {
        const graph = this; 
        const nodes = document.querySelectorAll(`${SM.CONST.viewportId} ${SM.CONST.menuClass}`);

        // Creates a map of nodes.
        for(let node of nodes) {
            const nodeId = node.id;

            node.style.display = 'none';

            if (nodeId)
                graph.nodes[nodeId] = node;
            else
                this._logError('No id found', node);

            // Fill other layouts.
            this._populateLayouts(node);
        }

        // Add goto event to items.
        // Do it in a separate loop to check goto consistency.
        for (let node of nodes) {
            const items = node.querySelectorAll(SM.CONST.itemClass)
            for (let item of items){
                const label = item.dataset[SM.CONST.gotoData];
                const isBlank = item.classList.contains(SM.CONST.redirectBlankItemClass.substr(1));
                
                // Check if the item is a normal item or a redirect item.
                if (!item.classList.contains(SM.CONST.redirectItemClass.substr(1)) && !isBlank)
                    item.addEventListener('click', () => graph.goto(label, 
                        item.classList.contains(SM.CONST.backItemClass.substr(1)), 
                        item.classList.contains(SM.CONST.clearItemClass.substr(1))) );
                else
                    item.addEventListener('click', () => graph._redirect(label, isBlank));
            }
        }

        // Set the main menu as root.
        this._current.style.display = '';    
    }

    //////////////////////// LAYOUT STUFF ////////////////////////

    /**
     * Fills all the layouts of a menu with the correct items.
     * The items should be put in the sm-main-layout, while other layouts must have a 
     * link to them through data-item attribute.
     * 
     * @param {HTMLElement} menu The menu to fill.
     */
    _populateLayouts(menu) {
        const mainLayout = menu.querySelector(SM.CONST.mainLayoutClass);
        const layouts = menu.querySelectorAll(`${SM.CONST.layoutClass}:not(${SM.CONST.mainLayoutClass})`);

        for (let layout of layouts) {
            // Fill all the item's containers.
            const containers = layout.querySelectorAll(SM.CONST.itemContainerClass);
            for (let container of containers) {
                const itemsToAppend = mainLayout.querySelector(`.${container.dataset[SM.CONST.layoutItemData]}`);

                if (itemsToAppend)
                    container.appendChild(itemsToAppend.cloneNode(true));
                else
                    this._logError('No data-item attribute in container.', container);
            };

            layout.style.display = 'none';
        };

        // Set main layout as default, then find the correct layout.
        mainLayout.classList.add(SM.CONST.currentLayoutClass.substr(1));
        this._setCorrectLayout(menu);
    }

    /**
     * Hides the previous layout and show the one returned from the layout callback.
     * 
     * @param {HTMLElement} menu The menu.
     */
    _setCorrectLayout(menu) {
        const layoutToShow = this._getLayoutName(menu.id);
        const currentLayout = menu.querySelector(SM.CONST.currentLayoutClass);

        // Show only the correct layout.
        if (!currentLayout.classList.contains(layoutToShow)) {
            const newLayout = menu.getElementsByClassName(layoutToShow);

            // Hide the previous active layout and show the new one.
            if (newLayout.length > 0) {
                currentLayout.classList.remove(SM.CONST.currentLayoutClass.substr(1));
                currentLayout.style.display = 'none';
                newLayout[0].classList.add(SM.CONST.currentLayoutClass.substr(1));
                newLayout[0].style.display = '';
            }
        }
    }


    /**
     * Forces the updating of current layout.
     */
    forceUpdateLayout() {
        this._setCorrectLayout(this._current);
    }


    //////////////////////// CHANGE MENU AND ANIMATIONS ////////////////////////

    /**
     * Changes the current menu with a new one.
     * If the label is empty and isBack is false, then do nothing, if isBack is true go to previous menu.
     * If the label is not empty and isBack is false go to the given menu and add the current to the history,
     * if isBack is false then go back in the history to find the searched menu, if no menu with that label
     * is found, then the history is cleared.
     * 
     * @param {string} label The new menu id.
     * @param {Boolean} isBack true if is a back transition.
     * @param {Boolean} clearHistory true if the history must be cleaned after transition.
     */
    goto(label, isBack = false, clearHistory = false) {
        let to; 
        let inAnimation, outAnimation;

        if (!isBack) {
            // Go to menu.
            if (this.nodes[label]) {
                this._history.push(this._current.id);
                to = this.nodes[label];
            }
            // Go to link
            else {
                this._logError(`${label} is not a valid menu in ${this._current.id}`);
                return;
            }
        }
        // Go back in history.
        else if (this._history && this._history.length > 0) {
            let toId = "";

            // Search for the label and pop all elements after it.
            if (label)
            {
                for (toId = this._history.pop(); this._history.length > 0 && toId != label; toId = this._history.pop()) ;
            }
            
            to = document.getElementById(`${(toId ? toId : this._history.pop())}`);
        }
        // There is an error.
        else {
            this._logError(`${this._current.id} cannot go back, no previous menu found.`);
            return;
        }

        // Set current layout for the menu to show.
        this._setCorrectLayout(to);

        // Get animation.
        outAnimation = this._current.dataset[SM.CONST.outAnimData] ? this._current.dataset[SM.CONST.outAnimData] : "SM.Animations.standardOut";
        inAnimation = to.dataset[SM.CONST.inAnimData] ? to.dataset[SM.CONST.inAnimData] : "SM.Animations.standardIn";

        // Play animations.
        this._playAnimation(outAnimation, to, isBack);
        this._playAnimation(inAnimation, to, isBack);

        // Update current
        this._current = to;

        // Clear history.
        if (clearHistory)
            this._history = [];

        // Save state.
        this._saveCurrentState();
    }

    /**
     * Open a link.
     * 
     * @param {string} link The target link.
     * @param {Boolean} isBlank tru if the link must be opened in new tab.
     */
    _redirect(link, isBlank) {
        window.open(link, isBlank ? '_blank' : '_self');
    }

    /**
     * Plays an animation. 
     * To correctly call the function the name of the animation must contain also the necessary namespaces.
     * 
     * @param {string} animation The name of the animation to play.
     * @param {HTMLElement} to The new menu to show.
     * @param {Boolean} isBack true if is a back animation.
     */
    _playAnimation(animation, to, isBack) {
        // Resolve animation function call
        let animationContext = window;
        const contexts = animation.split('.');
        const animationFunction = contexts.pop();

        for (let context of contexts)
            animationContext = animationContext[context];

        animationContext[animationFunction].call(animationContext, this._current, to, isBack);
    }



    //////////////////////// UTILITIES ////////////////////////

    /**
     * Save the current state if saving is active.
     */
    _saveCurrentState() {
        // Save current state.
        if (this.saving && typeof (Storage) !== 'undefined') {
            sessionStorage.setItem(SM.CONST.history, this._history.toString());
            sessionStorage.setItem(SM.CONST.current, this._current.id);
        }
    }

    /**
     * Returns the name of the layout to use for a given menu.
     * 
     * @param {string} menuName The id of the menu.
     * @returns {string} The formatted name of the layout to use.
     */
    _getLayoutName(menuName) {
        return `sm-${this.layoutGetter(menuName)}-layout`;
    }

    /**
     * Log the error to the console if log is active.
     * 
     * @param {Array} logList Array of element to pass to log function.
     */
    _logError(logList) {
        if (this.shouldLog){
            if (logList instanceof Object)
                console.error.apply(this, logList);
            else
                console.error(logList);
        }
    }
    
    /**
     * Check if a string represent a web-url.
     * 
     * @param {string} str The string to check.
     * @returns {int} 0 if the string is not an url, 1 if is http protocol, -1 for other protocol.
     */
    _redirectType(str) {
        return 0;
    }
    
},


Animations : class SMAnimations {
    /**
     * Showa the new menu.
     *
     * @param {HTMLElement} from The exiting menu.
     * @param {HTMLElement} to The entering menu.
     * @param {Boolean} isBack true if is a back animation.
     */
    static standardIn(from, to, isBack) {
        to.style.display = '';
    }

    /**
     * Hides the old menu.
     *
     * @param {HTMLElement} from The exiting menu.
     * @param {HTMLElement} to The entering menu.
     * @param {Boolean} isBack true if is a back animation.
     */
    static standardOut(from, to, isBack) {
        from.style.display = 'none';
    }
}

}