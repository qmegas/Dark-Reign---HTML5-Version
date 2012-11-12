function CameraTowerBuilding(pos_x, pos_y)
{
	this._proto = CameraTowerBuilding;
	this.health_max = 200;
	this.construction_max = 200;
	
	this.setPosition(pos_x, pos_y);
	
	this.run = function()
	{
		if (this.state == 'CONSTRUCTION')
		{
			this._runStandartConstruction();
		}
	}
}

CameraTowerBuilding.prototype = new AbstractBuilding();

CameraTowerBuilding.box_image = 'camera_tower_box.png';
CameraTowerBuilding.res_key = 'camera_tower.png';
CameraTowerBuilding.obj_name = 'Camera Tower';
CameraTowerBuilding.cost = 200;
CameraTowerBuilding.energy = 50;
CameraTowerBuilding.enabled = false;
CameraTowerBuilding.count = 0;
CameraTowerBuilding.cell_size = {x: 1, y: 2};
CameraTowerBuilding.cell_matrix = [1,1];
CameraTowerBuilding.cell_padding = {x: 0, y: 1};
CameraTowerBuilding.image_size = {x: 24, y: 48};
CameraTowerBuilding.image_padding = {x: 0, y: 0};
CameraTowerBuilding.require_building = [HeadquarterBuilding];

CameraTowerBuilding.loadResources = function(){
	game.resources.addImage(this.res_key, 'images/buildings/camera_tower.png');
};