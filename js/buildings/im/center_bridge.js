function CenterBridgeBuilding(pos_x, pos_y, player)
{
	this._proto = CenterBridgeBuilding;
	
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

AbstractBuilding.setBuildingCommonOptions(CenterBridgeBuilding);

CenterBridgeBuilding.res_key = 'center_bridge';
CenterBridgeBuilding.res_multicolor = false;
CenterBridgeBuilding.obj_name = 'Bridge Junction';
CenterBridgeBuilding.cost = 150;
CenterBridgeBuilding.build_time = 4;
CenterBridgeBuilding.sell_cost = 75;
CenterBridgeBuilding.sell_time = 2;
CenterBridgeBuilding.health_max = 400;
CenterBridgeBuilding.energy = 0;
CenterBridgeBuilding.crater = 7;
CenterBridgeBuilding.enabled = true;
CenterBridgeBuilding.can_build = true;
CenterBridgeBuilding.is_bridge = true;
CenterBridgeBuilding.is_built_from_edge = true;
CenterBridgeBuilding.seeing_range = 0;

CenterBridgeBuilding.cell_size = {x: 4, y: 4};
CenterBridgeBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
CenterBridgeBuilding.move_matrix = [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1];
CenterBridgeBuilding.cell_padding = {x: 2, y: 2};
CenterBridgeBuilding.images = {
	normal: {
		size: {x: 96, y: 96},
		padding: {x: 0, y: 0}
	},
	shadow: {
		size: {x: 106, y: 93},
		padding: {x: 0, y: -5}
	}
};
CenterBridgeBuilding.hotpoints = [
	{x: 11, y: 11}
];
CenterBridgeBuilding.health_explosions = {
	0: 'bridge_explosion'
};
CenterBridgeBuilding.death_sound = '';