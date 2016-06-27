var utils = {

    /** @param {int} newTarget **/
    changeAllHarvestTargets: function(target) {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester' ||
                creep.memory.role == 'upgrader' ||
                creep.memory.role == 'builder') {
                creep.memory.harvestTarget = target;
            }
        }
    },

    /** @param {int} target, {Room} room, {String} role **/
    changeSelectHarvestTargets: function(target, room = 0, role = 0) {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if ((((role == 0 &&
                (creep.memory.role == 'harvester' || creep.memory.role == 'upgrader' || creep.memory.role == 'builder' || creep.memory.role == 'maintainer'))) ||
                creep.memory.role == role) &&
                (room == 0 || room == creep.room)
                ) {
                creep.memory.harvestTarget = target;
            }
        }
    },

    cleanOldCreeps: function() {
        //Clean out memory
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    },

    changeRoles: function(a, b) {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == a) {
                creep.memory.role = b;
            }
        }
    },

    avgCPU: function() {
        var j = 0;
        for (var i = 0; i < Memory.cpuBuf.length; i++) {
            j += Memory.cpuBuf[i]
        }
        j /= Memory.cpuBuf.length;
        console.log("Average CPU " + j);
    }
};

module.exports.utils = utils;