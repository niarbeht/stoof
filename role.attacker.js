var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (c) => {
                        return !(Memory.friends.indexOf(c.owner) > -1); //TODO FIXME THIS IS AWFUL
                    }
        });
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else {
            //Move to rally flag
            //FIND_FLAGS
            var rally = Game.flags['rally'];
            creep.moveTo(rally);
        }
    }
};

module.exports = roleAttacker;