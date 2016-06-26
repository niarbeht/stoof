var utilsRoom = require('utils.room');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
                var src = Game.getObjectByID(creep.memory.source);
                if(creep.harvest(src) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(src);
                }
        }
        else {
            var sink = Game.getObjectByID(creep.memory.sink);

            if(creep.transfer(sink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sink);
            }
        }
    }
};

module.exports = roleHarvester;