function VerticalBridgeBuilding(pos_x, pos_y, player)
{
	this._proto = VerticalBridgeBuilding;
	
	this.init(pos_x, pos_y, player);
	
	this.onConstructedCustom = function()
	{
		BridgeTypeBuilding.changeLandType(this);
	};
	
	this.onObjectDeletion = function() 
	{
		this.markCellsOnMap(-1);
		BridgeTypeBuilding.restoreLandType(this);
	};
}

AbstractBuilding.setBuildingCommonOptions(VerticalBridgeBuilding);

VerticalBridgeBuilding.res_key = 'vertical_bridge';
VerticalBridgeBuilding.obj_name = 'Small Vertical Bridge';
VerticalBridgeBuilding.cost = 100;
VerticalBridgeBuilding.build_time = 2;
VerticalBridgeBuilding.sell_cost = 50;
VerticalBridgeBuilding.sell_time = 1;
VerticalBridgeBuilding.health_max = 400;
VerticalBridgeBuilding.energy = 0;
VerticalBridgeBuilding.crater = 9;
VerticalBridgeBuilding.enabled = true;
VerticalBridgeBuilding.can_build = true;
VerticalBridgeBuilding.is_bridge = true;
VerticalBridgeBuilding.is_built_from_edge = true;
VerticalBridgeBuilding.seeing_range = 0;

VerticalBridgeBuilding.cell_size = {x: 4, y: 3};
VerticalBridgeBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1];
VerticalBridgeBuilding.move_matrix = [1,1,1,0,0,0,0,0,0,1,1,1];
VerticalBridgeBuilding.cell_padding = {x: 2, y: 1};
VerticalBridgeBuilding.images = {
	normal: {
		size: {x: 84, y: 72},
		padding: {x: -6, y: 0}
	},
	shadow: null
};
VerticalBridgeBuilding.hotpoints = [
	{x: 11, y: 11}
];
VerticalBridgeBuilding.health_explosions = {
	0: 'bridge_explosion'
};
VerticalBridgeBuilding.death_sound = '';