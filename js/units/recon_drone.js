function ReconDroneUnit(pos_x, pos_y, player)
{
	this._proto = ReconDroneUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(ReconDroneUnit);

ReconDroneUnit.obj_name = 'Recon Drone';
ReconDroneUnit.resource_key = 'recon_drone';
ReconDroneUnit.parts = [
	{
		rotations: 12,
		image_size: {x: 30, y: 30},
		stand: {frames: 1},
		hotspots: [
			[{x: 3, y: 9}, {x: 12, y: 5}],
			[{x: 3, y: 9}, {x: 12, y: 5}],
			[{x: 3, y: 9}, {x: 12, y: 5}],
			[{x: 3, y: 9}, {x: 12, y: 5}],
			[{x: 3, y: 9}, {x: 12, y: 5}],
			[{x: 3, y: 9}, {x: 12, y: 5}],
			[{x: 3, y: 9}, {x: 12, y: 5}],
			[{x: 3, y: 9}, {x: 12, y: 5}],
			[{x: 3, y: 9}, {x: 12, y: 5}],
			[{x: 3, y: 9}, {x: 12, y: 5}],
			[{x: 3, y: 9}, {x: 12, y: 5}],
			[{x: 3, y: 9}, {x: 12, y: 5}]
		]
	}
];
ReconDroneUnit.shadow = {
	stand: {
		size: {x: 30, y: 30},
		padding: {x: -27, y: -6}
	}
};

ReconDroneUnit.select_sounds = ['gxrdrsc0', 'gxrdrsc1', 'gxrdrsc2'];
ReconDroneUnit.response_sounds = ['gxrdrrc0', 'gxrdrrc1', 'gxrdrrc2'];

ReconDroneUnit.cost = 400;
ReconDroneUnit.health_max = 66;
ReconDroneUnit.speed = 2.428;
ReconDroneUnit.shield_type = 'FlyingArmour';
ReconDroneUnit.move_mode = MOVE_MODE_FLY;
ReconDroneUnit.mass = 10;

ReconDroneUnit.health_explosions = {
	0: 'death_with_sparks_explosion',
	30: 'smallfired_explosion',
	60: 'smor_explosion'
};

ReconDroneUnit.require_building = [Headquarter2Building, AssemblyPlantBuilding];

ReconDroneUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
ReconDroneUnit.construction_time = 8;