import { Module } from "./module.js";
import { Player, PlayerList } from "./player.js";

export function fetchPlayersList(callback) {
    $.getJSON("data/listone.json", function(json) {
        const playersArray = json.players.map(jsonPlayer => new Player(jsonPlayer));
        callback(new PlayerList(playersArray));
    });
}

export function fetchModulesList(callback) {
    $.getJSON("data/modules.json", function(json) {
        const modulesArray = json.modules.map(jsonModule => new Module(jsonModule.name, jsonModule.field));
        callback(modulesArray);
    });
}