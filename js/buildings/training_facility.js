function TrainingFacilityBuilding(pos_x, pos_y)
{
	this._proto = TrainingFacilityBuilding;
	this.health_max = 1500;
	this.construction_max = 1500;
	
	this.producing_queue = [];
	this.producing_start = 0;
	
	this.setPosition(pos_x, pos_y);
	
	this.run = function()
	{
		switch (this.state)
		{
			case 'CONSTRUCTION':
				this._runStandartConstruction();
				break;
				
			case 'PRODUCING':
				this.producing_queue[0].construction_progress += 1 / (50 * this.producing_queue[0].construction_time);
				if (this.producing_queue[0].construction_progress > 1)
				{
					var cell = this.getCell(), unit = AbstractUnit.createNew(this.producing_queue[0], cell.x + 2, cell.y + 2);
					//Find compatable point for exit
					unit.move(cell.x, cell.y + 5);
					
					this.producing_queue[0].construction_progress = 0;
					this.producing_queue[0].construction_queue--;
					this.producing_queue.shift();
					this.state = 'NORMAL';
				}
				break;
				
			case 'NORMAL':
				if (this.producing_queue.length > 0)
				{
					this.producing_start = (new Date).getTime();
					this.state = 'PRODUCING';
				}
				break;
		}
	}
	
	this.produce = function(obj)
	{
		this.producing_queue.push(obj);
	}
}

TrainingFacilityBuilding.prototype = new AbstractBuilding();

TrainingFacilityBuilding.box_image = 'training_facility_box.png';
TrainingFacilityBuilding.res_key = 'training_facility.png';
TrainingFacilityBuilding.obj_name = 'Training Facility';
TrainingFacilityBuilding.cost = 1500;
TrainingFacilityBuilding.energy = 100;
TrainingFacilityBuilding.enabled = false;
TrainingFacilityBuilding.count = 0;
TrainingFacilityBuilding.cell_size = {x: 5, y: 5};
TrainingFacilityBuilding.cell_matrix = [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1];
TrainingFacilityBuilding.move_matrix = [0,0,1,1,0,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,0,0];
TrainingFacilityBuilding.cell_padding = {x: 2, y: 2};
TrainingFacilityBuilding.image_size = {x: 113, y: 100};
TrainingFacilityBuilding.image_padding = {x: 0, y: 0};
TrainingFacilityBuilding.require_building = [HeadquarterBuilding];

TrainingFacilityBuilding.loadResources = function(){
	game.resources.addImage(this.res_key, 'images/buildings/training_facility.png');
};