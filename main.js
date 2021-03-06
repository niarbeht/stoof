//NOTE any variables you want to preserve between ticks needs to be in "memory"
//TODO make a "friends list" in memory

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var roleMaintainer = require('role.maintainer');
var roleDistributor = require('role.distributor');
var roleAttacker = require('role.attacker');
var roleTurret = require('role.turret');
var numHarvesters = 0;
var desiredHarvesters = 4;
var numBuilders = 0;
var desiredBuilders = 8;
var numUpgraders = 0;
var desiredUpgraders = 4;
var numDistributors = 0;
var desiredDistributors = 4;
var numMaintainers = 0;
var desiredMaintainers = 4;
var numDefenders = 0;
var desiredDefenders = 16;

module.exports.loop = function () {
//TODO add round-robin GC

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

        if(creep.ticksToLive == 1) {
            creep.suicide();
            delete Memory.creeps[name];
        }
        else {
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
                numHarvesters += 1;
            } else if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
                numUpgraders += 1;
            } else if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
                numBuilders += 1;
            } else if(creep.memory.role == 'maintainer') {
                roleMaintainer.run(creep);
                numMaintainers += 1;
            } else if(creep.memory.role == 'distributor') {
                roleDistributor.run(creep);
                numDistributors += 1;
            } else if(creep.memory.role == 'defender') {
                roleDefender.run(creep);
                numDefenders += 1;
            } else if(creep.memory.role == 'attacker') {
                roleAttacker.run(creep);
            }
        }
    }

    var turrets = _.filter(Game.structures, function (structure) { return structure instanceof StructureTower; });
    for(var t in turrets) {
        roleTurret.run(turrets[t]);
    }

    console.log(numHarvesters + ' Harvesters, ' + numUpgraders + ' Upgraders, ' + numBuilders + ' Builders, ' + numMaintainers + ' Maintainers, ' + numDefenders + ' Defenders, ' + numDistributors + ' Distributors');

    if (Game.spawns.Spawn1.spawning == null) {
        if (numHarvesters < desiredHarvesters) {
            var harvesterLoadout = [MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY];
            if(Game.spawns.Spawn1.canCreateCreep(harvesterLoadout) == OK) {
                var newName = Game.spawns.Spawn1.createCreep(harvesterLoadout, 'harvester.' + Game.time, {role: 'harvester', source: '', sink: ''}); //or 55db32ccefa8e3fe66e0542a 
                switch(newName) {
                    case ERR_NOT_ENOUGH_ENERGY:
                        console.log('Insufficient energy to spawn harvester');
                        break;
                    case ERR_INVALID_ARGS:
                        console.log('Invalid arguments on harvester creation.');
                        break;
                    default:
                        console.log('Spawning new harvester: ' + newName);
                }
            }
        } else if (numDistributors < desiredDistributors) {
            var distributorLoadout = [MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY];
            if(Game.spawns.Spawn1.canCreateCreep(distributorLoadout) == OK) {
                var newName = Game.spawns.Spawn1.createCreep(distributorLoadout, 'distributor.' + Game.time, {role: 'distributor', source: ''});
                switch(newName) {
                    case ERR_NOT_ENOUGH_ENERGY:
                        console.log('Insufficient energy to spawn distributor');
                        break;
                    default:
                        console.log('Spawning new distributor: ' + newName);
                }
            }
        } else if (numUpgraders < desiredUpgraders) {
            var upgraderLoadout = [MOVE,MOVE,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY];
            if(Game.spawns.Spawn1.canCreateCreep(upgraderLoadout) == OK) {
                var newName = Game.spawns.Spawn1.createCreep(upgraderLoadout, 'upgrader.' + Game.time, {role: 'upgrader'});
                switch(newName) {
                    case ERR_NOT_ENOUGH_ENERGY:
                        console.log('Insufficient energy to spawn upgrader');
                        break;
                    default:
                        console.log('Spawning new upgrader: ' + newName);
                }
            }
        } else if (numBuilders < desiredBuilders) {
            var builderLoadout = [MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY];
            if(Game.spawns.Spawn1.canCreateCreep(builderLoadout) == OK) {
                var newName = Game.spawns.Spawn1.createCreep(builderLoadout, 'builder.' + Game.time, {role: 'builder'});
                switch(newName) {
                    case ERR_NOT_ENOUGH_ENERGY:
                        console.log('Insufficient energy to spawn builder');
                        break;
                    default:
                        console.log('Spawning new builder: ' + newName);
                }
            }
        } else if (numMaintainers < desiredMaintainers) {
            var maintainerLoadout = [MOVE,MOVE,WORK,CARRY];
            if(Game.spawns.Spawn1.canCreateCreep(maintainerLoadout) == OK) {
                var newName = Game.spawns.Spawn1.createCreep(maintainerLoadout, 'maintainer.' + Game.time, {role: 'maintainer'});
                switch(newName) {
                    case ERR_NOT_ENOUGH_ENERGY:
                        console.log('Insufficient energy to spawn maintainer');
                        break;
                    default:
                        console.log('Spawning new maintainer: ' + newName);
                }
            }
        } else if (numDefenders < desiredDefenders) {
            //Build defenders
            var defenderLoadout = [TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,MOVE,ATTACK,MOVE,ATTACK];
            if(Game.spawns.Spawn1.canCreateCreep(defenderLoadout) == OK) {
                var newName = Game.spawns.Spawn1.createCreep(defenderLoadout, 'defender.' + Game.time, {role: 'defender'});
                switch(newName) {
                case ERR_NOT_ENOUGH_ENERGY:
                    console.log('Insufficient energy to spawn defender');
                    break;
                default:
                    console.log('Spawning new defender: ' + newName);
                }
            }
        } else {
            //Build attackers
            var attackerLoadout = [TOUGH,MOVE,ATTACK,MOVE];
            if(Game.spawns.Spawn1.canCreateCreep(attackerLoadout) == OK) {
                var newName = Game.spawns.Spawn1.createCreep(attackerLoadout, 'attacker.' + Game.time, {role: 'attacker'});
                switch(newName) {
                case ERR_NOT_ENOUGH_ENERGY:
                    console.log('Insufficient energy to spawn attacker');
                    break;
                default:
                    console.log('Spawning new attacker: ' + newName);
                }
            }
        }
    }
    
    numHarvesters = 0;
    numBuilders = 0;
    numUpgraders = 0;
    numMaintainers = 0;
    numDistributors = 0;
    numDefenders = 0;
    Memory.cpuBuf[Game.time % 100] = Game.cpu.getUsed();
}