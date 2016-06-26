var utilsRoom = require('utils.room');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var sources = utilsRoom.getContainersAndStorages(creep.room);
            
            if(sources.length) {
                if(creep.transfer(sources[0], RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            else {
                var sources = utilsRoom.getAllSources(creep.room);
                if(sources.length) {
                    if(creep.harvest(sources[creep.memory.harvestTarget]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[creep.memory.harvestTarget]);
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;