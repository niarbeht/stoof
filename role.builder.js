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
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            else {
                //TODO repair logic
                targets = creep.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax});
                if(targets.length) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    } 
                }
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
                //var decision = creep.transfer(sources[0], RESOURCE_ENERGY, creep.carryCapacity);
                var decision = sources[0].transfer(creep, RESOURCE_ENERGY); 
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
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;