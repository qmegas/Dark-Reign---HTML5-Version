function ScarabUnit(pos_x, pos_y, player)
{
	this._proto = ScarabUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(ScarabUnit);

ScarabUnit.obj_name = 'S.C.A.R.A.B.';
ScarabUnit.resource_key = 'scarab';
ScarabUnit.die_effect = 'death_with_sparks_animation';
ScarabUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 49, y: 49},
		stand: {frames: 1},
		attack: {frames: 3},
		hotspots: [
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: 35, y: 3}, {x: 7, y: 20}, {x: 2, y: 9}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: 35, y: -4}, {x: 13, y: 21}, {x: 1, y: 13}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: 30, y: -12}, {x: 18, y: 19}, {x: 1, y: 15}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: 22, y: -15}, {x: 23, y: 17}, {x: 3, y: 19}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: 12, y: -16}, {x: 25, y: 14}, {x: 6, y: 21}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: 0, y: -15}, {x: 25, y: 11}, {x: 10, y: 22}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: -7, y: -11}, {x: 24, y: 8}, {x: 16, y: 22}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: -12, y: -4}, {x: 19, y: 4}, {x: 20, y: 20}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: -13, y: 3}, {x: 15, y: 1}, {x: 23, y: 18}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: -13, y: 11}, {x: 9, y: 2}, {x: 25, y: 15}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: -8, y: 16}, {x: 6, y: 2}, {x: 24, y: 10}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: 5, y: 17}, {x: 0, y: 7}, {x: 22, y: 7}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: 13, y: 21}, {x: -1, y: 10}, {x: 16, y: 4}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: 21, y: 20}, {x: -2, y: 14}, {x: 13, y: 5}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: 33, y: 17}, {x: 1, y: 17}, {x: 7, y: 6}],
			[{x: 13, y: 16}, {x: 14, y: 12}, {x: 35, y: 9}, {x: 4, y: 20}, {x: 4, y: 6}]
		],
		weapon: 'IMPArtilleryShell'
	}
];
ScarabUnit.shadow = {
	stand: {
		size: {x: 49, y: 49},
		padding: {x: 11, y: 15}
	}
};

ScarabUnit.select_sounds = ['gvig1sl0', 'gvig1sl1', 'gvig1sl2', 'gvig1sl3'];
ScarabUnit.response_sounds = ['gvig1rl0', 'gvig1rl1', 'gvig1rl2', 'gvig1rl6'];

ScarabUnit.cost = 1300;
ScarabUnit.health_max = 133;
ScarabUnit.shield_type = 'TankPlating';
ScarabUnit.move_mode = MOVE_MODE_HOVER;
ScarabUnit.mass = 10;

ScarabUnit.require_building = [AssemblyPlant2Building];

ScarabUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
ScarabUnit.construction_time = 26;