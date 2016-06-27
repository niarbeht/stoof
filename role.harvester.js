var utilsRoom = require('utils.room');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(("" == creep.memory.source) || ("" == creep.memory.sink)) {
            console.log("Performing harvester load balance.");
            roleHarvester.loadBalance(creep.room);
        }
        if(creep.carry.energy < creep.carryCapacity) {
            var src = Game.getObjectById(creep.memory.source);
            if(creep.harvest(src) == ERR_NOT_IN_RANGE) {
                creep.moveTo(src); //reusePath 500 holds the path for a long time.
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
    },

    /**
     * Load balances the harvesters in a room.
     */
    loadBalance: function(room) {
        var harvesters = _.filter(Game.creeps, function (creep) { return creep.memory.role == "harvester" && creep.room == room; });
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

        for(var i = 0; i < harvesters.length; i++) {
            var source = sources[i % sources.length];
            harvesters[i].memory.source = source.id;
            harvesters[i].memory.sink = sinks[source].id;
        }
    }
};

module.exports = roleHarvester;