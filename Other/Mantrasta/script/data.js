function fetchPlayersList(callback) {
    const playersArray = JSONListone.players.map(jsonPlayer => new Player(jsonPlayer));
    callback(new PlayerList(playersArray));
}

function fetchModulesList(callback) {
    const modulesArray = JSONModules.modules.map(jsonModule => new Module(jsonModule.name, jsonModule.field));
    callback(modulesArray);
}