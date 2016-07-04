var utilsRoom = require('utils.room');
var roleTurret = {

    /** @param {StructureTower} tower **/
    run: function(tower) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (c) => {
                        return (Memory.friends.indexOf(c.owner.username) == -1); //TODO FIXME THIS IS AWFUL
                    }
        });
        if(target && (tower.attack(target) == OK)) {
            //Yay, murder!
        }
        else {
            //Try the healz?
            target = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (creep) => {
                    return creep.hits < creep.hitsMax;
                }
            });

            if(target && (tower.heal(target) == OK)) {
                //Yay, anti-murder!
            }
            else {
                var targets = utilsRoom.getMyDamagedStructures(tower.room);
                if(targets.length && tower.repair(targets[0]) == OK) {
                    //Yay, anti-murder!
                }
                else {
                    var targets = utilsRoom.getUnownedDamagedStructures(tower.room);
                    if(targets.length && tower.repair(targets[0]) == OK) {
                        //Yay, anti-murder!
                    }
                }
            }
        }
    }
};

module.exports = roleTurret;