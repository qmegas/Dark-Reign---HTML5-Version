function ShredderUnit(pos_x, pos_y, player)
{
	this._proto = ShredderUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(ShredderUnit);

ShredderUnit.obj_name = 'Shredder';
ShredderUnit.resource_key = 'shredder';
ShredderUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 35, y: 35},
		stand: {frames: 4},
		hotspots: [
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: -3, y: 10}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: -2, y: 18}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: 3, y: 22}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: 9, y: 22}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: 16, y: 22}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: 22, y: 15}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: 23, y: 9}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: 23, y: 4}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: 19, y: 3}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: 21, y: 2}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: 13, y: 0}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: 9, y: 0}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: 3, y: 0}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: 0, y: 2}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: -3, y: 6}],
			[{x: 6, y: 6}, {x: 12, y: 11}, {x: 13, y: 12}, {x: -3, y: 10}],
		]
	}
];
ShredderUnit.shadow = {
	stand: {
		size: {x: 35, y: 35},
		padding: {x: 4, y: 5}
	}
};

ShredderUnit.select_sounds = ['gxshrsc0', 'gxshrsc1', 'gxshrsc2'];
ShredderUnit.response_sounds = ['gxshrrc0', 'gxshrrc1'];

ShredderUnit.cost = 700;
ShredderUnit.health_max = 100;
ShredderUnit.speed = 3.033;
ShredderUnit.shield_type = 'ForcePlating';
ShredderUnit.move_mode = MOVE_MODE_HOVER;
ShredderUnit.mass = 10;

ShredderUnit.health_explosions = {
	0: 'death_with_sparks_explosion',
	30: 'smallfired_explosion',
	60: 'smor_explosion'
};

ShredderUnit.require_building = [AssemblyPlantBuilding];

ShredderUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
ShredderUnit.construction_time = 14;