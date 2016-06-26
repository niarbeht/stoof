var spawnsAndExtensions_LT = [];
var spawnsAndExtensions = [];
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
            generateSpawnExtensionList(room);
            spawnsAndExtensions_LT[room] = Game.time;
            return spawnsAndExtensions[room];
        }
    }
};

module.exports = utilsRoom;