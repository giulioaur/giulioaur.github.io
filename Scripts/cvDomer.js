/**************************ELEMENT CREATION *********************************/
let STATS = Object.freeze({ "str": 0, "con": 1, "dex": 2, "int": 3, "sag": 4, "cha": 5});     // Pg stats enumeration.

var domer = {   
    
/**
 * Creates a new avatar row for the character selection.
 * 
 * @param {string} avatar The avatar path.
 * @param {string} name The name of the pg.
 * @param {string} race The race of the pg.
 * @param {string} spec The class of the pg.
 * 
 * @returns {Element} The created pg info.
 */
createPg (avatar, name, race, spec, back){
    let pgInfo = document.createElement('div');
    let id = name.split(' ').join('_');

    pgInfo.classList.add('pg_info', 'row'); 
    pgInfo.onmouseenter = () => { $('.fake_body').hide(); $('#fake_back_' + id).show();};
    pgInfo.innerHTML = `
    <div class="col-1"></div>
    <div class="pg_avatar col-3 d-flex align-items-center">
        <img class="pg_image" src="${avatar}" />
    </div>
    <div class="col-7 d-flex align-items-center pg_text">
        <div>
            <div class="pg_label">Name: </div><div class="pg_name pg_attribute">${name}</div>
            <div class="pg_label">Race: </div><div class="pg_race pg_attribute">${race}</div>
            <div class="pg_label">Class: </div><div class="pg_class pg_attribute">${spec}</div>
        </div>
    </div>
    <div class="col-1"></div>
    `;

    $('body').append(`<div class="fake_body" style="display: none; background-image: url('${back}')" id="fake_back_${id}"> </div>`)

    return pgInfo;
},

/**
 * Show all the statistics and equips of a selected pg.
 * 
 * @param {Element} pg The selected pg.
 */
showPg (pg){
    this.setStats(pg.name, pg.statistics);
    this.setObjects(pg.equips, pg.inventory);
    this.setTalents(pg.talentCategories);
    this.setAbilities(pg.abilities);
},

/**
 * Set the pg's info.
 * 
 * @param {string} name The pg name.
 * @param {number[]} statistics The statistics.
 */
setStats(name, statistics){
    // Set info.
    $('#character_name').text(name);

    // Set stats.
    let toNum = (num) => { return Math.max(num, 0) > 9 ? num : '0' + num; }
    $('#stat_str').text(toNum(statistics[STATS.str]));
    $('#stat_con').text(toNum(statistics[STATS.con]));
    $('#stat_dex').text(toNum(statistics[STATS.dex]));
    $('#stat_int').text(toNum(statistics[STATS.int]));
    $('#stat_sag').text(toNum(statistics[STATS.sag]));
    $('#stat_cha').text(toNum(statistics[STATS.cha]));
},

/**
 * Draws the pg's objects.
 * 
 * @param {Object[]} equips The equipped object.
 * @param { {src: string, descr: string }[] } inventory The objects in the inventory.
 */
setObjects(equips, inventory){
    // Set equip.
    for (let piece in equips) {
        let $img = $('#equip_' + piece + ' > img');

        $img.attr({ 'src': equips[piece].src, 'data-content': equips[piece].descr });
        $img.popover();
    }

    // Set inventory.
    let $inventoryObj = $('#inventory_internal .row img');
    for (let i = 0, n1 = inventory.length, n2 = $inventoryObj.length; i < n1 && i < n2; ++i) {
        $inventoryObj.eq(i).attr({ 'src': inventory[i].src, 'data-content': inventory[i].descr });
        $inventoryObj.eq(i).popover();
    }
},

/**
 * Draws the talents' tree.
 * 
 * @param {Object[]} talentCategories The categories containing talents.
 */
setTalents(talentCategories){
    // Set talents.
    let $talentsHeaders = $('#talents_general .h-25 > h1');
    let $talentsImages = $('#talents_general .talent_row');
    for (let i = 0, n1 = talentCategories.length, n2 = $talentsHeaders.length; i < n1 && i < n2; ++i) {
        // Show talents in general tab.
        let category = talentCategories[i];

        $talentsHeaders.eq(i).parent().parent().parent().addClass('showed');
        $talentsHeaders.eq(i).text(category.name);
        category.talents.forEach(talent => {
            $talentsImages.eq(i).append(`<div class="col-3">
                <img src="${talent.image}" />
            </div>`);
        });

        // Creates talents' category tab.
        let tabName = 'category' + i;

        $('#character_talents ul')
            .append($(`<li class="nav-item">
                        <a class="nav-link" id="talents_${tabName}_tab" data-toggle="tab" href="#talents_${tabName}" role="tab" aria-controls="profile"
                            aria-selected="false">${category.name}</a>
                    </li>`));

        $('#talents_categories')
            .append($(`<div class="tab-pane fade talents_category" id="talents_${tabName}" role="tabpanel" aria-labelledby="talents_${tabName}_tab">
                            <div class="container-fluid"></div>
                        </div>`));

        // Add talents to the category tab.
        category.talents.forEach(talent => {
            $('#talents_' + tabName + ' > .container-fluid').append(`
                <div class="row h-25 talent">
                    <div class="col-12">
                        <div class="row h-50 talent_info">
                            <div class="col-2 d-flex align-items-center">
                                <img src="${talent.image}" />
                            </div>
                            <div clss="col-7 d-flex align-items-center">
                                <h2>${talent.name}</h2>
                            </div>
                        </div>
                        <div class="row h-50 talent_description">
                            <div class="col-12">
                                <p>${talent.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });

        // Add link to the category tab.
        $talentsImages.eq(i).click(() => { $('#talents_' + tabName + '_tab').trigger('click'); })
    };
},

/**
 * Draws the abilities bar.
 * 
 * @param {{icon : string, shortcut: string, code: string}[]} abilities The abilities of the pg.
 */
setAbilities(abilities){
    let $abilitySpace = $('#abilities_bar .col-1');

    for (let i = 0; i < abilities.length && i < 10; ++i){
        let ability = abilities[i];
        let keyCode = ability.shortcut.charCodeAt(0);

        // Draw the ability.
        $abilitySpace.eq(i).attr('id', 'ability_' + keyCode);
        $abilitySpace.eq(i).addClass('set');
        $abilitySpace.eq(i).css('background-image', 'url("' + ability.icon + '")');
        $abilitySpace.eq(i).append($(`<h1>${ability.shortcut}</h1>`));

        // Bind it to a key.
        input_map[keyCode] = () => {
            toggle_talents_tree(false);
            parser.stopPreviousExecution().then(() => parser.parse(ability.code));
        }
    }
}

}
