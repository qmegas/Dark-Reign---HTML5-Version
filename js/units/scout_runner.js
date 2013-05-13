function ScoutRunnerUnit(pos_x, pos_y, player)
{
	this._proto = ScoutRunnerUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(ScoutRunnerUnit);

ScoutRunnerUnit.obj_name = 'Scout Runner';
ScoutRunnerUnit.resource_key = 'scout_runner';
ScoutRunnerUnit.die_effect = 'death_with_sparks_animation';
ScoutRunnerUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 33, y: 33},
		stand: {frames: 1},
		hotspots: [
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 26, y: 12}, {x: -1, y: 11}, {x: 10, y: 2}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 23, y: 6}, {x: 2, y: 12}, {x: 8, y: 4}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 23, y: 2}, {x: 4, y: 17}, {x: 6, y: 4}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 16, y: -3}, {x: 6, y: 18}, {x: 3, y: 6}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 11, y: -3}, {x: 10, y: 20}, {x: 2, y: 8}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 5, y: -3}, {x: 16, y: 19}, {x: 3, y: 14}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 0, y: 1}, {x: 20, y: 17}, {x: 4, y: 16}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: -1, y: 8}, {x: 23, y: 14}, {x: 7, y: 18}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: -2, y: 10}, {x: 23, y: 10}, {x: 14, y: 20}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: -1, y: 16}, {x: 22, y: 6}, {x: 14, y: 18}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 3, y: 18}, {x: 17, y: 1}, {x: 17, y: 16}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 7, y: 20}, {x: 16, y: 1}, {x: 21, y: 15}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 12, y: 21}, {x: 12, y: -1}, {x: 21, y: 12}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 18, y: 20}, {x: 8, y: 0}, {x: 20, y: 10}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 22, y: 19}, {x: 4, y: 3}, {x: 19, y: 7}],
			[{x: 4, y: 4}, {x: 9, y: 11}, {x: 24, y: 14}, {x: 3, y: 6}, {x: 14, y: 3}]
		],
		weapon: 'LaserCannon'
	}
];
ScoutRunnerUnit.shadow = {
	stand: {
		size: {x: 33, y: 33},
		padding: {x: 2, y: 3}
	}
};

ScoutRunnerUnit.select_sounds = ['gvig1sl0', 'gvig1sl1', 'gvig1sl2', 'gvig1sl3'];
ScoutRunnerUnit.response_sounds = ['gvig1rl0', 'gvig1rl1', 'gvig1rl2', 'gvig1rl6'];

ScoutRunnerUnit.cost = 500;
ScoutRunnerUnit.health_max = 150;
ScoutRunnerUnit.speed = 3.035;
ScoutRunnerUnit.shield_type = 'TankPlating';
ScoutRunnerUnit.move_mode = MOVE_MODE_HOVER;
ScoutRunnerUnit.mass = 10;

ScoutRunnerUnit.require_building = [AssemblyPlantBuilding];

ScoutRunnerUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
ScoutRunnerUnit.construction_time = 10;