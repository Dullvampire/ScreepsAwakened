module.exports.loop = function () {
    //Memory management
    for (var creepName in Memory.creeps) {
        if (!Game.creeps[creepName]) {
            delete Memory.creeps[creepName];
        }
    }

    for (var spawnName in Memory.spawns) {
        if (!Game.spawns[spawnName]) {
            delete Memory.spawns[spawnName];
        }
    }

    var actionList = [];
    var actions = {};

    for (let actionName of actionList) {
        actions[actionName] = require('action.' + actionName);
    }
};
