function HorizontalBridgeBuilding(pos_x, pos_y, player)
{
	this._proto = HorizontalBridgeBuilding;
	this.player = player;
	this.health = this._proto.health_max;
	
	this.init(pos_x, pos_y);
	this.setActionTime(this._proto.build_time);
	
	this.run = function()
	{
		switch (this.state)
		{
			case 'CONSTRUCTION':
				this._runStandartConstruction();
				break;
				
			case 'SELL':
				this._runStandartSell();
				break;
		}
	}
}

AbstractBuilding.setBuildingCommonOptions(HorizontalBridgeBuilding);

HorizontalBridgeBuilding.res_key = 'horizontal_bridge';
HorizontalBridgeBuilding.obj_name = 'Small Horizontal Bridge';
HorizontalBridgeBuilding.cost = 100;
HorizontalBridgeBuilding.sell_cost = 37;
HorizontalBridgeBuilding.health_max = 400;
HorizontalBridgeBuilding.build_time = 3;
HorizontalBridgeBuilding.energy = 0;
HorizontalBridgeBuilding.enabled = true;
HorizontalBridgeBuilding.can_build = true;
HorizontalBridgeBuilding.is_bridge = true;

HorizontalBridgeBuilding.cell_size = {x: 3, y: 4};
HorizontalBridgeBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1];
HorizontalBridgeBuilding.move_matrix = [1,0,0,1,1,0,0,1,1,0,0,1];
HorizontalBridgeBuilding.cell_padding = {x: 1, y: 1};
HorizontalBridgeBuilding.image_size = {x: 72, y: 97};
HorizontalBridgeBuilding.image_padding = {x: 0, y: 4};