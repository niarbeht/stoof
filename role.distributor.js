var utilsRoom = require('utils.room');

var roleDistributor = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if("" == creep.memory.source) {
            console.log("Performing distributor load balance.");
            roleDistributor.loadBalance(creep.room);
        }
        if(creep.carry.energy == 0) {
            var source = Game.getObjectById(creep.memory.source);

            if(source.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {
            var sinks = utilsRoom.getSpawnOrExtension(creep.room);

            if(creep.transfer(sinks[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sinks[0]);
            }
        }
    },

    loadBalance: function(room) {
        var distributors = _.filter(Game.creeps, function (creep) { return creep.memory.role == "distributor" && creep.room == room; });
        var sources = utilsRoom.getAllSources(room);
        var sinks = [];

        //Generate sinks mapping
        for (var src in sources) {
            sinks[sources[src]] = sources[src].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (o) => {
                    return (o instanceof StructureContainer ||
                        o instanceof StructureStorage);
                }
            });
        }

        for(var i = 0; i < distributors.length; i++) {
            var source = sources[i % sources.length];
            distributors[i].memory.source = sinks[source].id;
        }
    }
};

module.exports = roleDistributor;