/*********************************************************
 *          Created By Dr.Sushi (Giulio Auriemma)        *
 *        Licensed with...                               *
 *********************************************************/

SM.CONST.inputActivationEvent = 'sm-activate';
SM.CONST.inputDeactivationEvent = 'sm-deactivate';
SM.CONST.noInputClass = '.sm-no-input';

SM.CONST.inputData = [
        /* Back */ { events: [66, 27], callback: '_goBack' },
        /* Select */ { events: [13], callback: '_select' },
        /* Down */ { events: [83, 40], callback: '_goDown' },
        /* Left */ { events: [65, 37], callback: '_goLeft' },
        /* Up */ { events: [87, 38], callback: '_goUp' },
        /* Right */ { events: [68, 39], callback: '_goRight' }
]


SM.input = {
    // Declare all needed event.
    _activationEvent: new CustomEvent(SM.CONST.inputActivationEvent, {
        detail: {
            target: null,
            other: null,
            isMouseTrigger: false,
            direction: ''
        }
    }),
    _deactivationEvent: new CustomEvent(SM.CONST.inputDeactivationEvent, {
        detail: {
            target: null,
            other: null,
            isMouseTrigger: false,
            direction: ''
        }
    }),
    _clickEvent: new MouseEvent('click'),

    // Other attributes.
    _activeItem: null,
    _activeItemMap: {},
    _cachedItems: {},
    _options: {
        firstFocus: true,
        restoreFocus: true,
        dynamicMenu: false
    },


    /**
     * Binds input to a menu graph.
     * The input works on active item. It's possible to add a custom event listener for
     * the activation / deactivation of an item through the 'sm-activate' and 'sm-deactivate' events.
     *
     * @param {SM.Graph} graph The graph to which bind the inputs.
     * @param {Object} map The map of input keys (the number are referred to which attribute of a key).
     * @param {Array<Number>} map.back The keys for back action.
     * @param {Array<Number>} map.select The keys for select action.
     * @param {Array<Number>} map.up The keys for go-up action.
     * @param {Array<Number>} map.down The keys for go-down action.
     * @param {Array<Number>} map.left The keys for go-left action.
     * @param {Array<Number>} map.right The keys for go-right action.
     * @param {Object} [options] The options object.
     * @param {bool} [options.firstFocus = true] True if the first item must be activated on entering a menu.
     * @param {bool} [options.restoreFocus = true] True if on back action the focus must be restored on last active item.
     * @param {bool} [options.dynamicMenu = false] True if menu's items change at runtime. On false some optimizations are applied.
     * @param {HTMLElement} [element = document] The element to which bind the input handling.
     */
    bindInput(graph, map, options = {}, element = document) {
        const input = this;

        this._graph = graph;

        this._setupOptions(options);
        this._setupInputMap(map);

        // Add basic inputs.
        if (this._graph) {
            // Add event listener on keydown.
            element.addEventListener('keydown', (key) => {
                for (let input of SM.CONST.inputData) {
                    if (input.events.includes(key.which))
                        this[input.callback].call(this);
                }
            });

            const items = document.querySelectorAll(`${SM.CONST.itemClass}:not(${SM.CONST.noInputClass})`);
            for (let item of items){
                // Add event listener for set the correct active menu with mouse.
                item.addEventListener('mouseenter', function() {
                    input._changeActive(this, true, 'tmp');
                });

                // Add other events.
                if (this._options.firstFocus || this._options.restoreFocus)
                    item.addEventListener('click', () => this.setCorrectFocus(item.classList.contains(SM.CONST.backItemClass.substr(1))) );
            }

            if (this._options.firstFocus) {
                const menuItems = this._getItems();
                this._changeActive(menuItems[0], false, 'firstFocus');
            }
        }
        else 
            console.error('No valid graph for input.')
    },

    /**
     * Add an event callback to the mouse click. This way, once an item is pressed, the first item of the new menu
     * receives the focus. Instead, if back item is pressed, the old state is restored.
     * NB: This relies on the fact that the order in which registered events are called is consistent with the 
     * DOM 3 standard (first-assigned, first-called).
     *          
     * @param {bool} isBack If is a back transition.
     */
    setCorrectFocus(isBack) {
        if (!isBack) {
            if (this._options.firstFocus)
                this._changeActive(this._graph._current.getElementsByClassName(SM.CONST.itemClass.substr(1))[0], false, 'firstFocus');
        }
        else {
            if (this._options.restoreFocus)
                this._changeActive(this._activeItemMap[this._graph._current.id], false, 'firstFocus');
        }
    },


    /**
     * Sets-up the options for the handler.
     * 
     * @param {Object} options The new options.
     */
    _setupOptions(options) {
        if (options && options.firstFocus === false) 
            this._options.firstFocus = false;

        if (options && options.restoreFocus === false)
            this._options.restoreFocus = false;

        if (options && options.restoreFocus === true)
            this._options.restoreFocus = true;
    },

    /**
     * Binds the keys to the action.
     * 
     * @param {Object} map The map for the key-action bindings.
     */
    _setupInputMap(map) {
        SM.CONST.inputData[0].events = map.back;
        SM.CONST.inputData[1].events = map.select;
        SM.CONST.inputData[2].events = map.down;
        SM.CONST.inputData[3].events = map.left;
        SM.CONST.inputData[4].events = map.up;
        SM.CONST.inputData[5].events = map.right;
    },

    /**
     * Changes the current active item.
     * 
     * @param {HTMLElement} newActive The new active item.
     * @param {Boolean} mouseTrigger True if the action has been fired by a mouse event.
     * @param {string} dir The direction of the movement.
     */
    _changeActive(newActive, mouseTrigger, dir) {
        // Deactivate previous item if any.
        if(newActive) {
            if (this._activeItem) {
                this._deactivationEvent.detail.target = this._activeItem;
                this._deactivationEvent.detail.other = newActive;
                this._deactivationEvent.detail.isMouseTrigger = mouseTrigger;
                this._deactivationEvent.detail.direction = dir;

                this._activeItem.dispatchEvent(this._deactivationEvent);
                this._activeItem.classList.remove('sm-active');
            }

            // Activate new item.
            newActive.classList.add('sm-active');

            this._activationEvent.detail.target = newActive;
            this._activationEvent.detail.other = this._activeItem;
            this._activationEvent.detail.isMouseTrigger = mouseTrigger;
            this._activationEvent.detail.direction = dir;

            newActive.dispatchEvent(this._activationEvent);
            this._activeItem = newActive;

            if (this._options.firstFocus || this._options.restoreFocus)
                this._activeItemMap[this._graph._current.id] = this._activeItem;
        }
    },

    /**
     * Goes back to the previous menu.
     */
    _goBack() {
        this._graph.goto('', true);
        this.setCorrectFocus(true);
    },

    /**
     * Goes to the menu pointed by that item if any.
     */
    _select() {
        this._activeItem.dispatchEvent(this._clickEvent);
    },

    /**
     * Movement events
     */
    _goDown() { this._move(0, 1) },
    _goUp() { this._move(0, -1) },
    _goRight() { this._move(1, 0) },
    _goLeft() { this._move(-1, 0) },

    /**
     * Moves the current active menu item if any.
     * 
     * @param {Number} dirX The x direction in which move (-1 left, 1 right).
     * @param {Number} dirY The y direction in which move (-1 top, 1 down).
     */
    _move(dirX, dirY) {
        const dir = dirX ? (dirX > 0 ? 'left' : 'right') : (dirY > 0 ? 'down' : 'up');
        // Move active item
        if (this._activeItem) {
            const currPos = this._getAbsolutePos(this._activeItem);

            
            // The map is done to avoid calling _getAbsolutePos() multiple times.
            const nextItems = Array.from(this._getItems()).map(item => {
                return {bb : this._getAbsolutePos(item), element: item};
            }).filter(item => {     // First filter all the items in the right direction.
                // Horizontal movement
                return dirX ? (dirX > 0 ? item.bb.left >= currPos.right : item.bb.right <= currPos.left) :
                // Vertical movement
                                (dirY > 0 ? item.bb.top >= currPos.bottom : item.bb.bottom <= currPos.top);
            }).filter(item => {     // Then check if the two box projection on x / y axis interesct each other.
                // Y intersection
                return dirX ? Math.abs(item.bb.top - currPos.top) <= Math.max(item.bb.height, currPos.height) :
                // X interesection
                                Math.abs(item.bb.left - currPos.left) <= Math.max(item.bb.width, currPos.width);
            }).sort((a, b) => {     // Then sort the remaining elements.
                // First compute the distance in the x/y axis.
                // The distance must be computed on different side based on where to move.
                // NB: on going down / right x1 > x2 => x2 - x1 < 0 => x1 comes before x2,
                //      on going up / left x1 < x2 => (x2 - x1) * (-1) < 0 => x1 comes before x2.
                //      where x1 is side of a and x2 side of b. 
                const side = dirX ? (dirX > 0 ? 'left' : 'right') : (dirY > 0 ? 'top' : 'bottom')
                let distance = (b.bb[side] - a.bb[side]) * -(dirX ? dirX : dirY);

                // Consider very near item as at the same distance.
                if(distance > -0.5 && distance < 0.5)  distance = 0;

                // If the two items are at the same distance check for the one near to
                // top side while going horizontally, or to left side while going vertically.
                if (!distance){
                    return dirX ? Math.abs(a.bb.top - currPos.top) - Math.abs(b.bb.top - currPos.top) : 
                                    Math.abs(a.bb.left - currPos.left) - Math.abs(b.bb.left - currPos.left);
                }

                return distance;
            });

            // If some item is left, change the current active item.
            if (nextItems.length > 0)
                this._changeActive(nextItems[0].element, false, dir);
        }
        // Set first item as active one.
        else {
            this._changeActive(this._graph._current.querySelector(SM.CONST.itemClass), false, dir);
        }
    },


    
    //////////////////////// UTILITIES ////////////////////////

    /**
     * Returns the items of the current menu.
     * 
     * @returns {NodeList} The items of the current menu.
     */
    _getItems() {
        // Retrieves the item of the current menu if not cached.
        const currentId = this._graph._current.id;
        const currentLayout = this._graph._getLayoutName(currentId);

        // #todo this method will fail with dynamic menu. Choose what to do.
        if (!this._cachedItems.menuId || this._cachedItems.menuId != currentId || this._cachedItems.layout != currentLayout) {
            this._cachedItems.items = document.querySelectorAll(`#${currentId} .${currentLayout} ${SM.CONST.itemClass}:not(${SM.CONST.noInputClass})`);
            this._cachedItems.menuId = currentId;
            this._cachedItems.layout = currentLayout;
        } 

        return this._cachedItems.items;
    },

    /**
     * Returns the coords of an element wrt document.
     * 
     * @param {HTMLElement} element The element.
     * 
     * @returns {DOMRect} A partial DomRect with just top, bottom, left and right attribute.
     */
    _getAbsolutePos(element) {
        const bb = element.getBoundingClientRect();

        return {
            top: bb.top + window.pageYOffset,
            bottom: bb.bottom + window.pageYOffset,
            right: bb.right + window.pageXOffset,
            left: bb.left + window.pageXOffset,
            width: bb.width,
            height: bb.height
        };
    }
}