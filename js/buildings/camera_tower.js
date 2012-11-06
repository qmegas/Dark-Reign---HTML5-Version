function CameraTowerBuilding(pos_x, pos_y)
{
	this._proto = CameraTowerBuilding;
	this.health_max = 200;
	this.cost = 100;
	this.construction_max = 200;
	
	this.setPosition(pos_x, pos_y);
	
	this.run = function()
	{
		if (this.state == 'CONSTRUCTION')
		{
			this.construction_now++;
			this.health++;
			if (this.construction_now > this.construction_max)
			{
				this._proto.count++;
				game.resources.get('construction_complete').play();
				this.state = 'NORMAL';
			}
		}
	}
}

CameraTowerBuilding.prototype = new AbstractBuilding();

CameraTowerBuilding.box_image = 'camera_tower_box.png';
CameraTowerBuilding.res_key = 'camera_tower.png';
CameraTowerBuilding.obj_name = 'Camera Tower';
CameraTowerBuilding.enabled = false;
CameraTowerBuilding.count = 0;
CameraTowerBuilding.cell_size = {x: 1, y: 2};
CameraTowerBuilding.cell_padding = {x: 0, y: 1};
CameraTowerBuilding.image_size = {x: 24, y: 48};
CameraTowerBuilding.image_padding = {x: 0, y: 0};
CameraTowerBuilding.require_building = [HeadquarterBuilding];

CameraTowerBuilding.loadResources = function(){
	game.resources.addImage(this.res_key, 'images/buildings/camera_tower.png');
};