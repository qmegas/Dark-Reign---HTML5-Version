function WaterWellBuilding(pos_x, pos_y, player)
{
	this._proto = WaterWellBuilding;
	this.player = player;
	
	this.res_now = 667;
	this.res_max = 667;
	
	this.init(pos_x, pos_y);
	
	this.run = function() 
	{
		this.increaseRes(0.026);
	};
	
	this.draw = function()
	{
		this._drawSprite(DRAW_LAYER_GBUILD, (this.health == 0) ? 1 : 0, 0);
	};
	
	//Custom selection bar
	this.drawSelection = function(is_onmouse)
	{
		this._drawSelectionStandart(is_onmouse);
		
		var top_x = this.position.x - 4 - game.viewport_x,
			top_y = this.position.y + CELL_SIZE*this._proto.cell_size.y - 33 - game.viewport_y, 
			water_h = parseInt((this.res_now/this.res_max)*34);
			
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y, 4, 36);
		
		if (this.res_max > this.res_now)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y + 1, 2, 34);
		}
		
		game.viewport_ctx.fillStyle = '#00a5ff';
		game.viewport_ctx.fillRect(top_x + 1, top_y + 35 - water_h, 2, water_h);
	};
	
	this.isHarvestPlatform = function()
	{
		return true;
	};
}

AbstractBuilding.setBuildingCommonOptions(WaterWellBuilding);

WaterWellBuilding.res_key = 'water_well';
WaterWellBuilding.obj_name = 'Pure Water Spring';
WaterWellBuilding.shield_type = 'SuperArmour';

WaterWellBuilding.cell_size = {x: 3, y: 3};
WaterWellBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1];
WaterWellBuilding.move_matrix = [0,0,0,0,0,0,0,0,0];
WaterWellBuilding.cell_padding = {x: 0, y: 0};
WaterWellBuilding.image_size = {x: 72, y: 68};
WaterWellBuilding.image_padding = {x: 0, y: -6};