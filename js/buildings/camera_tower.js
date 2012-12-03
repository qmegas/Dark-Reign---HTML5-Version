function CameraTowerBuilding(pos_x, pos_y, player)
{
	this._proto = CameraTowerBuilding;
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

AbstractBuilding.setBuildingCommonOptions(CameraTowerBuilding);

CameraTowerBuilding.res_key = 'camera_tower';
CameraTowerBuilding.obj_name = 'Camera Tower';
CameraTowerBuilding.cost = 200;
CameraTowerBuilding.sell_cost = 100;
CameraTowerBuilding.health_max = 150;
CameraTowerBuilding.build_time = 4;
CameraTowerBuilding.energy = 50;
CameraTowerBuilding.can_build = true;

CameraTowerBuilding.cell_size = {x: 1, y: 2};
CameraTowerBuilding.cell_matrix = [1,1];
CameraTowerBuilding.move_matrix = [1,1];
CameraTowerBuilding.cell_padding = {x: 0, y: 1};
CameraTowerBuilding.image_size = {x: 24, y: 48};
CameraTowerBuilding.image_padding = {x: 0, y: 0};