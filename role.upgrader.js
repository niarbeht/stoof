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
            var sources = creep.room.find(FIND_STRUCTURES,
                function(o) {
                    return (o instanceof StructureContainer ||
                    o instanceof StructureExtension ||
                    o instanceof StructureSpawn ||
                    o instanceof StructureStorage) &&
                    (o.store[RESOURCE_ENERGY] > (source.storeCapacity >> 1))
                });
            
            if(sources.length) {
                if(creep.transfer(sources[0], RESOURCE_ENERGY, creep.carryCapacity) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
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