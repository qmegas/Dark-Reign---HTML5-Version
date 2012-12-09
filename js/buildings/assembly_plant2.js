function AssemblyPlant2Building(pos_x, pos_y, player)
{
	this._proto = AssemblyPlant2Building;
	this.player = player;
	this.health = this._proto.health_max;
	
	this.producing_queue = [];
	this.producing_start = 0;
	
	this.init(pos_x, pos_y);
	this.setActionTime(this._proto.build_time);
	
	this.run = function()
	{
		switch (this.state)
		{
			case 'CONSTRUCTION':
				this._runStandartConstruction();
				break;
				
			case 'PRODUCING':
				this._runStandartProducing();
				break;
				
			case 'NORMAL':
				if (this.producing_queue.length > 0)
				{
					this.producing_start = (new Date()).getTime();
					this.state = 'PRODUCING';
				}
				break;
				
			case 'SELL':
				this._runStandartSell();
				break;
		}
	}
	
	this.produce = function(obj)
	{
		this.producing_queue.push(obj);
	}
}

AbstractBuilding.setBuildingCommonOptions(AssemblyPlant2Building);

AssemblyPlant2Building.res_key = 'assembly_plant2';
AssemblyPlant2Building.obj_name = 'Advenced Assembly Plant';
AssemblyPlant2Building.cost = 2500;
AssemblyPlant2Building.sell_cost = 1762;
AssemblyPlant2Building.health_max = 2400;
AssemblyPlant2Building.build_time = 50;
AssemblyPlant2Building.energy = 100;

AssemblyPlant2Building.cell_size = {x: 5, y: 5};
AssemblyPlant2Building.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
AssemblyPlant2Building.move_matrix = [0,0,1,1,0,0,1,1,0,1,0,1,0,1,1,0,1,1,1,0,0,1,1,1,0];
AssemblyPlant2Building.cell_padding = {x: 2, y: 2};
AssemblyPlant2Building.image_size = {x: 119, y: 118};
AssemblyPlant2Building.image_padding = {x: -1, y: -3};