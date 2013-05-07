function RearmingDeckBuilding(pos_x, pos_y, player)
{
	this._proto = RearmingDeckBuilding;
	
	this.init(pos_x, pos_y, player);
}

AbstractBuilding.setBuildingCommonOptions(RearmingDeckBuilding);

RearmingDeckBuilding.res_key = 'rearming_deck';
RearmingDeckBuilding.obj_name = 'Rearming Deck';
RearmingDeckBuilding.cost = 1000;
RearmingDeckBuilding.build_time = 20;
RearmingDeckBuilding.sell_cost = 50;
RearmingDeckBuilding.sell_time = 10;
RearmingDeckBuilding.health_max = 960;
RearmingDeckBuilding.energy = 100;
RearmingDeckBuilding.enabled = true;
RearmingDeckBuilding.can_build = true;
RearmingDeckBuilding.crater = 1;

RearmingDeckBuilding.cell_size = {x: 3, y: 3};
RearmingDeckBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1];
RearmingDeckBuilding.move_matrix = [0,1,1,0,1,1,0,1,1];
RearmingDeckBuilding.cell_padding = {x: 1, y: 1};
RearmingDeckBuilding.images = {
	normal: {
		size: {x: 71, y: 71},
		padding: {x: -1, y: 0},
		animated: true,
		frames: [1,2]
	},
	shadow: {
		size: {x: 82, y: 50},
		padding: {x: -17, y: -36}
	}
};
RearmingDeckBuilding.hotpoints = [
	{x: 12, y: 12},
	{x: 22, y: 63},
	{x: 59, y: 44}
];