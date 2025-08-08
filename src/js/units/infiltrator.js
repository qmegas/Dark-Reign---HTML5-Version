function InfiltratorUnit(pos_x, pos_y, player)
{
	this._proto = InfiltratorUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(InfiltratorUnit);

InfiltratorUnit.obj_name = 'Infiltrator';
InfiltratorUnit.resource_key = 'infiltrator';
InfiltratorUnit.parts = [
	{
		rotations: 8,
		image_size: {x: 21, y: 21},
		stand: {frames: 1},
		move: {frames: 8},
		hotspots: [
			[{x: -2, y: -2}, {x: 11, y: 12}],
			[{x: -2, y: -2}, {x: 11, y: 12}],
			[{x: -2, y: -2}, {x: 11, y: 12}],
			[{x: -2, y: -2}, {x: 11, y: 12}],
			[{x: -2, y: -2}, {x: 11, y: 12}],
			[{x: -2, y: -2}, {x: 11, y: 12}],
			[{x: -2, y: -2}, {x: 11, y: 12}],
			[{x: -2, y: -2}, {x: 11, y: 12}],
		]
	}
];
InfiltratorUnit.shadow = {
	stand: {
		size: {x: 19, y: 8},
		padding: {x: -10, y: -19},
		static_img: true
	}
};

InfiltratorUnit.select_sounds = ['gviinsl0', 'gviinsl1', 'gviinsl2'];
InfiltratorUnit.response_sounds = ['gviinrl0', 'gviinrl1', 'gviinal0', 'gviinal2'];

InfiltratorUnit.cost = 1000;
InfiltratorUnit.health_max = 66;
InfiltratorUnit.speed = 1.4742;

InfiltratorUnit.health_explosions = {
	0: 'splatc_explosion'
};

InfiltratorUnit.require_building = [TrainingFacility2Building];

InfiltratorUnit.construction_building = [TrainingFacilityBuilding, TrainingFacility2Building];
InfiltratorUnit.construction_time = 20;