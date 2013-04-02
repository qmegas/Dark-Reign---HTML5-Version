function ExterminatorUnit(pos_x, pos_y, player)
{
	this._proto = ExterminatorUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(ExterminatorUnit);

ExterminatorUnit.obj_name = 'Exterminator';
ExterminatorUnit.resource_key = 'exterminator';
ExterminatorUnit.die_effect = 'splatb_explosion';
ExterminatorUnit.images = {
	selection: {
		size: {x: 27, y: 27},
		padding: {x: 4, y: 2}
	},
	stand: {
		size: {x: 21, y: 24},
		padding: {x: 1, y: 0}
	},
	move: {
		size: {x: 21, y: 24},
		padding: {x: 1, y: 0},
		frames: 1
	},
	attack: {
		size: {x: 22, y: 23},
		padding: {x: 1, y: 0},
		frames: 2
	},
	shadow: {
		stand: {
			size: {x: 19, y: 8},
			padding: {x: -5, y: -22},
			static_img: true
		},
		move: {
			size: {x: 19, y: 8},
			padding: {x: -5, y: -22},
			static_img: true
		},
		attack: {
			size: {x: 19, y: 8},
			padding: {x: -5, y: -22},
			static_img: true
		}
	}
};
ExterminatorUnit.select_sounds = ['gvextsl0', 'gvextsl1', 'gvextsl2'];
ExterminatorUnit.response_sounds = ['gvextrl0', 'gvextrl1', 'gvextrl2', 'gvextal3'];

ExterminatorUnit.cost = 500;
ExterminatorUnit.health_max = 75;
ExterminatorUnit.speed = 2.32;
ExterminatorUnit.weapon = null; //TODO
ExterminatorUnit.is_human = true;
ExterminatorUnit.shield_type = 'PowerHuman';

ExterminatorUnit.require_building = [TrainingFacility2Building];

ExterminatorUnit.construction_building = [TrainingFacility2Building];
ExterminatorUnit.construction_time = 10;