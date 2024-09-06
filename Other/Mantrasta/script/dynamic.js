/**
 * @param {InputEvent} event
 * @param {PlayerList} listone 
 */
function filterPlayers(event, listone, selectPlayerCallback) {
    const filter = event.target.value;
    const players = listone.getFilteredPlayers(filter, 10);
    const $appendTo = $('#players-dropdown ul');
    $('#players-dropdown ul > li').remove();
    players.forEach(player => {
        const element = `<li><a class="dropdown-item" href="#">${player.name}</a></li>`
        $appendTo.append(element);
        $appendTo.children().last().children().last().on('click', () => selectPlayerCallback(player));
    });
}

function clearFilteredPlayers() {
    $('#players-dropdown input').val("");
    $('#players-dropdown ul > li').remove();
}

/**
 * @param {PlayerList} playerList 
 */
function getPlayerList(playerList) {
    const [roleFilter, teamFilters] = getPlayerListFilters();

    return playerList.players
        .filter(player => roleFilter.explicit == "" || roleFilter.overlap(player.roleM))
        .filter(player => teamFilters.length == 0 || teamFilters.find(team => team == player.team.toLowerCase()))
        .map(player => {
            const roles = player.roleM.subRoles
                .map(role => `<span class="role-icon ${role}">${role}</span>`)
                .join(" ");
            return {
                name: player.name,
                team: `<span class="team-icon ${player.team}">${player.team}</span>`,
                roles: roles,
                price: player.priceM
            };
        });
}

function getPlayerListFilters() {
    let roleFilter = new Role($('#player-role-filters span').toArray()
        .filter(filter => filter.dataset.filterState == 'on')
        .map(filter => filter.dataset.first)
        .join(';'));
    let teamFilters = $('#player-team-filters span').toArray()
        .filter(filter => filter.dataset.filterState == 'on')
        .map(filter => filter.dataset.first);

    return [roleFilter, teamFilters];
}