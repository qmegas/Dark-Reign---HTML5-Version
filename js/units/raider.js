function RaiderUnit(pos_x, pos_y, player)
{
	this._proto = RaiderUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(RaiderUnit);

RaiderUnit.obj_name = 'Raider';
RaiderUnit.resource_key = 'raider';
RaiderUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 27, y: 27},
		stand: {frames: 1},
		move: {frames: 6},
		attack: {frames: 2},
		hotspots: [
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 23, y: 11}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 24, y: 6}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 23, y: 3}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 19, y: -1}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 13, y: 0}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 7, y: -1}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 2, y: 1}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: -2, y: 6}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: -2, y: 9}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: -1, y: 13}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 0, y: 18}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 4, y: 21}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 11, y: 21}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 18, y: 21}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 23, y: 18}],
			[{x: 2, y: 2}, {x: 11, y: 12}, {x: 24, y: 13}],
		],
		weapon: 'LaserRifle'
	}
];
RaiderUnit.shadow = {
	stand: {
		size: {x: 19, y: 8},
		padding: {x: -11, y: -17},
		static_img: true
	}
};
RaiderUnit.select_sounds = ['gvfg2sl0', 'gvfg2sl1', 'gvfg2sl2', 'gvfg2sl3'];
RaiderUnit.response_sounds = ['gvfg2rl0', 'gvfg2rl1', 'gvfg2rl2', 'gvfg2rl4'];

RaiderUnit.cost = 150;
RaiderUnit.health_max = 100;
RaiderUnit.speed = 1.214;
RaiderUnit.is_human = true;
RaiderUnit.shield_type = 'ToughHumanWet';
RaiderUnit.seeing_range = 8;

RaiderUnit.health_explosions = {
	0: 'splata_explosion'
};

RaiderUnit.require_building = [TrainingFacilityBuilding];

RaiderUnit.construction_building = [TrainingFacilityBuilding, TrainingFacility2Building];
RaiderUnit.construction_time = 4;