import { Module, ModuleCompatibilty } from "./module.js";
import { Player, PlayerList } from "./player.js";
import { shuffle, maxIndex } from "./utilities.js";

export class TeamList {
    constructor(modules) {
        /** @type { Array<Module> } */
        this.modules = modules;
        /** @type { Array<Team> } */
        this.teams = [];
    }

    serialize() {
        return JSON.stringify(this);
    }

    /**
     * @param {String} jsonString 
     * @param {PlayerList} playerList 
     */
    deserialize(jsonString, playerList) {
        const jsonObject = JSON.parse(jsonString);
        this.teams = jsonObject.teams
            .map(jsonTeam => new Team("", 0).deserialize(jsonTeam, playerList, this.modules));
    }

    /**
     * @param {Team} team The team to add
     */
    add(team) {
        this.teams.push(team);
        team.computeMissingRoles(this.modules);
    }

    /**
     * @param {String} teamName 
     * @return {Team}
     */
    get(teamName) {
        return this.teams.find(team => team.name == teamName);
    }

    recomputeMissingRoles(teamName) {
        const teamToUpdate = this.get(teamName);
        if (teamToUpdate)   teamToUpdate.computeMissingRoles(this.modules);
    }
}

export class Team {
    constructor(name, startingCredits = 1000) {
        this.name = name;
        this.credits = startingCredits;
        this.playerList = new PlayerList([]);
        /** @type { Array<ModuleCompatibilty> } */
        this.moduleCompatibilities = [];
    }

    /**
     * @param {Object} jsonObject 
     * @param {PlayerList} playerList 
     * @param {Array<Module>} moduleList 
     */
    deserialize(jsonObject, playerList, moduleList) {
        this.name = jsonObject.name;
        this.credits = jsonObject.credits;
        jsonObject.playerList.players.forEach(player => {
            this.playerList.add(playerList.get(player.name));
            playerList.remove(player.name);
        });
        this.computeMissingRoles(moduleList);
        return this;
    }

    /**
     * @param {Player} player The player to add.
     * @param {Number} cost Its cost.
     */
    addPlayer(player, cost) {
        this.playerList.add(player);
        this.credits -= cost;
    }

    /**
     * @param {String} playerName The name of the player to remove
     * @returns {Player} The removed player, if any was removed.
     */
    removePlayer(playerName) {
        let removedPlayer = this.playerList.remove(playerName);
        if (removedPlayer)  this.credits += removedPlayer.cost;
        return removedPlayer;
    }

    /**
     * @param {Array<Module>} moduleList 
     */
    computeMissingRoles(moduleList) {
        this.moduleCompatibilities.splice(0, this.moduleCompatibilities.length);
        
        moduleList.forEach((module, k) => {
            const computeRolesAvailability = (players) => {
                const rolesNum = module.roles.length;
                const playersNum = players.length;
                let rolesFilled = 0;
                // Numbers of players that could fit each role.
                let rolesAvailability = new Array(rolesNum).fill(0);
                // The mask of the roles each player could fit.
                let playerMasks = new Array(playersNum).fill(null).map(() => new Array(rolesNum).fill(false));
                // List of players for that specif role.
                let playersPerRole = new Array(rolesNum).fill(null).map(() => new Array());
                // Fill rolesAvailability and playerMasks.
                players.forEach((player, i) => {
                    module.roles.forEach((role, j) => {
                        if (role.overlap(player.roleM))
                        {
                            rolesAvailability[j] += 1;
                            playerMasks[i][j] = true;
                            playersPerRole[j].push(player);
                        }
                    });
                });
                // Fill a role for each player.
                players.forEach((player, i) => {
                    let roleIndex = -1;
                    let minRoleAvailability = 31;
                    playerMasks[i].forEach((canDo, j) => {
                        if (canDo && rolesAvailability[j] < minRoleAvailability) {
                            minRoleAvailability = rolesAvailability[j];
                            roleIndex = j;
                        }
                    });

                    if (roleIndex < 0)  return;
                    // If a suitable role has been found, remove the player from the pool.
                    playerMasks[i].forEach((canDo, j) => {
                        if (canDo) {
                            rolesAvailability[j] -= 1;
                        }
                    });
                    rolesFilled += 1;
                    rolesAvailability[roleIndex] = -1; // This role has been filled.
                });
                return [rolesFilled, rolesAvailability, playersPerRole];
            };

            // The algorithm above might have some edge cases, so I'll execute it few times and take
            // the better result.
            let rolesFilled = new Array(3).fill(0);
            let rolesAvailabilities = new Array(rolesFilled.length);
            let playersPerRoles = new Array(rolesFilled.length);
            [rolesFilled[0], rolesAvailabilities[0], playersPerRoles[0]] = 
                computeRolesAvailability(this.playerList.players);
            [rolesFilled[1], rolesAvailabilities[1], playersPerRoles[1]] = 
                computeRolesAvailability(shuffle(this.playerList.players));
            [rolesFilled[2], rolesAvailabilities[2], playersPerRoles[2]] = 
                computeRolesAvailability(shuffle(this.playerList.players));
            const max = maxIndex(rolesFilled, value => value);
            this.moduleCompatibilities.push(new ModuleCompatibilty(module, rolesAvailabilities[max], playersPerRoles[max]));
        });
    }
}