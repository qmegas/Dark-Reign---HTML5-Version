function HostageTakerUnit(pos_x, pos_y, player)
{
	this._proto = HostageTakerUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(HostageTakerUnit);

HostageTakerUnit.obj_name = 'Hostage Taker';
HostageTakerUnit.resource_key = 'hostage_taker';
HostageTakerUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 45, y: 45},
		stand: {frames: 1},
		move: {frames: 3},
		attack: {frames: 3},
		hotspots: [
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}],
			[{x: 11, y: 10}, {x: 11, y: 11}]
		]
	}
];
HostageTakerUnit.shadow = {
	stand: {
		size: {x: 45, y: 45},
		padding: {x: 9, y: 9}
	}
};

HostageTakerUnit.select_sounds = ['gvhossl0', 'gvhossl1'];
HostageTakerUnit.response_sounds = ['gvhosrl0', 'gvhosrl2', 'gvhosal0'];

HostageTakerUnit.cost = 600;
HostageTakerUnit.health_max = 450;
HostageTakerUnit.speed = 3.033;
HostageTakerUnit.shield_type = 'TankPlatingWet';
HostageTakerUnit.mass = 10;

HostageTakerUnit.health_explosions = {
	0: 'death_with_sparks_explosion'
};

HostageTakerUnit.require_building = [AssemblyPlant2Building];

HostageTakerUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
HostageTakerUnit.construction_time = 12;