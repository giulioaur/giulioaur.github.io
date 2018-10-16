//////////////////////////////////////// CONSTANTS ////////////////////////////////////////
const WRITING_SPEED = 20;                           
const NODE_TYPES = ['NODEC', 'NODET', 'NODED', 'NODEI', 'NODEP', 'NODEE'];     // I know that this is not properly constant.
const EVENT_NAME = "execute";
const HTML_WORDS = { '\n': '<br>', '\t': '&emsp;', '<': '&lsaquo;', '>': '&rsaquo;'}
var ELEMENTS;

//////////////////////////////////////// GLOBAL ////////////////////////////////////////
var parserGlobal = {isExecuting: false, stopExecution: false};

/**
 * Node to construct the parser list.
 */
class Node{
    /**
     * Creates a new node.
     * 
     * @param {number} idx The ordered position of the node.
     * @param {string} content The content of the node.
     * @param {JqueryElement} $father The father element in the HTML page.
     */
    constructor(idx, content = '', $father = null, type = 'D'){
        this._idx = idx;
        this._type = type;
        let $element = $father != null ? $('<span id="node_' + idx + '"></span>').appendTo($father) : null;

        switch(type){
            case 'C': case 'T': case 'I':
                this.execute = () => {
                    let str = content;

                    return new Promise((resolve, reject) => {
                        let currentStr = "", currentIdx = 0;

                        // Format tabs.
                        str = str.split('    ').join('\t');

                        // Move cursor.
                        ELEMENTS.$CURSOR.insertAfter($element);

                        if (type == 'I') {           // Write all text at once.
                            for (var i = 0; i < str.length; i++)
                                currentStr += HTML_WORDS.hasOwnProperty(str[i]) ? HTML_WORDS[str[i]] : str[i];

                            $element.html(currentStr);
                            resolve();
                        }
                        else {                                      // Write the text incrementally.
                            let addLetter = setInterval(() => {
                                if (currentIdx < str.length && !parserGlobal.stopExecution) {
                                    let ch = str[currentIdx];

                                    if (HTML_WORDS.hasOwnProperty(ch)) currentStr += HTML_WORDS[ch];            // Break line.          
                                    else currentStr += ch;                                                      // Normal letter.

                                    ++currentIdx;
                                    $element.html(currentStr);

                                    if (type == 'T')    $('#code_terminal').scrollTop($('#code_terminal > div').prop("scrollHeight"));
                                }
                                else {
                                    clearInterval(addLetter);
                                    if (parserGlobal.stopExecution) reject();
                                    else                            resolve();
                                }
                            }, WRITING_SPEED);
                        }
                    });
                }
                break;
            case 'D':
                this.execute = () => {
                    return new Promise((resolve, reject) => {
                        let toDelete = content.split(',');

                        ELEMENTS.$CURSOR.insertAfter($('#node_' + toDelete[toDelete.length - 1]));

                        setTimeout(() => {
                            let $nodes = $(toDelete.map(x => '#node_' + x).join(', '));
                            $nodes.css('background-color', 'gray');
                            ELEMENTS.$CURSOR.insertBefore($nodes.eq(0));

                            setTimeout(() => {
                                $nodes.remove();
                                resolve();
                            }, 200)
                        }, 200);
                    });
                }
                break;
            case 'P':
                this.execute = () => {
                    let time = parseInt(content);

                    return new Promise((resolve, reject) => {
                        // Set pause.
                        let timeout = setTimeout(() => {
                            resolve();
                            clearInterval(interval);
                        }, time);

                        // Check if interruption happens.
                        let interval = setInterval(() => {
                            if (parserGlobal.stopExecution) {
                                clearTimeout(timeout);
                                clearInterval(interval);
                                reject();
                            }
                        }, WRITING_SPEED);
                    });
                }
                break;
            case 'E':
                this.execute = () => {
                    return new Promise((resolve, reject) => {
                        eval(content);
                        resolve();
                    });
                }
                break;
        }
    }

    /**
     * The index of the node.
     */
    get idx() { return this._idx; }

    /**
     * The type of the node.
     */
    get type() { return this._type; }
 
    // /**
    //  * The element containing the node content.
    //  */
    // get $element() { return this._element; }

    // /**
    //  * The content of the node.
    //  */
    // get content() { return this._content; }
    // set content(cont) { this._content = cont; }
}

var parser = {

/**
 * Init all the stuff needed by the parser.
 */
init(){
    ELEMENTS = Object.freeze({ROOT : document.getElementById('character_code_environment'), $CURSOR : $('#blinking_cursor')});
},

/**
 * Parses the text and starts the execution of the obtained code.
 * 
 * @param {string} str The string to parse
 */
parse(str){
    // Retrieve list of nodes and sort them by their execution order.
    let list = this.buildNodeList(str);
    list.sort((a, b) => { return a.idx - b.idx; });

    // Start node execution.
    parserGlobal.isExecuting = true;
    parserGlobal.stopExecution = false;
    this.execute(list);
},

/**
 * Builds the list of instructions as nodes.
 * 
 * @param {string} str The string to parse.
 * @return {Node[]} The list of instructions.
 */
buildNodeList(str){
    let nodeList = [];
    let pos = 0;

    // Parse whole string.
    while (pos < str.length && pos >= 0){
        if (str[pos] != '\\')
            throw Error('Expected "\\NODE" at position ' + pos + '.');

        ++pos;
        let nodeType = str.substr(pos, 5);

        if (NODE_TYPES.includes(nodeType))
            pos = this.parseNode(str, pos + 5, nodeList, nodeType.substr(4, 1));   
        else
            throw Error(`${nodeType} at position ${pos} is not a valid node type.`);
    }

    return nodeList;
},

/**
 * Parse a node.
 * 
 * @param {string} str The string to parse.
 * @param {number} pos The string position.
 * @param {Node[]} list The list in which insert the node.
 * @param {string} type The type of the node.
 * 
 * @returns {number} The new position in the string.
 */
parseNode(str, pos, list, type){
    // Check for error in syntax.
    let closure = str.indexOf(']', pos + 1);
    if (str[pos] != '[' || closure < pos)
        throw Error('Expected "[/digits/]" at position ' + pos + '.');
    
    // Parse index of the node.
    let index = str.substr(pos + 1, closure - pos - 1);
    if (Number(index) == NaN)
        throw Error('Expected a number at position ' + pos + 1 + '.');

    // Check type of node and parse it.
    closure++;
    if (type == 'C' || type == 'T' || type == 'I' || type == 'E'){        // Text node.
        let newPos = str.indexOf('\\NODE', closure);
        let content = str.substr(closure, (newPos > 0 ? newPos : str.length) - closure);
        list.push(new Node(parseInt(index), content, type == 'E' ? null : type == 'C' ? $('#code_paper .node_father') : $('#code_terminal .node_father'), type));
        return newPos;
    }
    else if (type == 'D' || type == 'P'){                  // Deleter and pause node.
        let closure2 = str.indexOf(']', closure);
        if (str[closure] != '[' || closure2 < closure)
            throw Error('Expected "[/list_of_nodes_to_delete/]" at position ' + closure + '.');
        
        list.push(new Node(parseInt(index), str.substr(closure + 1, closure2 - closure - 1), null, type));
        return str.indexOf('\\NODE', closure2 + 1);
    }
    else{
        throw Error('Type \\NODE' + type + 'is not a valid node.');
    }
},

/**
 * Executes the nodes list.
 * 
 * @param {Node[]} list The list of nodes to execute.
 */
async execute(list){
    for (let i = 0; parserGlobal.isExecuting && !parserGlobal.stopExecution && i < list.length; ++i){
        let node = list[i];

        try {
            await node.execute();
        }
        catch (err) {
            parserGlobal.isExecuting = false;
        }
    }

    parserGlobal.isExecuting = false;
},

/**
 * Stop the previous current execution if any.
 */
stopPreviousExecution: async () => {
    if (parserGlobal.isExecuting) {
        // Start the stop process.
        let stopper = new Promise((resolve) => {
            parserGlobal.stopExecution = true;

            // Check until the previous execution is no more running.
            let interval = setInterval(() => {
                if (!parserGlobal.isExecuting) {
                    clearInterval(interval);
                    resolve();
                }
            }, WRITING_SPEED)
        });

        await stopper;
        parserGlobal.stopExecution = false;
    }

    // Clean up all.
    ELEMENTS.$CURSOR.appendTo(ELEMENTS.ROOT);
    $('#code_paper .node_father, #code_terminal .node_father').empty();
    ELEMENTS.$CURSOR.appendTo($('#code_paper .node_father'));
}

}