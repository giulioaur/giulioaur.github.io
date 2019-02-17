/*********************************************************
 *          Created By Dr.Sushi (Giulio Auriemma)        *
 *        Licensed with...                               *
 *********************************************************/


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
    _activationEvent: new Event('sm-activate'),
    _deactivationEvent: new Event('sm-deactivate'),

    // Other attributes.
    _activeItem: null,
    _cachedItems: {},


    /**
     * Binds input to a menu graph.
     * The input works on active item. It's possible to add a custom event listener for
     * the activation / deactivation of an item through the 'sm-activate' and 'sm-deactivate' events.
     * 
     * @param {HTMLElement} element The element to which bind the input handling.
     * @param {SM.Graph} graph The graph to which bind the inputs.
     */
    bindInput: function(element, graph) {
        const input = this;

        this._graph = graph;

        if (this._graph) {
            // Add event listener on keydown.
            element.addEventListener('keydown', (key) => {
                for (let input of SM.CONST.inputData) {
                    if (input.events.includes(key.which))
                        this[input.callback].call(this);
                }
            });

            // Add event listener for set the correct active menu with mouse.
            const items = document.getElementsByClassName(SM.CONST.itemClass.substr(1))
            for (let item of items){
                item.addEventListener('mouseenter', function() {
                    input._changeActive(this);
                });
            }
        }
        else 
            console.error('No valid graph for input.')
    },

    /**
     * Chamge the current active item.
     * 
     * @param {HTMLElement} newActive The new active item.
     */
    _changeActive: function(newActive) {
        // Deactivate previous item if any.
        if (this._activeItem) {
            this._activeItem.dispatchEvent(this._deactivationEvent);
            this._activeItem.classList.remove('sm-active');
        }

        // Activate new item.
        this._activeItem = newActive;
        this._activeItem.classList.add('sm-active');
        this._activeItem.dispatchEvent(this._activationEvent);
    },

    /**
     * Go back to the previous menu.
     */
    _goBack: function() {
        this._graph.goto('', true);
    },

    /**
     * Movement events
     */
    _goDown: function () { this._move(0, 1) },
    _goUp: function () { this._move(0, -1) },
    _goRight: function () { this._move(1, 0) },
    _goLeft: function () { this._move(-1, 0) },

    /**
     * Moves the current active menu item if any.
     * 
     * @param {Number} dirX The x direction in which move (-1 left, 1 right).
     * @param {Number} dirY The y direction in which move (-1 top, 1 down).
     */
    _move: function (dirX, dirY) {
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
                this._changeActive(nextItems[0].element);
        }
        // Set first item as active one.
        else {
            this._changeActive(this._graph._current.querySelector(SM.CONST.itemClass));
        }
    },


    
    //////////////////////// UTILITIES ////////////////////////

    /**
     * Returns the items of the current menu.
     * 
     * @returns {NodeList} The items of the current menu.
     */
    _getItems: function() {
        // Retrieves the item of the current menu if not cached.
        const currentId = this._graph._current.id;
        const currentLayout = this._graph._getLayoutName(currentId);

        // #todo this method will fail with dynamic menu. Choose what to do.
        if (!this._cachedItems.menuId || this._cachedItems.menuId != currentId || this._cachedItems.layout != currentLayout) {
            this._cachedItems.items = document.querySelectorAll(`#${currentId} .${currentLayout} ${SM.CONST.itemClass}`);
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
    _getAbsolutePos: function(element) {
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