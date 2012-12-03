function TaelonMineBuilding(pos_x, pos_y, player)
{
	this._proto = TaelonMineBuilding;
	this.player = player;
	
	this._taelon_level = 500;
	this._taelon_level_max = 500;
	
	this.init(pos_x, pos_y);
	
	this.run = function() {}
	
	this.draw = function()
	{
		game.objDraw.addElement(DRAW_LAYER_GBUILD, this.position.x, {
			res_key: this._proto.res_key,
			src_x: 0,
			src_y: 0,
			src_width: this._proto.image_size.x,
			src_height: this._proto.image_size.y,
			x: this.position.x - this._proto.image_padding.x - game.viewport_x,
			y: this.position.y - this._proto.image_padding.y - game.viewport_y
		});
	}
	
	//Custom selection bar
	this.drawSelection = function(is_onmouse)
	{
		this._drawSelectionStandart(is_onmouse);
		
		var top_x = this.position.x - game.viewport_x + CELL_SIZE*this._proto.cell_size.x,
			top_y = this.position.y + CELL_SIZE*this._proto.cell_size.y - 33 - game.viewport_y, 
			water_h = parseInt((this._taelon_level/this._taelon_level_max)*34);
			
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y, 4, 36);
		
		if (this._taelon_level_max > this._taelon_level)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y + 1, 2, 34);
		}
		
		game.viewport_ctx.fillStyle = '#ffff00';
		game.viewport_ctx.fillRect(top_x + 1, top_y + 35 - water_h, 2, water_h);
	}
}

AbstractBuilding.setBuildingCommonOptions(TaelonMineBuilding);

TaelonMineBuilding.res_key = 'taelon_mine';
TaelonMineBuilding.obj_name = 'Taelon';

TaelonMineBuilding.cell_size = {x: 3, y: 3};
TaelonMineBuilding.cell_matrix = [1,1,1,1,1,1,1,1,1];
TaelonMineBuilding.move_matrix = [0,0,0,0,0,0,0,0,0];
TaelonMineBuilding.cell_padding = {x: 0, y: 0};
TaelonMineBuilding.image_size = {x: 68, y: 57};
TaelonMineBuilding.image_padding = {x: 0, y: -13};