var InterfaceMinimap = {
	_state_is_red: false,
	_viewport_ctx: null,
	_objects_ctx: null,
	
	init: function(level_data)
	{
		this._viewport_ctx = $('#minimap_viewport').get(0).getContext('2d');
		this._objects_ctx = $('#minimap_objects').get(0).getContext('2d', {
			willReadFrequently: true
		});
		
		$('#minimap_viewport, #minimap_objects')
			.attr('width', level_data.minimap.x)
			.attr('height', level_data.minimap.y);

		$('#minimap_viewport').on('mousedown touchstart', function(event){
			event.preventDefault();
			game.minimapNavigation(true);
			MousePointer.getEventPosition(event, this)
			game.minimapMove(event.offsetX, event.offsetY);
		});

		$('#minimap_viewport').on('mousemove touchmove', function(event){
			event.preventDefault();
			MousePointer.getEventPosition(event, this)
			game.minimapMove(event.offsetX, event.offsetY);
		});

		$('#minimap_viewport').on('mouseup touchend', function(event){
			event.preventDefault();
			game.minimapNavigation(false);
		});

		$('#minimap_viewport').on('mouseleave touchcancel', function(event){
			event.preventDefault();
			game.minimapNavigation(false);
		});
	},
	
	drawViewport: function()
	{
		if (!this._viewport_ctx)
			return

		this._viewport_ctx.clearRect(
			0, 0, 
			CurrentLevel.minimap.x, CurrentLevel.minimap.y
		);

		this._viewport_ctx.strokeStyle = '#ffffff';
		this._viewport_ctx.lineWidth = 1.5;

		var minimap_ratio = {
			x: CurrentLevel.size.x/CurrentLevel.minimap.x,
			y: CurrentLevel.size.y/CurrentLevel.minimap.y,
		};

		var minimap_rect = {
			x: (minimap_ratio.x*CELL_SIZE),
			y: (minimap_ratio.y*CELL_SIZE),
			width: CurrentLevel.minimap.rect_x,
			height: CurrentLevel.minimap.rect_x
		}

		var minimapZoom = .00225;
		var mimimapRect = {
			x: parseInt(game.viewport_x/minimap_rect.x) + 0.5,  
			y: parseInt(game.viewport_y/minimap_rect.y) + 0.5, 
			width: minimap_rect.width * (VIEWPORT_SIZE_X * minimapZoom), 
			height: minimap_rect.height * (VIEWPORT_SIZE_Y * minimapZoom)
		}

		/*
		this._viewport_ctx.strokeRect(
			mimimapRect.x, mimimapRect.y,
			mimimapRect.width, mimimapRect.height
		);
		*/

		this._viewport_ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
		this._viewport_ctx.fillRect(
			mimimapRect.x, mimimapRect.y,
			mimimapRect.width, mimimapRect.height
		);
	},
	
	drawObjects: function()
	{	
		if (!this._objects_ctx)
			return

		var i, pos, x, y, cell_on_mini = CurrentLevel.minimap.x / CurrentLevel.size.x;
		
		if (this._state_is_red)
			return;
		
		this._objects_ctx.drawImage(game.resources.get('minimap'), 0, 0);
		
		for (i in game.objects)
		{
			if (game.objects[i].is_effect)
				continue;
			
			pos = game.objects[i].getCell();
			x = parseInt((pos.x / CurrentLevel.size.x) * CurrentLevel.minimap.x);
			y = parseInt((pos.y / CurrentLevel.size.y) * CurrentLevel.minimap.y);
			this._objects_ctx.fillStyle = game.players[game.objects[i].player].getMapColor();
				
			if (game.objects[i].is_building)
			{
				this._objects_ctx.fillRect(
					x, y, 
					Math.round(game.objects[i]._proto.cell_size.x*cell_on_mini), 
					Math.round(game.objects[i]._proto.cell_size.y*cell_on_mini)
				); 
			}
			else
			{
				if (CurrentLevel.map_cells[pos.x][pos.y].fog > 0)
					this._objects_ctx.fillRect(x, y, 1, 1); 
			}
		}
		
		this._drawFogShroud();
	},
	
	switchState: function()
	{
		if (game.players[PLAYER_HUMAN].energyLow())
		{
			if (!this._state_is_red)
			{
				this._drawRedMap();
				this._state_is_red = true;
			}
		}
		else
			this._state_is_red = false;
	},
	
	_drawRedMap: function()
	{
		if (!this._objects_ctx)
			return

		this._objects_ctx.drawImage(
			game.resources.get('minimap'), 
			CurrentLevel.minimap.x, 0, CurrentLevel.minimap.x, CurrentLevel.minimap.y,
			0, 0, CurrentLevel.minimap.x, CurrentLevel.minimap.y
		);
			
		this._drawFogShroud();
	},
		
	_drawFogShroud: function()
	{
		if (!this._objects_ctx)
			return

		var x, y, x_prop = CurrentLevel.minimap.x / CurrentLevel.size.x, y_prop = CurrentLevel.minimap.y / CurrentLevel.size.y, cur_position = 0;
		var cell, img = this._objects_ctx.getImageData(0, 0, CurrentLevel.minimap.x, CurrentLevel.minimap.y);
		
		for (y = 0; y < CurrentLevel.minimap.y; ++y)
		{
			for (x = 0; x < CurrentLevel.minimap.x; ++x)
			{
				cell = CurrentLevel.map_cells[parseInt(x/x_prop)][parseInt(y/y_prop)];
				if (cell.shroud == 1)
				{
					img.data[cur_position] = 0;
					img.data[cur_position + 1] = 0;
					img.data[cur_position + 2] = 0;
				}
				else if (cell.fog == 0)
				{
					img.data[cur_position] *= 0.7;
					img.data[cur_position + 1] *= 0.7;
					img.data[cur_position + 2] *= 0.7;
				}
				cur_position += 4;
			}
		}
		this._objects_ctx.putImageData(img, 0, 0);
	}
};