function WaterLaunchPadBuilding(pos_x, pos_y)
{
	this._proto = WaterLaunchPadBuilding;
	this.health = this._proto.health_max;
	
	this.water_max = 100;
	this.water_now = 40;
	
	this.setPosition(pos_x, pos_y);
	this.setActionTime(this._proto.build_time);
	
	this.run = function()
	{
		if (this.state == 'CONSTRUCTION')
		{
			this._runStandartConstruction();
		}
	}
	
	//Custom selection bar
	this.drawSelection = function(is_onmouse)
	{
		this._drawSelectionStandart(is_onmouse);
		
		var top_x = this.position.x - 4 - game.viewport_x,
			top_y = this.position.y + CELL_SIZE*this._proto.cell_size.y - 45 - game.viewport_y, 
			water_h = parseInt((this.water_now/this.water_max)*46);
			
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y, 4, 48);
		
		if (this.water_max > this.water_now)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y + 1, 2, 46);
		}
		
		game.viewport_ctx.fillStyle = '#00a5ff';
		game.viewport_ctx.fillRect(top_x + 1, top_y + 47 - water_h, 2, water_h);
	}
}

WaterLaunchPadBuilding.prototype = new AbstractBuilding();

WaterLaunchPadBuilding.res_key = 'water_launch';
WaterLaunchPadBuilding.obj_name = 'Water Launch Pad';
WaterLaunchPadBuilding.cost = 2500;
WaterLaunchPadBuilding.sell_cost = 1250;
WaterLaunchPadBuilding.health_max = 1250;
WaterLaunchPadBuilding.build_time = 25;
WaterLaunchPadBuilding.energy = 100;
WaterLaunchPadBuilding.enabled = true;
WaterLaunchPadBuilding.count = 0;

WaterLaunchPadBuilding.cell_size = {x: 5, y: 3};
WaterLaunchPadBuilding.cell_matrix = [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0];
WaterLaunchPadBuilding.move_matrix = [0,1,0,0,1,1,1,1,1,1,0,0,0,0,0];
WaterLaunchPadBuilding.cell_padding = {x: 2, y: 1};
WaterLaunchPadBuilding.image_size = {x: 112, y: 77};
WaterLaunchPadBuilding.image_padding = {x: -10, y: 7};
WaterLaunchPadBuilding.require_building = [];

WaterLaunchPadBuilding.loadResources = function(){
	AbstractBuilding.loadResources(this);
};