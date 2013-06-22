function TachyonTankUnit(pos_x, pos_y, player)
{
	this._proto = TachyonTankUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(TachyonTankUnit);

TachyonTankUnit.obj_name = 'Tachion Tank';
TachyonTankUnit.resource_key = 'tachyon_tank';
TachyonTankUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 43, y: 43},
		stand: {frames: 1},
		hotspots: [
			[{x: 9, y: 9}, {x: 5, y: 7}, {x: 11, y: 8}, {x: -3, y: 8}, {x: 19, y: 16}, {x: 20, y: 2}],
			[{x: 9, y: 9}, {x: 5, y: 7}, {x: 11, y: 8}, {x: -2, y: 12}, {x: 21, y: 15}, {x: 16, y: 1}],
			[{x: 9, y: 9}, {x: 8, y: 11}, {x: 11, y: 8}, {x: 2, y: 16}, {x: 25, y: 12}, {x: 10, y: 1}],
			[{x: 9, y: 9}, {x: 9, y: 11}, {x: 11, y: 8}, {x: 8, y: 17}, {x: 23, y: 8}, {x: 4, y: 4}],
			[{x: 9, y: 9}, {x: 12, y: 11}, {x: 11, y: 8}, {x: 11, y: 18}, {x: 21, y: 5}, {x: 1, y: 7}],
			[{x: 9, y: 9}, {x: 16, y: 12}, {x: 11, y: 8}, {x: 20, y: 19}, {x: 19, y: 2}, {x: 1, y: 13}],
			[{x: 9, y: 9}, {x: 17, y: 10}, {x: 11, y: 8}, {x: 25, y: 16}, {x: 12, y: 2}, {x: 2, y: 13}],
			[{x: 9, y: 9}, {x: 18, y: 8}, {x: 11, y: 8}, {x: 27, y: 13}, {x: 9, y: 3}, {x: 5, y: 14}],
			[{x: 9, y: 9}, {x: 19, y: 7}, {x: 11, y: 8}, {x: 28, y: 10}, {x: 6, y: 4}, {x: 8, y: 18}],
			[{x: 9, y: 9}, {x: 18, y: 6}, {x: 11, y: 8}, {x: 26, y: 5}, {x: 1, y: 9}, {x: 12, y: 18}],
			[{x: 9, y: 9}, {x: 16, y: 6}, {x: 11, y: 8}, {x: 22, y: 0}, {x: 1, y: 9}, {x: 17, y: 19}],
			[{x: 9, y: 9}, {x: 16, y: 5}, {x: 11, y: 8}, {x: 20, y: -2}, {x: 1, y: 9}, {x: 19, y: 18}],
			[{x: 9, y: 9}, {x: 14, y: 4}, {x: 11, y: 8}, {x: 15, y: -1}, {x: 2, y: 14}, {x: 23, y: 16}],
			[{x: 9, y: 9}, {x: 11, y: 3}, {x: 11, y: 8}, {x: 8, y: -2}, {x: 6, y: 18}, {x: 25, y: 11}],
			[{x: 9, y: 9}, {x: 10, y: 5}, {x: 11, y: 8}, {x: 4, y: 2}, {x: 8, y: 17}, {x: 26, y: 9}],
			[{x: 9, y: 9}, {x: 8, y: 5}, {x: 11, y: 8}, {x: 0, y: 4}, {x: 15, y: 19}, {x: 22, y: 6}]
		]
	},
	{
		rotations: 16,
		image_size: {x: 43, y: 43},
		stand: {frames: 1},
		attack: {frames: 2},
		hotspots: [
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: 19, y: 0}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: 18, y: -9}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: 14, y: -13}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: 7, y: -16}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: 0, y: -16}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: -9, y: -17}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: -15, y: -12}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: -20, y: -7}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: -20, y: -1}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: -20, y: 6}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: -15, y: 10}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: -8, y: 14}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: 0, y: 14}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: 9, y: 13}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: 14, y: 9}],
			[{x: 22, y: 21}, {x: 0, y: -3}, {x: 19, y: 4}]
		],
		weapon: 'TachyonCannon'
	}
];
TachyonTankUnit.shadow = {
	stand: {
		size: {x: 43, y: 43},
		padding: {x: 7, y: 8}
	}
};

TachyonTankUnit.select_sounds = ['gvtctsl0', 'gvtctsl1', 'gvtctsl2'];
TachyonTankUnit.response_sounds = ['gvtctrl0', 'gvtctal2', 'gvtctrl2', 'gvtctrl3'];

TachyonTankUnit.cost = 1500;
TachyonTankUnit.health_max = 410;
TachyonTankUnit.speed = 1.821;
TachyonTankUnit.shield_type = 'TankPlating';
TachyonTankUnit.move_mode = MOVE_MODE_HOVER;
TachyonTankUnit.mass = 10;

TachyonTankUnit.health_explosions = {
	0: 'eobpfsm4_explosion'
};

TachyonTankUnit.require_building = [AssemblyPlant2Building];

TachyonTankUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
TachyonTankUnit.construction_time = 30;