import { fetchModulesList, fetchPlayersList } from './data.js';
import { filterPlayers, clearFilteredPlayers, getPlayerList  } from './dynamic.js';
import { PlayerList } from './player.js';
import { Team, TeamList } from './team.js';
import { makeKebab } from './utilities.js';

/** @type { PlayerList } */
var listone = null;
/** @type { TeamList } */
var lega = [];
var bindings = {};
var playerTable = null;

/** @type { Player } */
fanta.selectedPlayer = null;

fanta.startup = async () => {
    let loadingPercentage = 0;
    const doWork = (func, percentage, ...arg) => { func(...arg); loadingPercentage += percentage; }

    await asyncCalls(() => { loadingPercentage += 10; });
    
    doWork(loadState, 10);  // Load local storage data.
    doWork(bindCallbackToHtml, 10); // Bind call to html elements.
    doWork(dataBinding, 10);    // Rivetsjs binding.

    doWork(initPlayersTable, 10); // Fill player list.

    defaultFieldVis();
}

fanta.terminate = () => {
    saveState();
}

async function asyncCalls(onComplete) {
    let promises = [];

    promises.push(new Promise((resolve, reject) => {
        fetchPlayersList(players => {
            listone = players;
            onComplete();
            resolve();
        });
    }));
    
    promises.push(new Promise((resolve, reject) => {
        fetchModulesList(modules => {
            lega = new TeamList(modules);
            onComplete();
            resolve();
        });
    }));

    try {
        await Promise.all(promises);
    }
    catch(e) {
        console.error(e);
    }
}

function bindCallbackToHtml() {
    // Players search.
    document.getElementById('player-search').addEventListener('input', 
        e => filterPlayers(e, listone, player => {
            selectPlayer(player);
        }));

    // Team adding
    document.getElementById('add-team-form').addEventListener('submit', 
        e => {
            e.preventDefault();
            const teamName = e.target.querySelector('#team-name-input').value;
            const teamCredits = e.target.querySelector('#team-credits-input').value;
            lega.add(new Team(teamName, teamCredits ? Number(teamCredits) : 0));
            document.getElementById('add-team-form').reset();
        }
    );

    // Player adding
    document.getElementById('add-player').addEventListener('click', 
        e => {
            const teamName = $('#teams-dropdown button').text();
            const team = lega.get(teamName);

            if (!team || !fanta.selectedPlayer) {
                console.error('Select team, player and credits');
                return;
            }

            team.addPlayer(fanta.selectedPlayer, 0);
            lega.recomputeMissingRoles(teamName);
            listone.remove(fanta.selectedPlayer.name);
            clearFilteredPlayers();
            selectPlayer(null);
        }
    );
}

function dataBinding() {
    rivets.configure({
        // Attribute prefix in templates
        prefix: 'rv',
        // Preload templates with initial data on bind
        preloadData: true,
        // Root sightglass interface for keypaths
        rootInterface: '.',
        // Template delimiters for text bindings
        templateDelimiters: ['{', '}'],
        // Alias for index in rv-each binder
        iterationAlias : function(modelName) {
          return '%' + modelName + '%';
        },
        // Augment the event handler of the on-* binder
        handler: function(target, event, binding) {
          this.call(target, event, binding.view.models)
        },
        // Since rivets 0.9 functions are not automatically executed in expressions. If you need backward compatibilty, set this parameter to true
        executeFunctions: false
    });

    rivets.binders.data1 = function(el, value) {
        el.dataset['first'] = value;
    }
    rivets.binders.data2 = function(el, value) {
        el.dataset['second'] = value;
    }
    rivets.binders.bstarget = function(el, value) {
        el.dataset['bsTarget'] = '#'.concat(makeKebab(value));
    }
    rivets.binders.id = function(el, value) {
        el.id = makeKebab(value);
    }
    rivets.binders.class = function(el, value) {
        // clear old rivets classes for elements that are being reused.
        const rivetsClasses = el.classList.values().filter(val => val.includes("rv-"));
        el.classList.remove(...rivetsClasses);

        if (value)  el.classList.add("rv-" + makeKebab(value));
    }
    rivets.binders.teambg = function(el, value) {
        el.style.backgroundImage = `url('style/img/bkg/${value}.webp')`;
    }
    rivets.binders.col = function(el, value) {
        if (value)  el.classList.add("col-" + Number(value));
    }

    rivets.formatters.team = function(value) {
        return value.substr(0, 3);
    }

    const filterRoles = ['por', 'dd', 'dc', 'ds', 'b', 'm', 'c', 'e', 't', 'w', 'a', 'pc'];
    const filterTeams = ['atalanta', 'bologna', 'cagliari', 'como', 'empoli', 'fiorentina', 'genoa', 
                        'inter', 'juventus', 'lazio', 'lecce', 'milan', 'monza', 'napoli', 'parma', 'roma', 
                        'torino', 'udinese', 'venezia', 'verona'];

    bindings.player = rivets.bind($('#player-stats'), { player: fanta.selectedPlayer, teams: lega.teams });
    bindings.teams = rivets.bind($('#teams-container'), { teams: lega.teams, modules: lega.modules });
    bindings.filterRoles = rivets.bind($('#player-filters'), { filterRoles: filterRoles, filterTeams: filterTeams });
    bindings.fields = rivets.bind($('#pills-fields'), { teams: lega.teams, modules: lega.modules });
}

function initPlayersTable() {
    playerTable = new DataTable('#players-table', {
        data: getPlayerList(listone),
        columns: [
            { data: 'name', title: 'Name' },
            { data: 'team', title: 'Team' },
            { data: 'roles', title: 'Roles' },
            { data: 'price', title: 'Price' }
        ]
    });
}

function selectPlayer(player) {
    fanta.selectedPlayer = player;
    bindings.player.update({ player : fanta.selectedPlayer });
}

function saveState() {
    localStorage.setItem('teams', lega.serialize());
}

function loadState() {
    if (localStorage.hasOwnProperty('teams'))
    {
        lega.deserialize(localStorage.getItem('teams'), listone);
        lega.teams.forEach(team => team.playerList.players.forEach(player => listone.remove(player.name)));
    }
}

/************************ OTHER FUNCTIONS TO EXPOSE ************************/

fanta.selectPlayerTeam = e => {
    const target = $(e.target);
    const header = target.closest('.dropdown').children('button')[0];
    const cleanTeamName = target.data('first');
    $(header).text(cleanTeamName);
}

fanta.togglePlayerListFilter = e => {
    e.target.dataset.filterState = e.target.dataset.filterState == 'off' ? 'on' : 'off';
    // Redraw table.
    playerTable.clear().draw();
    playerTable.rows.add(getPlayerList(listone));
    playerTable.columns.adjust().draw();
}

fanta.removePlayer = e => {
    const teamName = e.target.dataset.first;
    const playerName = e.target.dataset.second;
    let team = lega.get(teamName);
    let removedPlayer = team ? team.removePlayer(playerName) : null;
    if (removedPlayer) {
        listone.add(removedPlayer, 0);
        lega.recomputeMissingRoles(teamName);
    }  
}

fanta.selectFieldTeam = e => {
    fanta.selectPlayerTeam(e); // Change dropdown text.
    const teamName = $(e.target).data('first');
    const team = lega.get(teamName);
    team.moduleCompatibilities.forEach(compatibility => {
        const module = compatibility.module;
        const $field = $(`.field.rv-${module.name}`);
        if ($field) {
            const $rolesElems = $field.find(`.role-icon`);
            module.roles.forEach((role, i) => {
                const $roleEle = $($rolesElems[i]);
                if ($roleEle) {
                    $roleEle.text(`${role.explicit} (${compatibility.playersPerRole[i].length})`);
                    let playerList = "";
                    compatibility.playersPerRole[i].forEach(player => playerList += `<li>${player.name}</li>`);
                    new bootstrap.Tooltip($roleEle[0], {
                        html: true,
                        placement: 'bottom', 
                        title: `<ul class="no-bullets">${playerList}</ul>` 
                    });
                }
            });
        }
    });
}

function defaultFieldVis() {
    lega.modules.forEach(module => {
        const $field = $(`.field.rv-${module.name}`);
        if ($field) {
            const $rolesElems = $field.find(`.role-icon`);
            module.roles.forEach((role, i) => {
                const $roleEle = $($rolesElems[i]);
                const compatiblePlayers = listone.players
                    .filter(player => player.roleM.overlap(role));
                if ($roleEle) {
                    $roleEle.text(`${role.explicit} (${compatiblePlayers.length})`);
                    let playerList = "";
                    compatiblePlayers.forEach(player => playerList += `<li>${player.name}</li>`);
                    new bootstrap.Tooltip($roleEle[0], {
                        html: true,
                        placement: 'bottom', 
                        title: `<ul class="no-bullets hint-list">${playerList}</ul>` 
                    });
                }
            });
        }
    });
}