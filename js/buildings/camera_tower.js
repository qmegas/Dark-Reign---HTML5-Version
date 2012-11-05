function CameraTower(pos_x, pos_y)
{
	this._proto = CameraTower;
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

CameraTower.prototype = new AbstractBuilding();

CameraTower.box_image = 'camera_tower_box.png';
CameraTower.res_key = 'camera_tower.png';
CameraTower.enabled = false;
CameraTower.count = 0;
CameraTower.cell_size = {x: 1, y: 2};
CameraTower.cell_padding = {x: 0, y: 1};
CameraTower.image_size = {x: 24, y: 48};
CameraTower.image_padding = {x: 0, y: 0};
CameraTower.require_building = [HeadquarterBuilding];

CameraTower.loadResources = function(){
	game.resources.addImage(this.res_key, 'images/buildings/camera_tower.png');
};