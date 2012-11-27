function MiniMap()
{
	this.viewport_ctx = $('#minimap_viewport').get(0).getContext('2d');
	this.objects_ctx = $('#minimap_objects').get(0).getContext('2d');
	
	this.drawViewport = function()
	{
		this.viewport_ctx.clearRect(0, 0, game.level.minimap.x, game.level.minimap.y);
		this.viewport_ctx.strokeStyle = '#ffffff';
		this.viewport_ctx.lineWidth = 1;
		this.viewport_ctx.strokeRect(
			parseInt(game.viewport_x/(game.level.size.x/game.level.minimap.x*CELL_SIZE)) + 0.5,  
			parseInt(game.viewport_y/(game.level.size.y/game.level.minimap.y*CELL_SIZE)) + 0.5, 
			game.level.minimap.rect_x, 
			game.level.minimap.rect_y
		);
	}
	
	this.drawObjects = function()
	{
		var i, pos, x, y, cell_on_mini = game.level.minimap.x / game.level.size.x;
		
		this.objects_ctx.drawImage(game.resources.get('minimap'), 0, 0);
		
		for (i in game.objects)
		{
			pos = game.objects[i].getCell();
			x = parseInt((pos.x / game.level.size.x) * game.level.minimap.x);
			y = parseInt((pos.y / game.level.size.y) * game.level.minimap.y);
			this.objects_ctx.fillStyle = game.players[game.objects[i].player].getMapColor();
				
			if (game.objects[i].is_building)
				this.objects_ctx.fillRect(
					x, y, 
					Math.round(game.objects[i]._proto.cell_size.x*cell_on_mini), 
					Math.round(game.objects[i]._proto.cell_size.y*cell_on_mini)
				); 
			else
				this.objects_ctx.fillRect(x, y, 1, 1); 
		}
	}
}