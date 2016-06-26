var roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else {
            //Move to staging flag
            //FIND_FLAGS
            var staging = creep.room.find(FIND_FLAGS, {
                filter: (f) => {
                    return (f.color == COLOR_BLUE)
                    }
            });
            if(staging.length) {
                creep.moveTo(staging[0]);
            }
        }
    }
};

module.exports = roleDefender;