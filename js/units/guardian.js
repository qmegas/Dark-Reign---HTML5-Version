function GuardianUnit(pos_x, pos_y, player)
{
	this._proto = GuardianUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(GuardianUnit);

GuardianUnit.obj_name = 'Guardian';
GuardianUnit.resource_key = 'guardian';
GuardianUnit.die_effect = 'splata_explosion';
GuardianUnit.images = {
	selection: {
		size: {x: 26, y: 26},
		padding: {x: 1, y: 1}
	},
	stand: {
		size: {x: 26, y: 26},
		padding: {x: 1, y: 1}
	},
	move: {
		size: {x: 26, y: 26},
		padding: {x: 1, y: 1},
		frames: 6
	},
	attack: {
		size: {x: 26, y: 26},
		padding: {x: 1, y: 1},
		frames: 2
	},
	shadow: {
		stand: {
			size: {x: 19, y: 8},
			padding: {x: -7, y: -14},
			static_img: true
		},
		move: {
			size: {x: 19, y: 8},
			padding: {x: -7, y: -14},
			static_img: true
		},
		attack: {
			size: {x: 19, y: 8},
			padding: {x: -7, y: -14},
			static_img: true
		}
	}
};
GuardianUnit.select_sounds = ['gvig1sl0', 'gvig1sl1', 'gvig1sl2', 'gvig1sl3'];
GuardianUnit.response_sounds = ['gvig1rl0', 'gvig1rl1', 'gvig1rl2', 'gvig1rl6'];

GuardianUnit.cost = 150;
GuardianUnit.health_max = 100;
GuardianUnit.weapon = LaserRifleWeapon;
GuardianUnit.is_human = true;
GuardianUnit.shield_type = 'PowerHumanWet';

GuardianUnit.require_building = [TrainingFacilityBuilding];

GuardianUnit.construction_building = [TrainingFacilityBuilding, TrainingFacility2Building];
GuardianUnit.construction_time = 4;