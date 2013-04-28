function ExterminatorUnit(pos_x, pos_y, player)
{
	this._proto = ExterminatorUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(ExterminatorUnit);

ExterminatorUnit.obj_name = 'Exterminator';
ExterminatorUnit.resource_key = 'exterminator';
ExterminatorUnit.die_effect = 'splatb_animation';
ExterminatorUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 27, y: 27},
		stand: {frames: 1},
		attack: {frames: 2},
		hotspots: [
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 24, y: 14}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 24, y: 10}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 22, y: 4}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 19, y: 2}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 14, y: 2}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 9, y: 1}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 6, y: 4}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 3, y: 5}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 1, y: 8}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 1, y: 12}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 1, y: 15}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 5, y: 17}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 11, y: 18}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 16, y: 19}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 20, y: 17}],
			[{x: 1, y: 0}, {x: 13, y: 13}, {x: 22, y: 14}]
		],
		weapon: 'PolyAcid'
	}
];
ExterminatorUnit.shadow = {
	stand: {
		size: {x: 19, y: 8},
		padding: {x: -5, y: -22},
		static_img: true
	}
};
ExterminatorUnit.select_sounds = ['gvextsl0', 'gvextsl1', 'gvextsl2'];
ExterminatorUnit.response_sounds = ['gvextrl0', 'gvextrl1', 'gvextrl2', 'gvextal3'];

ExterminatorUnit.cost = 500;
ExterminatorUnit.health_max = 75;
ExterminatorUnit.speed = 2.32;
ExterminatorUnit.is_human = true;
ExterminatorUnit.shield_type = 'PowerHuman';
ExterminatorUnit.move_mode = MOVE_MODE_HOVER;

ExterminatorUnit.require_building = [TrainingFacility2Building];

ExterminatorUnit.construction_building = [TrainingFacility2Building];
ExterminatorUnit.construction_time = 10;