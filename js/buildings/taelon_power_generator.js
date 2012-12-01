function TaelonPowerBuilding(pos_x, pos_y, player)
{
	this._proto = TaelonPowerBuilding;
	this.player = player;
	this.health = this._proto.health_max;
	
	this._taelon = 0;
	this._taelon_max = 1000;
	
	//Building animation
	this._draw_last_frame_change = 0;
	this._draw_cur_frame = 0;
	this._draw_from_to_pos = [1,2,3,2];
	
	this.setPosition(pos_x, pos_y);
	this.setActionTime(this._proto.build_time);
	
	this.run = function()
	{
		switch (this.state)
		{
			case 'CONSTRUCTION':
				this._runStandartConstruction();
				break;
				
			case 'SELL':
				this._runStandartSell();
				break;
		}
	}
	
	this.onConstructed = function() 
	{
		this._taelon = 500;
		game.players[this.player].energyAddMax(this._taelon);
	}
	
	this.onDestructed = function()
	{
		game.players[this.player].energyAddMax(-1*this._taelon);
	}
	
	//Custom animated draw function
	this.draw = function(cur_time)
	{
		if (this.state == 'CONSTRUCTION')
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
			game.objDraw.addElement(DRAW_LAYER_TBUILD, this.position.x, {
				res_key: this._proto.res_key,
				src_x: this._proto.image_size.x,
				src_y: 0,
				src_width: this._proto.image_size.x,
				src_height: this._proto.image_size.y,
				x: this.position.x - this._proto.image_padding.x - game.viewport_x,
				y: this.position.y - this._proto.image_padding.y - game.viewport_y
			});
		}
		else
		{
			game.objDraw.addElement(DRAW_LAYER_GBUILD, this.position.x, {
				res_key: this._proto.res_key,
				src_x: 0,
				src_y: this._proto.image_size.y,
				src_width: this._proto.image_size.x,
				src_height: this._proto.image_size.y,
				x: this.position.x - this._proto.image_padding.x - game.viewport_x,
				y: this.position.y - this._proto.image_padding.y - game.viewport_y
			});
			game.objDraw.addElement(DRAW_LAYER_TBUILD, this.position.x, {
				res_key: this._proto.res_key,
				src_x: this._draw_from_to_pos[this._draw_cur_frame]*this._proto.image_size.x,
				src_y: this._proto.image_size.y,
				src_width: this._proto.image_size.x,
				src_height: this._proto.image_size.y,
				x: this.position.x - this._proto.image_padding.x - game.viewport_x,
				y: this.position.y - this._proto.image_padding.y - game.viewport_y
			});
			if ((cur_time - this._draw_last_frame_change)>200)
			{
				++this._draw_cur_frame;
				this._draw_cur_frame %= 4;
				this._draw_last_frame_change = cur_time;
			}
		}
	}
	
	//Custom selection bar
	this.drawSelection = function(is_onmouse)
	{
		this._drawSelectionStandart(is_onmouse);
		
		var top_x = this.position.x - game.viewport_x + CELL_SIZE*this._proto.cell_size.x,
			top_y = this.position.y + CELL_SIZE*this._proto.cell_size.y - 57 - game.viewport_y, 
			taelon_h = parseInt((this._taelon/this._taelon_max)*58);
			
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y, 4, 60);
		
		if (this._taelon_max > this._taelon)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y + 1, 2, 58);
		}
		
		game.viewport_ctx.fillStyle = '#ffff00';
		game.viewport_ctx.fillRect(top_x + 1, top_y + 59 - taelon_h, 2, taelon_h);
	}
}

TaelonPowerBuilding.prototype = new AbstractBuilding();

TaelonPowerBuilding.res_key = 'taelon_power';
TaelonPowerBuilding.obj_name = 'Taelon Power Generator';
TaelonPowerBuilding.cost = 2000;
TaelonPowerBuilding.sell_cost = 1000;
TaelonPowerBuilding.health_max = 1000;
TaelonPowerBuilding.build_time = 20;
TaelonPowerBuilding.energy = 0;
TaelonPowerBuilding.enabled = true;
TaelonPowerBuilding.count = 0;

TaelonPowerBuilding.cell_size = {x: 4, y: 4};
TaelonPowerBuilding.cell_matrix = [0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1];
TaelonPowerBuilding.move_matrix = [0,0,0,0,0,1,0,0,0,1,1,0,0,1,0,0];
TaelonPowerBuilding.cell_padding = {x: 2, y: 1};
TaelonPowerBuilding.image_size = {x: 90, y: 123};
TaelonPowerBuilding.image_padding = {x: -4, y: 33};
TaelonPowerBuilding.require_building = [];

TaelonPowerBuilding.upgradable = false;

TaelonPowerBuilding.loadResources = function(){
	AbstractBuilding.loadResources(this);
};