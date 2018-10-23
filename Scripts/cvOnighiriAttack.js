class Monster{
    constructor(x, y){
        this._pos = [x, y];
        this._$div = $('<div></div>')
                    .appendTo($('body'))
                    .attr('id', x + ',' + y)
                    .css({ 'position': 'absolute', 'top': (y * spawner._height) + 'vh', 'left': (x * spawner._width) + 'vw', 'width': spawner._width + 'vw', 
                            'height': spawner._height + 'vh', 'z-index': '2000' })
                    .append($('<img src="Styles/Images/pgs/Sushi/goblin-head.png"/>').css({ 'max-width': '100%', 'max-height': '100%' }))
                    .mouseenter((event) => { spawner._lastpos = this._pos; })
                    .mouseleave(() => { this._lastpos = []; });

        // Let enemy move randomly.
        this._move = setInterval(() => {
            try{
                let newPos = [Math.floor(Math.random() * Math.floor(spawner._width)), Math.floor(Math.random() * Math.floor(spawner._height))];
                let i = 0;

                for (i; i < 100 && !spawner.move(this._pos[0], this._pos[1], newPos[0], newPos[1]); ++i) 
                    newPos = [Math.floor(Math.random() * Math.floor(spawner._width)), Math.floor(Math.random() * Math.floor(spawner._height))];         
            }catch(error){

            }
        }, Math.random() * Math.floor(6000) + 1000);
    }

    /**
     * Move the enemies.
     * 
     * @param {number} x The new x position.
     * @param {number} y The new y position.
     */
    move(x, y){
        this._$div.css({ 'top': (y * spawner._height) + 'vh', 'left': (x * spawner._width) + 'vw' });
        this._pos = [x, y];
    }
    
    /**
     * Kills the monster.
     */
    kill() {
        clearInterval(this._move);
        this._$div.remove();
    }
}

var spawner = {
_grid: {},
_count: 0,
_width: 10, 
_height: 10,
_lastpos: [],

/**
 * Spawns an enemy on passed coordinate. The coordinate are relative to the spawner grid
 * and not to the windows.
 * 
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 * @returns {bool} true if the enemy has been spawn, false otherwise. Raise en exeption if the grid is full.
 */
spawn(x, y){
    // Grid full.
    if (this._count >= this._width * this._height)
        throw new Error("The grid is full");
    
    if (x < this._width && y < this._height){
        let pos = x + y * this._width;

        if (!(pos in this._grid)) {
            // Position empty
            this._grid[pos] = new Monster(x, y);
            ++this._count;
            return true;
        }
    }

    return false;
},

/**
 * Move the enemy to another grid position.
 * 
 * @param {number} sx Starting x position.
 * @param {number} sy Starting y position.
 * @param {number} fx Final x position.
 * @param {number} fy Final y position.
 * 
 * @returns {bool} True if the enemy is moved, false otherwise.
 */
move(sx, sy, fx, fy){
    // Grid full.
    if (this._count >= this._width * this._height)
        throw new Error("The grid is full");


    let pos = sx + sy * this._width;
    let newPos = fx + fy * this._width;

    // Check if the starting position is full and there is none into the final one.
    if (pos in this._grid && !(newPos in this._grid)){
        this._grid[newPos] = this._grid[pos];
        delete this._grid[pos];
        this._grid[newPos].move(fx, fy);
        return true;
    }
    
    return false;
},

/**
 * Shot the enemy on the 
 * 
 * @returns {bool}  True if some enemy is kill, false otherwise.
 */
shoot(){
    let pos = this._lastpos[0] + this._lastpos[1] * this._width;
    if (this._lastpos.length > 0 && pos in this._grid){
        this._grid[pos].kill();
        delete this._grid[pos];

        return true;
    }
    return false;
},

/**
 * Kills all the enemies.
 */
shootAll(){
    for(let prop in this._grid){
        this._grid[prop].kill();
        delete this._grid[prop];
    }
}

}