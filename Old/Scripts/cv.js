//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// GLOBAL /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

const MANA_PER_SECOND = 100;
var input_map = { 
    '73': () => { parser.stopPreviousExecution(); toggle_talents_tree(true); },        // Talents tree.
    '27': () => { parser.stopPreviousExecution(); go_back(); },
};
var global = { acceptInput : true, recoveringMana : null, currentPg : 0 };

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// GENERAL ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

/**
 * Inits all components.
 */
function init() {
    // Hide sections.
    $('#character_code_environment').hide();
    $('#character').hide();

    // Create pgs for selection.
    create_pg();
    parser.init();

    // set_character(0);
}

/**
 * Called on resize window.
 */
function resize(){
    // Aestetic stuffs.
    move_fake_border();

    // Re-position the equip div.
    position_equip();

    // Re-position the fake inventory.
    position_fake_inventory();

    // Resize talents tabs.
    resize_talents_categories()
}

/**
 * Handles the input.
 * 
 * @param {Event} event The event.
 */
function handle_input(event){
    if (global.acceptInput && event.keyCode in input_map){
        // Execute ability.
        global.acceptInput = false;
        input_map[event.keyCode]();
        $('#ability_' + event.keyCode).addClass('activated');

        // Let ability border blink.
        setTimeout(() => {
            $('#ability_' + event.keyCode).removeClass('activated');
            $('#character_abilities .loading_screen').addClass('loading');

            // Make other abilities usable after loading is finished.
            setTimeout(() => {
                $('#character_abilities .loading_screen').removeClass('loading');
                global.acceptInput = true;
            }, 1000);
        }, 100)
        
    }
}

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// SELECTION ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

/**
 * Creates new character for the selection.
 */
function create_pg(){
    let $selection = $('#selection');

    // For each pg create a row.
    pgs.list.forEach((pg, i) => {
        let newCharacter = domer.createPg(pg.avatar, pg.name, pg. race, pg.spec, pg.background);
        newCharacter.onclick = () => {choose_character(i)};
        newCharacter.id = 'pg_' + i;
        $selection.append($(newCharacter));
    });

    // Show a background.
    $('.fake_body').eq(0).show();
}

/**
 * Choose a character to show.
 * 
 * @param {number} idx The index of the character in the characters array.
 */
function choose_character(idx){
    // Start rendering pg in background.
    var promise = set_character(idx);

    // Move avatar.
    let $old = $('#pg_' + idx + ' img');

    // First we copy the image a couple of time.
    let $new = $old.clone().appendTo('#character_avatar');
    let $temp = $old.clone().appendTo('body').css('border', '6px solid rgba(0,0,0,0)');

    // Store attributes.
    let newOffset = $new.offset(), newDim = $new.css('width');
    let oldOffset = $old.offset();

    // hide new and old and move $temp to position
    // also big z-index, make sure to edit this to something that works with the page
    $temp.css({ 'position': 'absolute', 'left': oldOffset.left, 'top': oldOffset.top, 'zIndex': 1000 });
    $old.hide();

    // Start fade and movement animations.
    $('#selection').hide(400);
    $temp.animate({ 'top': newOffset.top, 'left': newOffset.left, 'width': newDim }, 'slow', function () {
        // Wait the pg to be rendered.
        async_show(promise, $temp);
    });
}

/**
 * Waits for pg to be rendered and then shows it.
 * 
 * @param {Promise} promise The function rendering pg in background.
 * @param {Element} $temp The fake avatar to delete.
 */
async function async_show(promise, $temp){
    // Wait rendering.
    await promise;
    
    // Show it.
    let $ch = $('#character');
    $ch.hide();
    $ch.css('z-index', 600);
    $('#character').show(700, () => {
        $temp.remove();
        create_fake_border();
    });
}

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// SHOW //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
let borderSize = 3,             // Border size around pg.
    equips,                     // The equips square div.
    $fakeInventory,             // The inventory div to fake closing and opening.
    isTogglingInvetory;         // Flag to be sure the inventory cannot be toggled twice a time.

/**
 * Prepares character visualization in background.
 * 
 * @param {number} index The index of the character.
 */
function set_character(index){
    let $ch = $('#character');
    $ch.show();
    $ch.css('z-index', '-1');
    global.currentPg = index;
    
    return new Promise( (resolve) => {
        domer.showPg(pgs.list[index]);

        // Find equips divs and position them. 
        find_equip();
        position_equip();

        // Inventory stuffs.
        create_fake_inventory();

        // Resize talents tabs.
        resize_talents_categories();

        resolve();
    });
}

/**
 * Creates a fake avatar components to simulate border around avatar and life.
 */
function create_fake_border() {
    // Border for health bar.
    let $chInfo = $("#character_info > div");
    let offset = $chInfo.offset();
    let $fakeCI = $chInfo.clone().appendTo('body').attr('id', 'fake_character_info');

    $fakeCI.css({
        'position': 'absolute', 'left': offset.left - borderSize, 'top': offset.top - borderSize, 'zIndex': 300,
        'width': $chInfo.width() + borderSize * 2, 'height': $chInfo.height() + borderSize * 2, 'border': borderSize + 'px ridge gray',
        'border-radius': '10px'
    });
    $fakeCI.empty();

    // Border for avatar.
    let $chImg = $("#character_avatar > img");
    offset = $chImg.offset();
    let $fakeCA = $chImg.clone().appendTo('body').attr('id', 'fake_character_avatar');
    let imgBorder = parseInt($chImg.css("border-left-width"));

    $fakeCA.css({
        'position': 'absolute', 'left': offset.left - borderSize, 'top': offset.top - borderSize, 'zIndex': 300,
        'width': $chImg.width() + (borderSize + imgBorder) * 2, 'height': $chImg.height() + (borderSize + imgBorder) * 2, 'border': borderSize + 'px ridge gray',
        'border-radius': '100%'
    });
    $fakeCA.empty();
}

/**
 * Resizes the fake border.
 */
function move_fake_border(){
    let offset = $("#character_info > div").offset();
    $('#fake_character_info').css({
        'left': offset.left - borderSize, 'top': offset.top - borderSize, 
        'width': $("#character_info > div").width() + borderSize * 2, 'height': $("#character_info > div").height() + borderSize * 2,
    });

    offset = $("#character_avatar > img").offset();
    let imgBorder = parseInt($("#character_avatar > img").css("border-left-width"));
    $('#fake_character_avatar').css({
        'left': offset.left - borderSize, 'top': offset.top - borderSize,
        'width': $("#character_avatar > img").width() + (borderSize + imgBorder) * 2, 
        'height': $("#character_avatar > img").height() + (borderSize + imgBorder) * 2,
    });
}

/**
 * Initializes equip object.
 */
function find_equip(){
    equips = {
        helmet: { $div: $('#equip_helmet'), right: 50, top: 6 },
        rightHand: { $div: $('#equip_right_hand'), right: 8, top: 56 },
        leftHand: { $div: $('#equip_left_hand'), right: 88, top: 56 },
        body: { $div: $('#equip_body'), right: 49, top: 30 },
        legs: { $div: $('#equip_legs'), right: 49, top: 70 },
        foot: { $div: $('#equip_foot'), right: 50, top: 93 }
    };
}

/**
 * Positions the equip div.
 */
function position_equip(){
    let $equipDiv = $('#character_equip > img');

    for (var equip in equips)
        place_equip(equips[equip], $equipDiv.width(), $equipDiv.height(), $equipDiv.offset());
}

/**
 * Sets the equip div to the right position wrt the image.
 * 
 * @param {object} equip Equip object.
 * @param {number} parentWidth Width of the image on which position the equip div.
 * @param {number} parentHeight Height of the image on which position the equip div.
 * @param {number} parentOffset Offset of the image on which position the equip div.
 */
function place_equip(equip, parentWidth, parentHeight, parentOffset){
    let x = parentOffset.left + parentWidth / 100.0 * equip.right;
    let y = parentOffset.top + parentHeight / 100.0 * equip.top;

    equip.$div.offset({ left: x - equip.$div.width() / 2., top: y - equip.$div.height() / 2.});
}

/**
 * Creates the fake inventory to simulate the inventory closing and opening.
 */
function create_fake_inventory(){
    let $inventory = $('#inventory_internal');
    let offset = $inventory.offset();

    $fakeInventory = $('#inventory_internal').clone(true).appendTo('body');
    $fakeInventory.css({ 'position': 'absolute', 'left': offset.left, 'top': offset.top, 'zIndex': 500,
                        'width': $inventory.width(), 'height': $inventory.height(), 'border': $inventory.css('border')});
    $fakeInventory.hide();
}

/**
 * Re-position the fake inventory.
 */
function position_fake_inventory() {
    $fakeInventory.show();

    // Re-position and resize fake inventory.
    if ($('#inventory_internal').is(':hidden')) {
        $fakeInventory.offset($('#inventory_button > i').offset());
    }
    else {
        $fakeInventory.css({ 'width': $('#inventory_internal').width(), 'height': $('#inventory_internal').height()});
        $fakeInventory.offset($('#inventory_internal').offset());
    }


    $fakeInventory.hide();
}

/**
 * Toggles the visibility of the inventory.
 */
function toggle_inventory(){
    if(!isTogglingInvetory) {
        isTogglingInvetory = true;

        // Store needed element.
        let $inventory = $('#inventory_internal');
        let $button = $('#inventory_button > i');
        let isHidden = $inventory.is(':hidden');

        // To allow offset correctly works.
        $inventory.show();

        let finalOffset = isHidden ? $inventory.offset() : $button.offset();
        let finalWidth = isHidden ? $inventory.width() : $button.width();
        let finalHeight = isHidden ? $inventory.height() : $button.height();

        // Use the fake inventory for the effect.
        $fakeInventory.show();
        $inventory.hide();

        $fakeInventory.animate({ 'top': finalOffset.top, 'left': finalOffset.left, 'width': finalWidth, 'height': finalHeight}, 'slow', () => {
            $fakeInventory.hide();

            if (isHidden) $inventory.show();

            isTogglingInvetory = false;
        });
    }
}

/**
 * Resizes the talents category's tab.
 */
function resize_talents_categories(){
    $('.talents_category').height($('#character_talents').height() - $('#character_talents ul').height() - 10);

    $('.talents_category .talent_info > .col-3 > img').resize(() => {console.log("Ok");});
}

/**
 * Shown the talents or abilities window.
 * 
 * @param {boolean} showTalentsWindow True if the talents window has to be shown.
 */
function toggle_talents_tree(showTalentsWindow){
    let $talents = $('#character_talents'), $abilities = $('#character_code_environment');

    // Need to swap visibility.
    if ($talents.is(':hidden') == showTalentsWindow){
        if (showTalentsWindow){
            $abilities.hide(); $talents.show(); 
        }
        else{
            $talents.hide(); $abilities.show();
        }
    }
}

/**
 * Sets the value of your mana points.
 * 
 * @param {number} newValue The new mana.
 */
function set_mana(newValue){
    let max = Number($('#mana_indicator > span:nth-child(2)').text());
    
    if (newValue >= 0 && newValue <= max) {              
        $('#current_mana').css('width', (newValue / max * 100) + '%'); 
        $('#mana_indicator > span:first-child').text(newValue); 
    }
}

/**
 * Sets the value of your health points.
 * 
 * @param {number} newValue The new health.
 */
function set_health(newValue) {
    let max = Number($('#health_indicator > span:nth-child(2)').text());

    if (newValue >= 0 && newValue <= max) {
        $('#current_health').css('width', (newValue / max * 100) + '%');
        $('#health_indicator > span:first-child').text(newValue);
    }
}

/**
 * Recovers mana gradually.
 */
function recover_mana(){
    if (global.recoveringMana == null){
        global.recoveringMana = setInterval(() => {
            let max = Number($('#mana_indicator > span:nth-child(2)').text());
            let next = Math.max(Math.min(Number($('#mana_indicator > span:first-child').text()) + MANA_PER_SECOND, max), 0);
            set_mana(next);

            if (next == Number($('#mana_indicator > span:nth-child(2)').text())){
                clearInterval(global.recoveringMana);
                global.recoveringMana = null;
            }
        }, 1000);
    }
}

/**
 * Shows the dead screen and reset life and mana.
 */
function die() {
    // Show animation.
    $('#dead h1').css({ 'font-size': '100px' });
    $('#dead').fadeIn(2000);
    $('#dead h1').animate({'font-size': '135px'}, 2000, () => {
        // After 2 seconds reset life and mana.
        setTimeout(() => {
            $('#dead').hide();
            set_health(Number($('#health_indicator > span:nth-child(2)').text()));
            set_mana(Number($('#mana_indicator > span:nth-child(2)').text()));
        }, 2000);
    });
}

function go_back(){
    // Move avatar.
    let $old = $('#character_avatar img');

    // First we copy the image a couple of time.
    let $new = $('#pg_' + global.currentPg + ' img');
    let $temp = $old.clone().appendTo('body');

    // Store attributes.
    $new.show();
    $('#selection').show();
    let newOffset = $new.offset(), newDim = $new.css('width');
    let oldOffset = $old.offset();
    $new.hide();
    $('#selection').hide();

    // hide new and old and move $temp to position
    // also big z-index, make sure to edit this to something that works with the page
    $temp.css({ 'position': 'absolute', 'left': oldOffset.left, 'top': oldOffset.top, 'zIndex': 1000, 'width': $old.css('width') });
    $old.hide();

    // Start fade and movement animations.
    $('body > #inventory_internal').remove();
    $('#fake_character_info').remove();
    $('#fake_character_avatar').remove();
    $('#character').hide(400, () => {
        domer.clean();
    });
    $temp.animate({ 'top': newOffset.top, 'left': newOffset.left, 'width': newDim, 'opacity': $new.css('opacity') }, 'slow', function () {
        // Wait the pg to be rendered.
        $('#selection').show();
        $temp.remove();
        $new.show();
    });
}