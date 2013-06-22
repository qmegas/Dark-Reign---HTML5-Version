function BionUnit(pos_x, pos_y, player)
{
	this._proto = BionUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(BionUnit);

BionUnit.obj_name = 'Bion';
BionUnit.resource_key = 'bion';
BionUnit.parts = [
	{
		rotations: 8,
		image_size: {x: 38, y: 38},
		stand: {frames: 1},
		move: {frames: 8},
		attack: {frames: 3},
		hotspots: [
			[{x: 7, y: 7}, {x: 12, y: 14}, {x: 27, y: 11}],
			[{x: 7, y: 7}, {x: 12, y: 14}, {x: 24, y: 2}],
			[{x: 7, y: 7}, {x: 12, y: 14}, {x: 16, y: -2}],
			[{x: 7, y: 7}, {x: 12, y: 14}, {x: 2, y: 0}],
			[{x: 7, y: 7}, {x: 12, y: 14}, {x: -5, y: 8}],
			[{x: 7, y: 7}, {x: 12, y: 14}, {x: -4, y: 18}],
			[{x: 7, y: 7}, {x: 12, y: 14}, {x: 7, y: 21}],
			[{x: 7, y: 7}, {x: 12, y: 14}, {x: 20, y: 22}]
		],
		weapon: 'PlasmaRifle'
	}
];
BionUnit.shadow = {
	stand: {
		size: {x: 19, y: 8},
		padding: {x: -10, y: -19},
		static_img: true
	}
};
BionUnit.select_sounds = ['gxbonsc0', 'gxbonsc1'];
BionUnit.response_sounds = ['gxbonrc0', 'gxbonrc1'];

BionUnit.cost = 350;
BionUnit.health_max = 150;
BionUnit.is_human = true;
BionUnit.shield_type = 'PowerHumanWet';
BionUnit.seeing_range = 8;

BionUnit.health_explosions = {
	0: 'splatb_explosion'
};

BionUnit.require_building = [TrainingFacilityBuilding];

BionUnit.construction_building = [TrainingFacilityBuilding, TrainingFacility2Building];
BionUnit.construction_time = 8;