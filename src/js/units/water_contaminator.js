function WaterContaminatorUnit(pos_x, pos_y, player)
{
	this._proto = WaterContaminatorUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(WaterContaminatorUnit);

WaterContaminatorUnit.obj_name = 'Water Contaminator';
WaterContaminatorUnit.resource_key = 'water_contaminator';
WaterContaminatorUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 40, y: 40},
		stand: {frames: 1},
		move: {frames: 4},
		hotspots: [
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}],
			[{x: 8, y: 8}, {x: 13, y: 10}]
		]
	}
];
WaterContaminatorUnit.shadow = {
	stand: {
		size: {x: 40, y: 40},
		padding: {x: 6, y: 7}
	}
};

WaterContaminatorUnit.select_sounds = ['gvig1sl0', 'gvig1sl1', 'gvig1sl2', 'gvig1sl3'];
WaterContaminatorUnit.response_sounds = ['gvig1rl0', 'gvig1rl1', 'gvig1rl2', 'gvig1rl6'];

WaterContaminatorUnit.cost = 10000;
WaterContaminatorUnit.health_max = 166;
WaterContaminatorUnit.speed = 0.6066;
WaterContaminatorUnit.shield_type = 'TankPlatingWet';
WaterContaminatorUnit.mass = 10;

WaterContaminatorUnit.health_explosions = {
	0: 'death_with_sparks_explosion',
	30: 'smallfired_explosion',
	60: 'smor_explosion'
};

WaterContaminatorUnit.require_building = [IMHeadquarter3Building, AssemblyPlantBuilding];

WaterContaminatorUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
WaterContaminatorUnit.construction_time = 100;