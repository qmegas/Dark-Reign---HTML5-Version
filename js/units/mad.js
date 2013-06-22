function MadUnit(pos_x, pos_y, player)
{
	this._proto = MadUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(MadUnit);

MadUnit.obj_name = 'Mobile Air Defense';
MadUnit.resource_key = 'mad';
MadUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 48, y: 48},
		stand: {frames: 1},
		hotspots: [
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 26, y: -5}, {x: 17, y: 21}, {x: 9, y: 5}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 25, y: -10}, {x: 21, y: 19}, {x: 8, y: 5}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 22, y: -14}, {x: 25, y: 13}, {x: 7, y: 7}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 18, y: -13}, {x: 25, y: 10}, {x: 5, y: 9}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 11, y: -14}, {x: 22, y: 6}, {x: 6, y: 10}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 7, y: -13}, {x: 15, y: 4}, {x: 7, y: 13}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 2, y: -13}, {x: 10, y: 1}, {x: 8, y: 15}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: -1, y: -9}, {x: 8, y: 2}, {x: 13, y: 15}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: -2, y: -4}, {x: 4, y: 3}, {x: 14, y: 16}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: -1, y: -1}, {x: 0, y: 5}, {x: 15, y: 16}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 0, y: 4}, {x: -1, y: 8}, {x: 19, y: 14}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 6, y: 8}, {x: 0, y: 12}, {x: 21, y: 14}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 12, y: 10}, {x: 1, y: 13}, {x: 20, y: 10}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 19, y: 6}, {x: 2, y: 17}, {x: 18, y: 7}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 24, y: 3}, {x: 5, y: 18}, {x: 13, y: 6}],
			[{x: 12, y: 14}, {x: 12, y: 8}, {x: 27, y: 0}, {x: 9, y: 21}, {x: 11, y: 5}]
		],
		weapon: 'GroundToAirLaser'
	}
];
MadUnit.shadow = {
	stand: {
		size: {x: 48, y: 48},
		padding: {x: 10, y: 13}
	}
};

MadUnit.select_sounds = ['gvig1sl0', 'gvig1sl1', 'gvig1sl2', 'gvig1sl3'];
MadUnit.response_sounds = ['gvig1rl0', 'gvig1rl1', 'gvig1rl2', 'gvig1rl6'];

MadUnit.cost = 800;
MadUnit.health_max = 150;
MadUnit.speed = 2.428;
MadUnit.shield_type = 'TankPlating';
MadUnit.move_mode = MOVE_MODE_HOVER;
MadUnit.mass = 10;

MadUnit.health_explosions = {
	0: 'death_with_sparks_explosion'
};

MadUnit.require_building = [Headquarter2Building, AssemblyPlantBuilding];

MadUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
MadUnit.construction_time = 16;