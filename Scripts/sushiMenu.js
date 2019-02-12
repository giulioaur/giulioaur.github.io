////////////////////////////////////////////////////////////////////////
////////////////////////////// MENU CLASS //////////////////////////////
////////////////////////////////////////////////////////////////////////

//#todo insert an exemple for the call of a static method.
//#todo Test with console.profile() and console.timer() and maybe use same plain JS instead of Jquery.

var SM = {

CONST: {
    history: 'sm-history',
    current: 'sm-current',
    viewportId: '#sm-viewport',
    menuClass: '.sm-menu',
    itemClass: '.sm-item',
    backItemClass: '.sm-back-item',
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
     * @param {bool} shouldSave Wherever on not the menu state must be saved into session storage.
     * @param {layoutGetter} layoutMap What layout to use for a given menu.
     * @param {bool} logError True if errors must be logged on console, false otherwise. Usually set to true only in development.
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
     * @returns {bool} true if all goes the right way, false otherwise.
     */
    _setAttributes() {
        if ($(SM.CONST.mainMenuId)) {
            // Use sessionStorage.
            if (this.saving && typeof (Storage) !== 'undefined') {
                // If no previous saving, create new one.                
                this.history = sessionStorage.getItem(SM.CONST.history) ? sessionStorage.getItem(SM.CONST.history).split(',') : [];
                this.$current = sessionStorage.getItem(SM.CONST.current) ? $(`#${sessionStorage.getItem(SM.CONST.current)}`) : $(SM.CONST.mainMenuId);
            }
            // Do not use session storage.
            else {
                this.history = [];
                this.$current = $(SM.CONST.mainMenuId);
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
        const $nodes = $(`${SM.CONST.viewportId} ${SM.CONST.menuClass}`);

        // Creates a map of nodes.
        $nodes.each((index, value) => {
            const $node = $(value);
            const nodeId = $node.attr('id');

            $node.hide();
            if (nodeId)
                graph.nodes[nodeId] = $node;
            else
                this._logError('No id found', $node);

            // Fill other layouts.
            this._populateLayouts($node);
        });

        // Add goto event to items.
        // Do it in a separate loop to check goto consistency.
        $nodes.each((index, value) => {
            $(value).find(SM.CONST.itemClass).each((index, value) => {
                const $item = $(value);
                const label = $item.data(SM.CONST.gotoData);
                
                $item.click(() => graph.goTo($item.data(SM.CONST.gotoData), 
                                                $item.hasClass(SM.CONST.backItemClass.substr(1)), 
                                                $item.hasClass(SM.CONST.clearItemClass.substr(1))) );
            });
        });

        // Set the main menu as root.
        this.$current.show();    
    }

    //////////////////////// LAYOUT STUFF ////////////////////////

    /**
     * Fills all the layouts of a menu with the correct items.
     * The items should be put in the sm-main-layout, while other layouts must have a 
     * link to them through data-item attribute.
     * 
     * @param {jQuery} $menu The menu to fill.
     */
    _populateLayouts($menu) {
        const $mainLayout = $menu.find(SM.CONST.mainLayoutClass);

        $menu.find(`${SM.CONST.layoutClass}:not(${SM.CONST.mainLayoutClass})`).each((index, value) => {
            // Fill all the item's containers.
            $(value).find(SM.CONST.itemContainerClass).each((index, value) => {
                const $container = $(value);
                const $itemToAppend = $mainLayout.find(`.${$container.data(SM.CONST.layoutItemData)}`);

                if ($itemToAppend)
                    $container.append($itemToAppend.clone());
                else
                    this._logError('No data-item attribute in container.', $container);
            });
        });

        // Show correct layout. Use main layout as default.
        $menu.find(SM.CONST.layoutClass).hide();
        $mainLayout.show();
        $mainLayout.addClass(SM.CONST.currentLayoutClass);
        this._setCorrectLayout($menu);
    }

    /**
     * Hides the previous layout and show the one returned from the layout callback.
     * 
     * @param {jQuery} $menu The menu.
     */
    _setCorrectLayout($menu) {
        const layoutToShow = this._getLayoutName($menu.attr('id'));
        const $currentLayout = $($menu.find(SM.CONST.currentLayoutClass));

        // Show only the correct layout.
        if (!$currentLayout.hasClass(layoutToShow)) {
            const $newLayout = $(`.${layoutToShow}`);

            if ($newLayout) {
                $currentLayout.removeClass(SM.CONST.currentLayoutClass);
                $currentLayout.hide();
                $newLayout.addClass(SM.CONST.currentLayoutClass);
                $newLayout.show();
            }
        }
    }


    /**
     * Forces the updating of current layout.
     */
    forceUpdateLayout() {
        _setCorrectLayout(this.$current);
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
     * @param {bool} isBack true if is a back transition.
     * @param {bool} clearHistory true if the history must be cleaned after transition.
     */
    goTo(label, isBack = false, clearHistory = false) {
        let $to; 
        let inAnimation, outAnimation;

        // Goto a new menu.
        if (!isBack) {
            if (this.nodes[label]) {
                this.history.push(this.$current.attr('id'));
                $to = this.nodes[label];
            }
            else {
                this._logError(`${label} is not a valid menu in ${this.$current.attr('id')}`);
                return;
            }
        }
        // Go back in history.
        else if (this.history && this.history.length > 0) {
            let toId = "";

            // Search for the label and pop all elements after it.
            if (label)
            {
                for (toId = this.history.pop(); this.history.length > 0 && toId != label; toId = this.history.pop()) ;
            }
            
            $to = toId ? $(`#${toId}`) : $(`#${this.history.pop()}`);
        }
        // There is an error.
        else {
            this._logError(`${this.$current.attr('id')} cannot go back, no previous menu found.`);
            return;
        }

        // Set current layout for the menu to show.
        this._setCorrectLayout($to);

        // Get animation.
        outAnimation = this.$current.data(SM.CONST.outAnimData) ? this.$current.data(SM.CONST.outAnimData) : "SM.Animations.standardOut";
        inAnimation = $to.data(SM.CONST.inAnimData) ? $to.data(SM.CONST.inAnimData) : "SM.Animations.standardIn";

        // Play animations.
        this._playAnimation(outAnimation, $to, isBack);
        this._playAnimation(inAnimation, $to, isBack);

        // Update current
        this.$current = $to;

        // Clear history.
        if (clearHistory)
            this.history = [];

        // Save state.
        this._saveCurrentState();
    }

    /**
     * Plays an animation. 
     * To correctly call the function the name of the animation must contain also the necessary namespaces.
     * 
     * @param {string} animation The name of the animation to play.
     * @param {jQuery} $to The new menu to show.
     * @param {bool} isBack true if is a back animation.
     */
    _playAnimation(animation, $to, isBack) {
        // Resolve animation function call
        let animationContext = window;
        const contexts = animation.split('.');
        const animationFunction = contexts.pop();

        for (let context of contexts)
            animationContext = animationContext[context];

        animationContext[animationFunction].call(animationContext, this.$current, $to, isBack);
    }



    //////////////////////// UTILITIES ////////////////////////

    /**
     * Save the current state if saving is active.
     */
    _saveCurrentState() {
        // Save current state.
        if (this.saving) {
            sessionStorage.setItem(SM.CONST.history, this.history.toString());
            sessionStorage.setItem(SM.CONST.current, this.$current.attr('id'));
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
},


Animations : class SMAnimations {
    /**
     * Showa the new menu.
     *
     * @param {jQuery} $from The exiting menu.
     * @param {jQuery} $to The entering menu.
     * @param {bool} isBack true if is a back animation.
     */
    static standardIn($from, $to, isBack) {
        $to.show();
    }

    /**
     * Hides the old menu.
     *
     * @param {jQuery} $from The exiting menu.
     * @param {jQuery} $to The entering menu.
     * @param {bool} isBack true if is a back animation.
     */
    static standardOut($from, $to, isBack) {
        $from.hide();
    }
}

}