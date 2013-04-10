function BionUnit(pos_x, pos_y, player)
{
	this._proto = BionUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(BionUnit);

BionUnit.obj_name = 'Bion';
BionUnit.resource_key = 'bion';
BionUnit.die_effect = 'splatb_animation';
BionUnit.images = {
	selection: {
		size: {x: 38, y: 38},
		padding: {x: 8, y: 7}
	},
	stand: {
		size: {x: 28, y: 25},
		padding: {x: 2, y: 1}
	},
	move: {
		size: {x: 26, y: 28},
		padding: {x: 1, y: 2},
		frames: 8
	},
	attack: {
		size: {x: 32, y: 29},
		padding: {x: 4, y: 5},
		frames: 3
	},
	shadow: {
		stand: {
			size: {x: 19, y: 8},
			padding: {x: -8, y: -17},
			static_img: true
		},
		move: {
			size: {x: 19, y: 8},
			padding: {x: -8, y: -17},
			static_img: true
		},
		attack: {
			size: {x: 19, y: 8},
			padding: {x: -8, y: -17},
			static_img: true
		}
	}
};
BionUnit.select_sounds = ['gxbonsc0', 'gxbonsc1'];
BionUnit.response_sounds = ['gxbonrc0', 'gxbonrc1'];

BionUnit.cost = 350;
BionUnit.health_max = 150;
BionUnit.weapon = PlasmaRifleWeapon;
BionUnit.is_human = true;
BionUnit.shield_type = 'PowerHumanWet';

BionUnit.require_building = [TrainingFacilityBuilding];

BionUnit.construction_building = [TrainingFacilityBuilding, TrainingFacility2Building];
BionUnit.construction_time = 8;