function SpiderBikeUnit(pos_x, pos_y, player)
{
	this._proto = SpiderBikeUnit;
	this.player = player;
	
	this.init(pos_x, pos_y);
}

AbstractUnit.setUnitCommonOptions(SpiderBikeUnit);

SpiderBikeUnit.obj_name = 'Spider Bike';
SpiderBikeUnit.resource_key = 'spider_bike';
SpiderBikeUnit.parts = [
	{
		rotations: 16,
		image_size: {x: 38, y: 38},
		stand: {frames: 1},
		move: {frames: 3},
		attack: {frames: 1},
		hotspots: [
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 28, y: 8}, {x: 0, y: 2}, {x: 24, y: 20}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 28, y: 3}, {x: -3, y: 5}, {x: 27, y: 16}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 24, y: 1}, {x: -3, y: 10}, {x: 27, y: 12}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 19, y: -4}, {x: -2, y: 16}, {x: 25, y: 8}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 12, y: -4}, {x: 2, y: 20}, {x: 20, y: 5}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 5, y: -3}, {x: 6, y: 23}, {x: 16, y: 6}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 1, y: -2}, {x: 12, y: 23}, {x: 12, y: 3}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: -2, y: 5}, {x: 18, y: 23}, {x: 6, y: 2}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: -5, y: 8}, {x: 24, y: 20}, {x: 2, y: 7}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: -2, y: 15}, {x: 27, y: 18}, {x: 1, y: 10}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 2, y: 19}, {x: 28, y: 12}, {x: 0, y: 14}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 8, y: 20}, {x: 28, y: 8}, {x: 1, y: 17}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 12, y: 21}, {x: 24, y: 5}, {x: 4, y: 21}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 19, y: 19}, {x: 19, y: 3}, {x: 8, y: 24}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 22, y: 18}, {x: 11, y: 2}, {x: 13, y: 24}],
			[{x: 7, y: 7}, {x: 11, y: 10}, {x: 26, y: 16}, {x: 7, y: 1}, {x: 20, y: 24}]
		],
		weapon: 'DoubleRailGun'
	}
];
SpiderBikeUnit.shadow = {
	stand: {
		size: {x: 38, y: 38},
		padding: {x: 6, y: 3}
	},
	move: {
		size: {x: 38, y: 38},
		padding: {x: 6, y: 7}
	},
	attack: {
		size: {x: 38, y: 38},
		padding: {x: 6, y: 3}
	}
};

SpiderBikeUnit.select_sounds = ['gvfg2sl0', 'gvfg2sl1', 'gvfg2sl2', 'gvfg2sl3'];
SpiderBikeUnit.response_sounds = ['gvfg2rl0', 'gvfg2rl1', 'gvfg2rl2', 'gvfg2rl4'];

SpiderBikeUnit.cost = 500;
SpiderBikeUnit.health_max = 133;
SpiderBikeUnit.speed = 3.64;
SpiderBikeUnit.shield_type = 'TankPlatingWet';
SpiderBikeUnit.mass = 10;

SpiderBikeUnit.health_explosions = {
	0: 'death_with_sparks_explosion',
	30: 'smallfired_explosion',
	60: 'smor_explosion'
};

SpiderBikeUnit.require_building = [AssemblyPlantBuilding];

SpiderBikeUnit.construction_building = [AssemblyPlantBuilding, AssemblyPlant2Building];
SpiderBikeUnit.construction_time = 10;