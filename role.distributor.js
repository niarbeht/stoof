var utilsRoom = require('utils.room');
var roleDistributor = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0) {
            var sources = utilsRoom.getNonEmptyContainersAndStorages(creep.room);
            
            if(sources.length) {
                if(sources[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
            else {
                //Get out the way!
            }
        }
        else {
            var sinks = utilsRoom.getSpawnOrExtension(creep.room);

            if(creep.transfer(sinks[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sinks[0]);
            }
        }
    }
};

module.exports = roleDistributor;