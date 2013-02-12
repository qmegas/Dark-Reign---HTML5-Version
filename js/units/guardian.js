function GuardianUnit(pos_x, pos_y, player)
{
	this._proto = GuardianUnit;
	this.player = player;
	
	this.health = 5;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(GuardianUnit);

GuardianUnit.obj_name = 'Guardian';
GuardianUnit.resource_key = 'guardian';
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
		padding: {x: 1, y: 1}
	},
	attack: {
		size: {x: 26, y: 26},
		padding: {x: 1, y: 1}
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

GuardianUnit.cost = 150;
GuardianUnit.health_max = 5;
GuardianUnit.speed = 1.371;
GuardianUnit.weapon = LaserRifleWeapon;
GuardianUnit.is_human = true;

GuardianUnit.require_building = [TrainingFacilityBuilding];

GuardianUnit.construction_building = [TrainingFacilityBuilding, TrainingFacility2Building];
GuardianUnit.construction_time = 4;