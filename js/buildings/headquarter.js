function HeadquarterBuilding(pos_x, pos_y, player)
{
	this._proto = HeadquarterBuilding;
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
}

AbstractBuilding.setBuildingCommonOptions(HeadquarterBuilding);

HeadquarterBuilding.res_key = 'headquarter';
HeadquarterBuilding.obj_name = 'Headquarter 1';
HeadquarterBuilding.cost = 750;
HeadquarterBuilding.sell_cost = 375;
HeadquarterBuilding.health_max = 1440;
HeadquarterBuilding.build_time = 15;
HeadquarterBuilding.energy = 100;
HeadquarterBuilding.enabled = true;
HeadquarterBuilding.can_build = true;

HeadquarterBuilding.cell_size = {x: 5, y: 4};
HeadquarterBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
HeadquarterBuilding.move_matrix = [0,0,1,1,1,1,1,0,0,1,0,1,1,1,1,1,0,1,1,1];
HeadquarterBuilding.cell_padding = {x: 2, y: 2};
HeadquarterBuilding.image_size = {x: 103, y: 138};
HeadquarterBuilding.image_padding = {x: -9, y: 42};

HeadquarterBuilding.upgradable = true;