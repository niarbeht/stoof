var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var numHarvesters = 0;
var numBuilders = 0;
var numUpgraders = 0;
var desiredHarvesters = 3;
var desiredBuilders = 5;
var desiredUpgraders = 1;

module.exports.loop = function () {

    //Clean out memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

/*
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
*/
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            numHarvesters += 1;
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            numUpgraders += 1;
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            numBuilders += 1;
        }
    }

    if(Game.spawns.Origin.spawning == null) {
        if(numHarvesters < desiredHarvesters) {
            var harvesterLoadout = [WORK, CARRY, CARRY, MOVE,MOVE];
            if(Game.spawns.Origin.canCreateCreep(harvesterLoadout) == OK) {
                var newName = Game.spawns.Origin.createCreep(harvesterLoadout, undefined, {role: 'harvester'});
                switch(newName) {
                    case ERR_NOT_ENOUGH_ENERGY:
                        console.log('Insufficient energy to spawn harvester');
                        break;
                    default:
                        console.log('Spawning new harvester: ' + newName);
                }
            }
        }

        if(numUpgraders < desiredUpgraders) {
            var upgraderLoadout = [WORK, CARRY, CARRY, MOVE,MOVE];
            if(Game.spawns.Origin.canCreateCreep(upgraderLoadout) == OK) {
                var newName = Game.spawns.Origin.createCreep(upgraderLoadout, undefined, {role: 'upgrader'});
                switch(newName) {
                    case ERR_NOT_ENOUGH_ENERGY:
                        console.log('Insufficient energy to spawn upgrader');
                        break;
                    default:
                        console.log('Spawning new upgrader: ' + newName);
                }
            }
        }

        if(numBuilders < desiredBuilders) {
            var builderLoadout = [WORK, CARRY, CARRY, MOVE,MOVE];
            if(Game.spawns.Origin.canCreateCreep(builderLoadout) == OK) {
                var newName = Game.spawns.Origin.createCreep(builderLoadout, undefined, {role: 'builder'});
                switch(newName) {
                    case ERR_NOT_ENOUGH_ENERGY:
                        console.log('Insufficient energy to spawn builder');
                        break;
                    default:
                        console.log('Spawning new builder: ' + newName);
                }
            }
        }
    }
    numHarvesters = 0;
    numBuilders = 0;
    numUpgraders = 0;
}