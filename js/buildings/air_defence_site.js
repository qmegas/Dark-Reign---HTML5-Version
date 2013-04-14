function AirDefenceSiteBuilding(pos_x, pos_y, player)
{
	this._proto = AirDefenceSiteBuilding;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(AirDefenceSiteBuilding);

AirDefenceSiteBuilding.res_key = 'air_defence_site';
AirDefenceSiteBuilding.obj_name = 'Air Defense Site';
AirDefenceSiteBuilding.cost = 1000;
AirDefenceSiteBuilding.build_time = 20;
AirDefenceSiteBuilding.sell_cost = 500;
AirDefenceSiteBuilding.sell_time = 10;
AirDefenceSiteBuilding.health_max = 720;
AirDefenceSiteBuilding.energy = 50;
AirDefenceSiteBuilding.enabled = false;
AirDefenceSiteBuilding.can_build = true;
AirDefenceSiteBuilding.crater = 1;
AirDefenceSiteBuilding.weapon = 'IMPFixedGroundToAirLaser';

AirDefenceSiteBuilding.cell_size = {x: 3, y: 3};
AirDefenceSiteBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1];
AirDefenceSiteBuilding.move_matrix = [1,1,0,1,1,1,0,1,1];
AirDefenceSiteBuilding.cell_padding = {x: 1, y: 1};
AirDefenceSiteBuilding.images = {
	normal: {
		size: {x: 64, y: 70},
		padding: {x: -4, y: -2}
	},
	shadow: {
		size: {x: 62, y: 47},
		padding: {x: -32, y: -43}
	},
	weapon: {
		size: {x: 66, y: 51},
		padding: {x: -5, y: -6},
		no_direction: true,
		animated: true,
		frames: 4
	}
};
AirDefenceSiteBuilding.hotpoints = [
	{x: 32, y: 35}
];
AirDefenceSiteBuilding.health_explosions = {
	0: 'building_0_explosion',
	60: 'building_60_explosion',
	80: 'building_80_explosion'
};