import { Role } from "./module.js";

export class PlayerList {
    static sortRoleOrder = {"P": 0, "D": 1, "C": 2, "A": 3};
    static classicSorter = (a, b) => {
        const rolePriority = PlayerList.sortRoleOrder[a.role.explicit] - PlayerList.sortRoleOrder[b.role.explicit];
        return rolePriority != 0 ? rolePriority : a.name.localeCompare(b.name);
    }

    constructor (players) {
        /** @type { Array<Player> } */
        this.players = players;
        this.sorter = PlayerList.classicSorter;
    }

    /**
     * @param {Player} player The player to add.
     * @param {Number} cost The player cost.
     */
    add(player, cost) {
        player.cost = cost;
        this.players.push(player);
        this.sort();
    }

    /**
     * @param {string} playerName The name of the player to remove.
     * @returns {Player} The removed player or undefined.
     */
    remove(playerName) {
        return this.players.splice(this.players.findIndex(player => player.name == playerName), 1)[0];
    }
    
    /**
     * @param {string} playerName The name of the player to find.
     * @returns {Player} The player.
     */
    get(playerName) {
        return this.players.find(player => player.name == playerName);
    }

    /**
     * @param {string} filter The filter string. It will filter on the player name.
     * @param {number} maxPlayers Max amount of filtered players.
     * @returns { Array<Player> } filtered players.
     */
    getFilteredPlayers(filter, maxPlayers = Number.MAX_SAFE_INTEGER) {
        /** @type { Array<Player> } */
        let filteredPlayers = [];
        const lowerCaseFilter = filter.toLowerCase();
        for (const player of this.players)
        {
            if (player.name.toLowerCase().includes(lowerCaseFilter))
            {
                filteredPlayers.push(player);
            }

            if (filteredPlayers.length >= maxPlayers)   break;
        }
        return filteredPlayers;
    }

    setDefaultSorter(sorter) {
        this.sorter = sorter;
    }

    sort(sorter = null) {
        this.players.sort(sorter ? sorter : this.sorter);
    }
}

export class Player {
    constructor(jsonPlayer) {
        this.id = jsonPlayer.id;
        this.role = new Role(jsonPlayer.role);
        this.roleM = new Role(jsonPlayer.roleM);
        this.name = jsonPlayer.name;
        this.team = jsonPlayer.team;
        this.price = jsonPlayer.price;
        this.priceM = jsonPlayer.priceM;
        this.value = jsonPlayer.value;
        this.valueM = jsonPlayer.valueM;
        this.cost = 0;
    }
}