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
            var sources = creep.room.find(FIND_STRUCTURES, {
                filter: (o) => {
                    return (o instanceof StructureContainer ||
                        o instanceof StructureStorage) &&
                        (o.store[RESOURCE_ENERGY] > (o.storeCapacity >> 1))
                    }
                });
            
            if(sources.length) {
                var decision = creep.transfer(sources[0], RESOURCE_ENERGY, creep.carryCapacity); 
                if(decision == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                else {
                    creep.say(decision);
                }
            }
            else {
                sources = creep.room.find(FIND_SOURCES);
                if(sources.length) {
                    if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1]);
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;