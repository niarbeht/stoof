var utilsRoom = require('utils.room');

var sinkOffset = 0;

var roleDistributor = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //STATE TRANSITION
        roleDistributor.stateTransition(creep);

        //PERFORM ACTION
        roleDistributor.performAction(creep);
    },

    stateTransition: function(creep) {
        if (creep.memory.state == null || creep.memory.state == '') {
            //No state.  Must be a fresh spawn.  Get a source and get to work.
            //Get Source.
            //If we did get a source, switch state to 'FromSource'
            creep.memory.source = roleDistributor.getSource(creep.room);
            if(creep.memory.source != '') {
                creep.memory.state = 'FromSource';
            }
        }
        else if (creep.memory.state == 'FromSource') {
            //Get energy from a source container
            //Check to see if we have energy.
            //If we do, get a sink and switch to 'ToSink'
            //If we do not have energy,
            //Check if we have a legit source.  If we do...
            //check to see if the source is empty.
            //If the source IS empty, get a new source.
            if(creep.carry[RESOURCE_ENERGY] > 0) {
                //creep.memory.source = '';
                creep.memory.sink = roleDistributor.getSink(creep.room);
                var sink = Game.getObjectById(creep.memory.sink);
                if(sink != null) {
                    //We have a sink!
                    creep.memory.state = 'ToSink';
                }
            }
            else {
                //Check if we have a legitimate source.
                var source = Game.getObjectById(creep.memory.source);
                if(source != null) {
                    //legit source
                    if(source.store[RESOURCE_ENERGY] == 0) {
                        //Source is empty, get a new source.
                        creep.memory.source = roleDistributor.getSource(creep.room);
                    }
                }
            }
        }
        else if (creep.memory.state == 'ToSink') {
            //Take energy to the sink.
            //If we are empty, get a source and transition to 'FromSource'
            //If we have no sink, try to get a sink.
            //If we have a sink, check every tick if the sink is full
            //If the sink is full, get a new sink.

            if (creep.carry[RESOURCE_ENERGY] == 0) {
                //We are empty, get a source and transition to 'FromSource'
                creep.memory.source = roleDistributor.getSource(creep.room);
                if(creep.memory.source != '') {
                    //Successfully got a source
                    creep.memory.state = 'FromSource';
                }
            }
            else {
                var sink = Game.getObjectById(creep.memory.sink);
                if(sink == null) {
                    //We have no sink.  Try to get a sink.
                    creep.memory.sink = roleDistributor.getSink(creep.room);
                }
                else {
                    //Check if it's full.  If it is, get a new sink
                    if (((sink instanceof StructureSpawn || sink instanceof StructureExtension || sink instanceof StructureTower) &&
                        sink.energy == sink.energyCapacity) || 
                        ((sink instanceof StructureContainer || sink instanceof StructureStorage) &&
                        sink.store[RESOURCE_ENERGY] == sink.storeCapacity)) {
                        //Sink's full, call a plumber.
                        creep.memory.sink = roleDistributor.getSink(creep.room);
                    }
                }
            }
        }
    },

    performAction: function(creep) {
        var source = Game.getObjectById(creep.memory.source);
        var sink = Game.getObjectById(creep.memory.sink);
        if (creep.memory.state == 'FromSource') {
            //Get energy from a source container
            if(creep.pos.isNearTo(source)) {
                source.transfer(creep, RESOURCE_ENERGY);
            }
            else {
                creep.moveTo(source);
            }
        }
        else if (creep.memory.state == 'ToSink') {
            //Take energy to the sink.
            if(creep.pos.isNearTo(sink)) {
                creep.transfer(sink, RESOURCE_ENERGY);
            }
            else {
                creep.moveTo(sink);
            }
        }
    },

    getSource: function(room) {
        //Eligible sources:
        //1: The list of all (closest container or storage to each harvest source).
        //2: Dropped resources
        var retval = '';

        var sources = room.find(FIND_SOURCES);
        var sinks = [];

        //Get all closest container to each harvest source
        for (var i = 0; i < sources.length; i++) {
            sinks[i] = sources[i].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (o) => {
                    return (o instanceof StructureContainer);
                }
            });
        }

        //Pick highest source and filter for whether or not that source actually has energy.
        if(sinks.length > 0) {
            var bestIndex = 0;
            for(var i = 0; i < sinks.length; i++) {
                if(sinks[i].store[RESOURCE_ENERGY] > sinks[bestIndex].store[RESOURCE_ENERGY]) {
                    bestIndex = i;
                }
            }
            if(sinks[bestIndex].store[RESOURCE_ENERGY] > 0) {
                retval = sinks[bestIndex].id;
            }
        }

        //TODO dropped energy

        return retval;
    },

    getSink: function(room) {
        //Eligible sinks:
        //1: Extensions/spawns
        //2: Turrets
        //3: Upgrader Container
        //4: All other containers/storages
        var retval = '';

        var sources = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });

        if(sources.length > 0) {
            //We have a spawn or extension.
            retval = sources[(sinkOffset + Game.time) % sources.length].id;
            sinkOffset++;
        }
        else {
            //Try turrets
            var towers = room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure instanceof StructureTower) && (structure.energy < structure.energyCapacity);
                }
            });

            if(towers.length > 0) {
                //We have turrets
                retval = towers[(sinkOffset + Game.time) % towers.length].id;
                sinkOffset++;
            }
            else {
                //Find the upgrader container
                var upgraderSource = room.controller.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (o) => {
                        return (o instanceof StructureContainer);
                    }
                });

                if(upgraderSource.store[RESOURCE_ENERGY] < upgraderSource.storeCapacity) {
                    retval = upgraderSource.id;
                }
                else {
                    //All containers/storages not in (upgrader container or harvester sinks)
                    sources = room.find(FIND_SOURCES);
                    var invalidSources = [];
                    var validSources = [];
                    var allSources = [];

                    //Generate harvester sinks
                    for (var src in sources) {
                        invalidSources.push(sources[src].pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (o) => {
                                return (o instanceof StructureContainer);
                            }
                        }));
                    }

                    invalidSources.push(upgraderSource);

                    var allSources = room.find(FIND_STRUCTURES, {
                        filter: (o) => {
                            return (o instanceof StructureContainer || o instanceof StructureStorage) &&
                            o.store[RESOURCE_ENERGY] > 0;
                        }
                    });

                    validSources = _.difference(allSources, invalidSources);

                    if(validSources.length > 0) {
                        retval = validSources[(sinkOffset + Game.time) % validSources.length].id;
                        ++sinkOffset;
                    }
                }
            }
        }

        return retval;
    }

    // loadBalance: function(room) {
    //     var distributors = _.filter(Game.creeps, function (creep) { return creep.memory.role == "distributor" && creep.room == room; });
    //     var sources = utilsRoom.getAllSources(room);
    //     var sinks = [];

    //     //Generate sinks mapping
    //     for (var src in sources) {
    //         sinks[sources[src]] = sources[src].pos.findClosestByRange(FIND_STRUCTURES, {
    //             filter: (o) => {
    //                 return (o instanceof StructureContainer);
    //             }
    //         });
    //     }

    //     for(var i = 0; i < distributors.length; i++) {
    //         var source = sources[i % sources.length];
    //         distributors[i].memory.source = sinks[source].id;
    //     }
    // }
};

module.exports = roleDistributor;