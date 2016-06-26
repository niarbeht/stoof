var utilsRoom = require('utils.room');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var src = Game.getObjectById(creep.memory.source);
            if(creep.harvest(src) == ERR_NOT_IN_RANGE) {
                creep.moveTo(src);
            }
            var sink = Game.getObjectById(creep.memory.sink);

            creep.transfer(sink, RESOURCE_ENERGY)
        }
        else {
            var sink = Game.getObjectById(creep.memory.sink);

            if(creep.transfer(sink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sink);
            }
        }
    }
};

module.exports = roleHarvester;