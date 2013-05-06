function PlasmaTankUnit(pos_x, pos_y, player)
{
	this._proto = PlasmaTankUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(PlasmaTankUnit);

PlasmaTankUnit.obj_name = 'Plasma Tank';
PlasmaTankUnit.resource_key = 'plasma_tank';
PlasmaTankUnit.die_effect = 'death_with_sparks_animation';
PlasmaTankUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 37, y: 37},
		stand: {frames: 1},
		hotspots: [
			[{x: 8, y: 9}, {x: 8, y: 9}, {x: -7, y: 12}, {x: 22, y: 4}],
			[{x: 8, y: 9}, {x: 8, y: 9}, {x: -3, y: 17}, {x: 20, y: 2}],
			[{x: 8, y: 9}, {x: 9, y: 10}, {x: 1, y: 19}, {x: 16, y: 0}],
			[{x: 8, y: 9}, {x: 10, y: 10}, {x: 6, y: 19}, {x: 10, y: 1}],
			[{x: 8, y: 9}, {x: 11, y: 9}, {x: 12, y: 21}, {x: 3, y: 3}],
			[{x: 8, y: 9}, {x: 12, y: 10}, {x: 16, y: 19}, {x: 1, y: 6}],
			[{x: 8, y: 9}, {x: 13, y: 10}, {x: 22, y: 16}, {x: -1, y: 7}],
			[{x: 8, y: 9}, {x: 14, y: 9}, {x: 25, y: 13}, {x: -2, y: 8}],
			[{x: 8, y: 9}, {x: 13, y: 9}, {x: 26, y: 10}, {x: -1, y: 14}],
			[{x: 8, y: 9}, {x: 12, y: 9}, {x: 25, y: 4}, {x: 2, y: 14}],
			[{x: 8, y: 9}, {x: 13, y: 8}, {x: 22, y: 1}, {x: 5, y: 16}],
			[{x: 8, y: 9}, {x: 12, y: 8}, {x: 16, y: 0}, {x: 9, y: 17}],
			[{x: 8, y: 9}, {x: 9, y: 7}, {x: 10, y: -1}, {x: 15, y: 16}],
			[{x: 8, y: 9}, {x: 11, y: 7}, {x: 5, y: 0}, {x: 21, y: 15}],
			[{x: 8, y: 9}, {x: 9, y: 6}, {x: -1, y: 3}, {x: 22, y: 11}],
			[{x: 8, y: 9}, {x: 9, y: 8}, {x: -4, y: 10}, {x: 23, y: 7}]
		]
	},
	{
		rotations: 16,
		image_size: {x: 37, y: 37},
		stand: {frames: 1},
		attack: {frames: 3},
		hotspots: [
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: 17, y: -1}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: 15, y: -7}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: 13, y: -11}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: 7, y: -13}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: 1, y: -13}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: -5, y: -14}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: -12, y: -8}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: -16, y: -4}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: -16, y: -1}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: -15, y: 5}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: -11, y: 8}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: -5, y: 11}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: 3, y: 12}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: 9, y: 11}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: 14, y: 9}],
			[{x: 17, y: 21}, {x: 2, y: -2}, {x: 17, y: 4}]
		],
		weapon: 'PlasmaCannon'
	}
];
PlasmaTankUnit.shadow = {
	stand: {
		size: {x: 37, y: 37},
		padding: {x: 6, y: 8}
	}
};

PlasmaTankUnit.select_sounds = ['gvig1sl0', 'gvig1sl1', 'gvig1sl2', 'gvig1sl3'];
PlasmaTankUnit.response_sounds = ['gvig1rl0', 'gvig1rl1', 'gvig1rl2', 'gvig1rl6'];

PlasmaTankUnit.cost = 700;
PlasmaTankUnit.health_max = 250;
PlasmaTankUnit.speed = 2.32;
PlasmaTankUnit.shield_type = 'TankPlating';
PlasmaTankUnit.move_mode = MOVE_MODE_HOVER;
PlasmaTankUnit.mass = 10;

PlasmaTankUnit.require_building = [AssemblyPlantBuilding];

PlasmaTankUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
PlasmaTankUnit.construction_time = 14;