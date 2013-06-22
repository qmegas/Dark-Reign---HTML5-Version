function GuardianUnit(pos_x, pos_y, player)
{
	this._proto = GuardianUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(GuardianUnit);

GuardianUnit.obj_name = 'Guardian';
GuardianUnit.resource_key = 'guardian';
GuardianUnit.parts = [
	{
		rotations: 8,
		image_size: {x: 26, y: 26},
		stand: {frames: 1},
		move: {frames: 6},
		attack: {frames: 2},
		hotspots: [
			[{x: 1, y: 1}, {x: 12, y: 12}, {x: 23, y: 9}],
			[{x: 1, y: 1}, {x: 12, y: 12}, {x: 22, y: 0}],
			[{x: 1, y: 1}, {x: 12, y: 12}, {x: 13, y: -1}],
			[{x: 1, y: 1}, {x: 12, y: 12}, {x: 4, y: 0}],
			[{x: 1, y: 1}, {x: 12, y: 12}, {x: -1, y: 7}],
			[{x: 1, y: 1}, {x: 12, y: 12}, {x: 3, y: 13}],
			[{x: 1, y: 1}, {x: 12, y: 12}, {x: 10, y: 18}],
			[{x: 1, y: 1}, {x: 12, y: 12}, {x: 21, y: 15}]
		],
		weapon: 'LaserRifle'
	}
];
GuardianUnit.shadow = {
	stand: {
		size: {x: 19, y: 8},
		padding: {x: -11, y: -17},
		static_img: true
	}
};
GuardianUnit.select_sounds = ['gvig1sl0', 'gvig1sl1', 'gvig1sl2', 'gvig1sl3'];
GuardianUnit.response_sounds = ['gvig1rl0', 'gvig1rl1', 'gvig1rl2', 'gvig1rl6'];

GuardianUnit.cost = 150;
GuardianUnit.health_max = 100;
GuardianUnit.speed = 1.214;
GuardianUnit.is_human = true;
GuardianUnit.shield_type = 'PowerHumanWet';
GuardianUnit.seeing_range = 8;

GuardianUnit.health_explosions = {
	0: 'splata_explosion'
};

GuardianUnit.require_building = [TrainingFacilityBuilding];

GuardianUnit.construction_building = [TrainingFacilityBuilding, TrainingFacility2Building];
GuardianUnit.construction_time = 4;