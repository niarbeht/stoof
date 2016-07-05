var utilsRoom = require('utils.room');

var sourceOffset = 0;
var targetOffset = 0;

var roleWorker = {
    /** @param {Creep} creep **/
    run: function(creep) {
        //STATE TRANSISION
        roleWorker.stateTransition(creep);

        var source = Game.getObjectById(creep.memory.source); 
        var target = Game.getObjectById(creep.memory.target);

        //ACTION
        roleWorker.performAction(creep, source, target);
    },

    stateTransition: function(creep) {
        if(creep.memory.state == null || creep.memory.state == '') {
            //We have no state.  We were probably just created.
            //Get a source.
            creep.memory.source = roleWorker.getSource(creep.room);

            //If there's a source available, switch to GetEnergy.
            if(creep.memory.source != null && creep.memory.source != '') {
                creep.memory.state = 'GetEnergy';
            }
        }
        else if (creep.memory.state == 'GetEnergy') {
            //Check if we're no longer empty.
            if(creep.carry[RESOURCE_ENERGY] > 0) {
                //If we don't already have a target, get a target
                if(creep.memory.target == null || creep.memory.target == '') {
                    //Get target
                    creep.memory.target = roleWorker.getTarget(creep.room);
                }
                if(creep.memory.target != null && creep.memory.target != '') {
                    //If there is a target available, switch to 'DoWork'
                    creep.memory.state = 'DoWork';
                }
                else {
                    //If no targets available, switch to 'Idle'
                    creep.memory.state = 'Idle';
                }
            }
            else {
                //Check if our source still has energy
                //If not, get a new source
                if (typeof source == 'undefined' || source == null || source.store[RESOURCE_ENERGY] == 0) {
                    creep.memory.source = roleWorker.getSource(creep.room);
                }
            }
        }
        else if (creep.memory.state == 'DoWork') {
            //Check to see if we're empty or if work is complete
            //If we're empty or work is complete, get a source, switch to 'GetEnergy'.
            //If there are no sources, switch to 'idle'
            //If work is not complete and we have energy, stay in 'DoWork'
            
            var target = Game.getObjectById(creep.memory.target);
            if (typeof target != 'undefined' && target != null) {
                //Check to see if the target is done.
                
                if (!(target instanceof ConstructionSite) && (
                ((target instanceof StructureWall || target instanceof StructureRampart) && target.hits >= 100000) ||
                (target instanceof Structure && !(target instanceof StructureWall || target instanceof StructureController || target instanceof StructureRampart) && target.hits == target.hitsMax))) {
                    //STRUCTURE IS DONE HOORAY.
                    if(creep.carry[RESOURCE_ENERGY] > 0) {
                        // Find new work
                        creep.memory.target = roleWorker.getTarget(creep.room);
                        //Stay in DoWork
                    }
                    else {
                        // Find source
                        creep.memory.source = roleWorker.getSource(creep.room);
                        //Switch to GetEnergy
                        creep.memory.state = 'GetEnergy';
                    }
                }
                else {
                    //Not done.
                    if(creep.carry[RESOURCE_ENERGY] == 0) {
                        //Out of energy.
                        creep.memory.state = 'GetEnergy';
                    }
                }
            }
            else { //Old target is gone, get a new target.
                creep.memory.target = roleWorker.getTarget(creep.room);
            }
        }
        else if (creep.memory.state == 'Idle') {
            //TODO Check to see if there's a source available.
            //TODO If so, grab it and switch to 'GetEnergy'
            //otherwise, stay idle
        }
    },

    performAction: function(creep, source, target) {
        if (creep.memory.state == 'GetEnergy') {
            //If we aren't able to get any energy
            if(creep.pos.isNearTo(source)) {
                source.transfer(creep, RESOURCE_ENERGY);
            }
            else {
                creep.moveTo(source);
            }
        } else if (creep.memory.state == 'DoWork') {
            //Are we in range of our work target?
            if(creep.pos.inRangeTo(target, 3)) { //I think 3 is the range for building
                //What kind of target is it?  That determines if we repair or build
                //Perform appropriate action on target.
                if(target instanceof ConstructionSite) {
                    //Build it
                    creep.build(target);
                }
                else if(((target instanceof StructureWall || target instanceof StructureRampart) && target.hits < 100000) ||
                (target instanceof Structure && !(target instanceof StructureWall || target instanceof StructureController || target instanceof StructureRampart) && target.hits < target.hitsMax)) {
                    //Repair it
                    creep.repair(target);
                }
                else {
                    //LOG TARGET TO CONSOLE we fucked up.
                    console.log('Bad worker target:');
                    console.log(JSON.stringify(target));
                }
            }
            else {
                //If not in range, move towards it.            
                creep.moveTo(target);
            }
        } else if (creep.memory.state == 'Idle') {
            //Go to the idle flag.
            var staging = creep.room.find(FIND_FLAGS, {
                filter: (f) => {
                    return (f.color == COLOR_GREEN);
                }
            });
            if(staging.length) {
                creep.moveTo(staging[0]);
            }
        }
    },

    /**
     * @param {Room} room The room to look for stuff in.
     * @returns {String} A string object ID of a container or storage with energy > 0.  This container or storage is not a harvester sink or upgrade source.  Returns empty string if nothing is available.
     */
    getSource: function(room) {
        //Sources are:
        //Containers that are NOT in harvester sinks
        //Containers that are NOT in upgrader sources
        //All storages
        //All sources must have more than zero energy
        var sources = room.find(FIND_SOURCES);
        var invalidSources = [];
        var validSources = [];
        var allSources = [];
        var id = '';

        //Generate harvester sinks
        for (var src in sources) {
            invalidSources.push(sources[src].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (o) => {
                    return (o instanceof StructureContainer);
                }
            }));
        }

        //Generate upgrader source
        var upgraderSource = room.controller.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (o) => {
                return (o instanceof StructureContainer);
            }
        });

        invalidSources.push(upgraderSource);

        var allSources = room.find(FIND_STRUCTURES, {
            filter: (o) => {
                return (o instanceof StructureContainer || o instanceof StructureStorage) &&
                o.store[RESOURCE_ENERGY] > 0;
            }
        });

        validSources = _.difference(allSources, invalidSources);

        if(validSources.length > 0) {
            id = validSources[sourceOffset % validSources.length].id;
            ++sourceOffset;
        }

        return id;
    },

    /**
     * Returns empty-string if no targets available.
     */
    getTarget: function(room) {
        //1: Try to find a build target.
        //if that returns empty-string,
        //2: Try to find a repair target
        //if that returns empty-string,
        //3: Return empty-string.
        var targets = [];
        var retval = '';

        targets = room.find(FIND_CONSTRUCTION_SITES);

        if(targets.length > 0) {
            retval = targets[targetOffset % targets.length].id;
            ++targetOffset;
        }
        else {
            targets = room.find(FIND_MY_STRUCTURES, {filter: (structure) => {
                    return (structure.hits < structure.hitsMax) && (structure.hits < 100000);
                }
            });
            if(targets.length > 0) {
                retval = targets[targetOffset % targets.length].id;
                ++targetOffset;
            }
            else {
                targets = room.find(FIND_STRUCTURES, {filter: (structure) => {
                        if (!(structure instanceof OwnedStructure)) {
                            if (structure instanceof StructureWall ) {
                                return structure.hits < 100000;
                            }
                            else {
                                return structure.hits < structure.hitsMax;
                            }
                        }
                        else {
                            return false;
                        }
                    }
                });
                if(targets.length > 0) {
                    retval = targets[targetOffset % targets.length].id;
                    ++targetOffset;
                }
            }
        }

        return retval;
    }
};

module.exports = roleWorker;