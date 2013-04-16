function Headquarter2Building(pos_x, pos_y, player)
{
	this._proto = Headquarter2Building;
	this.state = BUILDING_STATE_UPGRADING;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(Headquarter2Building);

Headquarter2Building.res_key = 'headquarter2';
Headquarter2Building.obj_name = 'Headquarter 2';
Headquarter2Building.cost = 1000;
Headquarter2Building.build_time = 20;
Headquarter2Building.sell_cost = 656;
Headquarter2Building.sell_time = 10;
Headquarter2Building.health_max = 2880;

Headquarter2Building.energy = 100;
Headquarter2Building.crater = 4;

Headquarter2Building.cell_size = {x: 5, y: 4};
Headquarter2Building.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
Headquarter2Building.move_matrix = [0,0,1,1,1,1,1,0,0,1,0,1,1,1,1,1,0,1,1,1];
Headquarter2Building.cell_padding = {x: 2, y: 2};
Headquarter2Building.images = {
	normal: {
		size: {x: 120, y: 144},
		padding: {x: 0, y: 48}
	},
	shadow: {
		size: {x: 162, y: 137},
		padding: {x: -5, y: 29}
	}
};
Headquarter2Building.hotpoints = [
	{x: 12, y: -36},
	{x: 7, y: 52},
	{x: 101, y: 85},
	{x: 33, y: 21}
];
Headquarter2Building.health_explosions = {
	0: 'headquarter_0_explosion',
	33: 'headquarter_33_explosion',
	60: 'headquarter_60_explosion',
	80: 'headquarter_80_explosion'
};

Headquarter2Building.upgradable = true;