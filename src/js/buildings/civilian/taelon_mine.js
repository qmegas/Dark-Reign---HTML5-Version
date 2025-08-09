function TaelonMineBuilding(pos_x, pos_y, player)
{
	this._proto = TaelonMineBuilding;
	
	this.res_now = 40;
	this.res_max = 500;
	
	this.init(pos_x, pos_y, player);
	
	this.run = function() 
	{
		this.increaseRes(0.03);
	};
	
	this.draw = function()
	{
		this._drawSprite(DRAW_LAYER_GBUILD, 0, 0);
	};
	
	//Custom selection bar
	this.drawSelection = function(is_onmouse)
	{
		this._drawSelectionStandart(is_onmouse);
		
		var top_x = this.position.x - game.viewport_x + CELL_SIZE*this._proto.cell_size.x,
			top_y = this.position.y + CELL_SIZE*this._proto.cell_size.y - 33 - game.viewport_y, 
			water_h = parseInt((this.res_now/this.res_max)*34);
			
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y, 4, 36);
		
		if (this.res_max > this.res_now)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y + 1, 2, 34);
		}
		
		game.viewport_ctx.fillStyle = '#ffff00';
		game.viewport_ctx.fillRect(top_x + 1, top_y + 35 - water_h, 2, water_h);
	};
	
	this.isHarvestPlatform = function()
	{
		return true;
	};
}

AbstractBuilding.setBuildingCommonOptions(TaelonMineBuilding);

TaelonMineBuilding.res_key = 'taelon_mine';
TaelonMineBuilding.res_multicolor = false;
TaelonMineBuilding.obj_name = 'Taelon';
TaelonMineBuilding.shield_type = 'SuperArmour2';

TaelonMineBuilding.cell_size = {x: 3, y: 3};
TaelonMineBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1];
TaelonMineBuilding.move_matrix = [0,0,0,0,0,0,0,0,0];
TaelonMineBuilding.cell_padding = {x: 0, y: 0};
TaelonMineBuilding.images = {
	normal: {
		size: {x: 68, y: 57},
		padding: {x: 0, y: -13}
	},
	shadow: null
};