var utilsRoom = require('utils.room');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
            var targets = utilsRoom.getConstructionSites(creep.room);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                //TODO repair logic
                targets = utilsRoom.getMyDamagedStructures(creep.room);
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
                sources = utilsRoom.getAllSources(creep.room);
                if(sources.length) {
                    if(creep.harvest(sources[creep.memory.harvestTarget]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[creep.memory.harvestTarget]);
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;