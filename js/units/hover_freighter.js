function HoverFreighterUnit(pos_x, pos_y, player)
{
	this._proto = HoverFreighterUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(HoverFreighterUnit);

HoverFreighterUnit.prototype = new FreighterUnit();
HoverFreighterUnit.obj_name = 'Hover Freighter';
HoverFreighterUnit.resource_key = 'hover_freighter';
HoverFreighterUnit.die_effect = 'death_with_sparks_animation';
HoverFreighterUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 44, y: 44},
		stand: {frames: 1},
		load: {frames: 15},
		hotspots: [
			[{x: 10, y: 10}, {x: 0, y: 5}, {x: 9, y: 9}, {x: 20, y: 13}, {x: -3, y: 6}],
			[{x: 10, y: 10}, {x: 0, y: 9}, {x: 9, y: 9}, {x: 22, y: 11}, {x: -4, y: 10}],
			[{x: 10, y: 10}, {x: 3, y: 12}, {x: 9, y: 9}, {x: 23, y: 8}, {x: -4, y: 13}],
			[{x: 10, y: 10}, {x: 7, y: 14}, {x: 9, y: 9}, {x: 22, y: 5}, {x: -2, y: 16}],
			[{x: 10, y: 10}, {x: 12, y: 13}, {x: 9, y: 9}, {x: 20, y: 5}, {x: 5, y: 20}],
			[{x: 10, y: 10}, {x: 17, y: 13}, {x: 9, y: 9}, {x: 16, y: 0}, {x: 12, y: 20}],
			[{x: 10, y: 10}, {x: 21, y: 11}, {x: 9, y: 9}, {x: 8, y: 3}, {x: 17, y: 20}],
			[{x: 10, y: 10}, {x: 23, y: 8}, {x: 9, y: 9}, {x: 7, y: 5}, {x: 23, y: 17}],
			[{x: 10, y: 10}, {x: 25, y: 5}, {x: 9, y: 9}, {x: 5, y: 7}, {x: 26, y: 15}],
			[{x: 10, y: 10}, {x: 24, y: 1}, {x: 9, y: 9}, {x: 2, y: 9}, {x: 29, y: 9}],
			[{x: 10, y: 10}, {x: 21, y: -1}, {x: 9, y: 9}, {x: 2, y: 11}, {x: 27, y: 5}],
			[{x: 10, y: 10}, {x: 17, y: -3}, {x: 9, y: 9}, {x: 6, y: 12}, {x: 25, y: 3}],
			[{x: 10, y: 10}, {x: 12, y: -4}, {x: 9, y: 9}, {x: 5, y: 15}, {x: 20, y: -1}],
			[{x: 10, y: 10}, {x: 7, y: -2}, {x: 9, y: 9}, {x: 7, y: 15}, {x: 14, y: -2}],
			[{x: 10, y: 10}, {x: 3, y: -2}, {x: 9, y: 9}, {x: 12, y: 14}, {x: 4, y: 0}],
			[{x: 10, y: 10}, {x: 0, y: 1}, {x: 9, y: 9}, {x: 15, y: 13}, {x: -4, y: 2}]
		]
	},
	{
		rotations: 16,
		image_size: {x: 44, y: 44},
		stand: {frames: 1},
		attack: {frames: 1},
		hotspots: [
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 13, y: -2}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 11, y: -6}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 9, y: -8}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 6, y: -11}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 0, y: -11}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -5, y: -11}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -8, y: -9}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -11, y: -2}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -13, y: -1}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -10, y: 4}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -7, y: 6}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: -4, y: 8}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 1, y: 7}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 6, y: 7}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 11, y: 5}],
			[{x: 21, y: 21}, {x: 0, y: 0}, {x: 13, y: 2}]
		],
		weapon: 'LaserRifle'
	}
];

HoverFreighterUnit.select_sounds = ['gvig1sl0', 'gvig1sl1', 'gvig1sl2', 'gvig1sl3'];
HoverFreighterUnit.response_sounds = ['gvig1rl0', 'gvig1rl1', 'gvig1rl2', 'gvig1rl3'];

HoverFreighterUnit.cost = 1500;
HoverFreighterUnit.health_max = 500;
HoverFreighterUnit.speed = 2.4;
HoverFreighterUnit.shield_type = 'TankPlating';
HoverFreighterUnit.move_mode = MOVE_MODE_HOVER;

HoverFreighterUnit.require_building = [AssemblyPlant2Building];

HoverFreighterUnit.construction_building = [AssemblyPlant2Building];
HoverFreighterUnit.construction_time = 15;