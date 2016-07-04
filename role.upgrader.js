var utilsRoom = require('utils.room');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.source == '' || creep.memory.source == null) {
            console.log("Performing upgrader load-balance.")
            roleUpgrader.loadBalance(creep.room);
        }

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
            var source = Game.getObjectById(creep.memory.source);
            
            if(source.store[RESOURCE_ENERGY] > (source.storeCapacity >> 1)) {
                if(source.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            else {
                //Move to staging flag
                //FIND_FLAGS
                var staging = creep.room.find(FIND_FLAGS, {
                    filter: (f) => {
                        return (f.color == COLOR_GREEN)
                        }
                });
                if(staging.length) {
                    creep.moveTo(staging[0]);
                }
            }
        }
    },
    
    loadBalance: function(room) {
        var upgraders = _.filter(Game.creeps, function (creep) { return creep.memory.role == "upgrader" && creep.room == room; });
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

        for(var i = 0; i < upgraders.length; i++) {
            var source = sources[i % sources.length];
            upgraders[i].memory.source = sinks[source].id;
        }
    }
};

module.exports = roleUpgrader;