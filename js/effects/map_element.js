function MapElement(x, y, type, config)
{
	this._position_cache = {};
	
	this.init = function()
	{
		var pos = MapCell.cellToPixel({x: x, y: y});
		this._position_cache.body = {x: pos.x - config.padding.x, y: pos.y - config.padding.y};
		this._position_cache.draw_line = pos.y;
		if (config.shadow)
			this._position_cache.shadow = {x: pos.x - config.shadow_padding.x, y: pos.y - config.shadow_padding.y};
	};
	
	this.draw = function()
	{
		var top_x = this._position_cache.body.x - game.viewport_x, top_y = this._position_cache.body.y - game.viewport_y;
		
		game.objDraw.addElement(DRAW_LAYER_GUNIT, this._position_cache.draw_line, {
			res_key: 'mapobj_' + type,
			src_x: 0,
			src_y: 0,
			src_width: config.image.x,
			src_height: config.image.y,
			x: top_x,
			y: top_y
		});
		
		if (config.shadow)
		{
			top_x = this._position_cache.shadow.x - game.viewport_x, top_y = this._position_cache.shadow.y - game.viewport_y;
		
			game.objDraw.addElement(DRAW_LAYER_SHADOWS, this._position_cache.draw_line, {
				res_key: 'mapobj_' + type + '_shadow',
				src_x: 0,
				src_y: 0,
				src_width: config.shadow.x,
				src_height: config.shadow.y,
				x: top_x,
				y: top_y
			});
		}
	};
	
	this.init();
}

MapElement.addStatic = function(ctx, x, y, type, config)
{
	var pos = MapCell.cellToPixel({x: x, y: y});
	ctx.drawImage(
		game.resources.get('mapobj_' + type), 
		pos.x - config.padding.x,
		pos.y - config.padding.y
	);
};