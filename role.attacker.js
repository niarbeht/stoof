var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (c) => {
                        return (Memory.friends.indexOf(c.owner.username) == -1); //TODO FIXME THIS IS AWFUL
                    }
        });
        
        if(target) {

            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                if(creep.moveTo(target) == ERR_NO_PATH) {
                    //Try structures.

                    target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                        filter: (c) => {
                                    return (Memory.friends.indexOf(c.owner.username) == -1); //TODO FIXME THIS IS AWFUL
                                }
                    });
                    
                    if(target) {
                        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                            if(creep.moveTo(target) == ERR_NO_PATH) {
                            }
                        }
                    }
                }
            }
        }
        else {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                filter: (c) => {
                            return (Memory.friends.indexOf(c.owner.username) == -1); //TODO FIXME THIS IS AWFUL
                        }
            });
                    
            if(target) {
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    if(creep.moveTo(target) == ERR_NO_PATH) {
                    }
                }
            }
            else {
                //Move to rally flag
                //FIND_FLAGS
                var rally = Game.flags['rally'];
                creep.moveTo(rally);
            }
        }
    }
};

module.exports = roleAttacker;