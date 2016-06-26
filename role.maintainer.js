var utilsRoom = require('utils.room');
var roleMaintainer = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.maintaining && creep.carry.energy == 0) {
            creep.memory.maintaining = false;
        }
        if(!creep.memory.maintaining && creep.carry.energy == creep.carryCapacity) {
            creep.memory.maintaining = true;
        }

        if(creep.memory.maintaining) {
            //TODO repair logic
            var targets = utilsRoom.getMyDamagedStructures(creep.room);
            if(targets.length) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                } 
            }
            else {
                targets = utilsRoom.getUnownedDamagedStructures(creep.room);
                if(targets.length) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    } 
                }
                else {
                    targets = utilsRoom.getConstructionSites(creep.room);
                    if(targets.length) {
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0]);
                        }
                    }
                }
            }
        }
        else {
            var sources = utilsRoom.getContainersAndStorages(creep.room);
            
            if(sources.length) {
                if(sources[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                else {
                    creep.say(decision);
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

module.exports = roleMaintainer;