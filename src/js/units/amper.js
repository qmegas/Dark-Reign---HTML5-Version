function AmperUnit(pos_x, pos_y, player)
{
	this._proto = AmperUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(AmperUnit);

AmperUnit.obj_name = 'Amper';
AmperUnit.resource_key = 'amper';
AmperUnit.parts = [
	{
		rotations: 8,
		image_size: {x: 45, y: 45},
		stand: {frames: 1},
		move: {frames: 6},
		attack: {frames: 3},
		hotspots: [
			[{x: 10, y: 10}],
			[{x: 10, y: 10}],
			[{x: 10, y: 10}],
			[{x: 10, y: 10}],
			[{x: 10, y: 10}],
			[{x: 10, y: 10}],
			[{x: 10, y: 10}],
			[{x: 10, y: 10}]
		]
	}
];
AmperUnit.shadow = {
	stand: {
		size: {x: 50, y: 50},
		padding: {x: 11, y: 12}
	},
	move: {
		size: {x: 50, y: 50},
		padding: {x: 11, y: 12}
	},
	attack: {
		size: {x: 50, y: 50},
		padding: {x: 11, y: 12}
	}
};
AmperUnit.select_sounds = ['gvampsl1', 'gvampsl2', 'gvampsl3'];
AmperUnit.response_sounds = ['gvamprl0', 'gvamprl2', 'gvampal0'];

AmperUnit.cost = 500;
AmperUnit.health_max = 66;
AmperUnit.speed = 1.214;
AmperUnit.shield_type = 'PowerHumanWet';

AmperUnit.health_explosions = {
	0: 'death_with_sparks_explosion',
	30: 'smallfired_explosion',
	60: 'smor_explosion'
};

AmperUnit.require_building = [TrainingFacilityBuilding, AssemblyPlantBuilding, FieldHospitalBuilding];

AmperUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
AmperUnit.construction_time = 10;