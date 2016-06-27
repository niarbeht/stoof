var spawnsAndExtensions_LT = [];
var spawnsAndExtensions = [];

var constructionSites_LT = [];
var constructionSites = [];

var myDamagedStructures_LT = [];
var myDamagedStructures = [];

var unownedDamagedStructures_LT = [];
var unownedDamagedStructures = [];

var containersAndStorages_LT = [];
var containersAndStorages = [];

var unfilledContainersAndStorages_LT = [];
var unfilledContainersAndStorages = [];

var nonEmptyContainersAndStorages_LT = [];
var nonEmptyContainersAndStorages = [];

var allSources_LT = [];
var allSources = [];

var sourcesNonEmpty_LT = [];
var sourcesNonEmpty = [];

var utilsRoom = {
    /**
     * @param {Room} room The room to grab stuff for.
     * @returns List of spawns or extensions in the room whose energy is not full
     */
    generateSpawnExtensionList: function(room) {
        spawnsAndExtensions[room] = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
        spawnsAndExtensions_LT[room] = Game.time;
    },

    /**
     * @param room The room to grab stuff for.
     * @returns List of spawns or extensions in the room whose energy is not full
     */
    getSpawnOrExtension: function(room) {
        if (spawnsAndExtensions_LT[room] == Game.time) {
            return spawnsAndExtensions[room];
        }
        else {
            utilsRoom.generateSpawnExtensionList(room);
            return spawnsAndExtensions[room];
        }
    },

    generateConstructionSites: function(room) {
        constructionSites[room] = room.find(FIND_CONSTRUCTION_SITES);
        constructionSites_LT[room] = Game.time;
    },

    getConstructionSites: function(room) {
        if (constructionSites_LT[room] == Game.time) {
            return constructionSites[room];
        }
        else {
            utilsRoom.generateConstructionSites(room);
            return constructionSites[room];
        }
    },

    generateMyDamagedStructures: function(room) {
        myDamagedStructures[room] = room.find(FIND_MY_STRUCTURES, {filter: (structure) => {
                return (structure.hits < structure.hitsMax);
            }
        });
        myDamagedStructures_LT[room] = Game.time;
    },

    getMyDamagedStructures: function(room) {
        if (myDamagedStructures_LT[room] == Game.time) {
            return myDamagedStructures[room];
        }
        else {
            utilsRoom.generateMyDamagedStructures(room);
            return myDamagedStructures[room];
        }
    },

    generateUnownedDamagedStructures: function(room) {
        unownedDamagedStructures[room] = room.find(FIND_STRUCTURES, {filter: (structure) => {
                if (!(structure instanceof OwnedStructure)) {
                    if (structure instanceof StructureWall ) {
                        return structure.hits < 50000;
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
        unownedDamagedStructures_LT[room] = Game.time;
    },

    getUnownedDamagedStructures: function(room) {
        if (unownedDamagedStructures_LT[room] == Game.time) {
            return unownedDamagedStructures[room];
        }
        else {
            utilsRoom.generateUnownedDamagedStructures(room);
            return unownedDamagedStructures[room];
        }
    },

    generateContainersAndStorages: function(room) {
        containersAndStorages[room] = room.find(FIND_STRUCTURES, {
                filter: (o) => {
                    return (o instanceof StructureContainer ||
                        o instanceof StructureStorage) &&
                        (o.store[RESOURCE_ENERGY] > (o.storeCapacity >> 2))
                }
            });
        containersAndStorages_LT[room] = Game.time;
    },

    getContainersAndStorages: function(room) {
        if(containersAndStorages_LT[room] == Game.time) {
            return containersAndStorages[room];
        }
        else {
            utilsRoom.generateContainersAndStorages(room);
            return containersAndStorages[room];
        }
    },

    generateUnfilledContainersAndStorages: function(room) {
        unfilledContainersAndStorages[room] = room.find(FIND_STRUCTURES, {
                filter: (o) => {
                    return (o instanceof StructureContainer ||
                        o instanceof StructureStorage) &&
                        (o.store[RESOURCE_ENERGY] < (o.storeCapacity))
                }
            });
        unfilledContainersAndStorages_LT[room] = Game.time;
    },

    getUnfilledContainersAndStorages: function(room) {
        if(unfilledContainersAndStorages_LT[room]) {
            return unfilledContainersAndStorages[room];
        }
        else {
            utilsRoom.generateUnfilledContainersAndStorages(room);
            return unfilledContainersAndStorages[room];
        }
    },

    generateNonEmptyContainersAndStorages: function(room) {
        nonEmptyContainersAndStorages[room] = room.find(FIND_STRUCTURES, {
                filter: (o) => {
                    return (o instanceof StructureContainer ||
                        o instanceof StructureStorage) &&
                        (o.store[RESOURCE_ENERGY] != 0)
                }
            });
        nonEmptyContainersAndStorages_LT[room] = Game.time;
    },

    getNonEmptyContainersAndStorages: function(room) {
        if(nonEmptyContainersAndStorages_LT[room]) {
            return nonEmptyContainersAndStorages[room];
        }
        else {
            utilsRoom.generateNonEmptyContainersAndStorages(room);
            return nonEmptyContainersAndStorages[room];
        }
    },

    generateAllSources: function(room) {
        allSources[room] = room.find(FIND_SOURCES);
        allSources_LT[room] = Game.time;
    },

    getAllSources: function(room) {
        if(allSources_LT[room] == Game.time) {
            return allSources[room];
        }
        else {
            utilsRoom.generateAllSources(room);
            return allSources[room];
        }
    },

    generateSourcesNonEmpty: function(room) {
        sourcesNonEmpty[room] = room.find(FIND_SOURCES, {
            filter: (s) => {
                return s.energy > 0;
            }
        });
        sourcesNonEmpty_LT[room] = Game.time;
    },

    getSourcesNonEmpty: function(room) {
        if(sourcesNonEmpty_LT[room] == Game.time) {
            return sourcesNonEmpty[room];
        }
        else {
            utilsRoom.generateSourcesNonEmpty(room);
            return sourcesNonEmpty[room];
        }
    }
};

module.exports = utilsRoom;