function HeadquarterBuilding(pos_x, pos_y)
{
	this._proto = HeadquarterBuilding;
	this.health_max = 750;
	this.cost = 100;
	this.construction_max = 750;
	
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
				
				var sound = game.resources.get('construction_complete');
				
				sound.play();
				if (game.constructor.recalcUnitAvailability())
					sound.addEventListener('ended', function(){
						game.resources.get('new_units_available').play();
						this.removeEventListener('ended', arguments.callee, false);
					});
				
				this.state = 'NORMAL';
			}
		}
	}
}

HeadquarterBuilding.prototype = new AbstractBuilding();

HeadquarterBuilding.box_image = 'headquarter_box.png';
HeadquarterBuilding.res_key = 'headquarter.png';
HeadquarterBuilding.obj_name = 'Headquarter 1';
HeadquarterBuilding.enabled = true;
HeadquarterBuilding.count = 0;
HeadquarterBuilding.cell_size = {x: 5, y: 4};
HeadquarterBuilding.cell_padding = {x: 2, y: 2};
HeadquarterBuilding.image_size = {x: 103, y: 138};
HeadquarterBuilding.image_padding = {x: -9, y: 42};
HeadquarterBuilding.require_building = [];

HeadquarterBuilding.loadResources = function(){
	game.resources.addImage(this.res_key, 'images/buildings/headquarter.png');
};