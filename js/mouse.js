function MousePointer(game)
{
	this.type = 0; //0 - simple
	this.show_cursor = false;
	this.position = {x: 0, y: 0};
	
	this.draw_time = 0;
	this.draw_frame = 0;
	
	this.is_selection = false;
	this.selection_start_pos = {};
	
	game.resources.addImage('cursors', 'images/cursors.png');
	
	this.draw = function(current_time)
	{
		if (!this.show_cursor)
			return;
		
		//Selection draw
		if (this.is_selection)
		{
			var sel_size = this._getSelectionSize();
			
			game.viewport_ctx.strokeStyle = '#fff';
			game.viewport_ctx.lineWidth = 1;
			game.viewport_ctx.strokeRect(
				this.selection_start_pos.x - game.viewport_x, 
				this.selection_start_pos.y - game.viewport_y, 
				sel_size.width, sel_size.height);
			
			if (Math.abs(sel_size.width)>3 || Math.abs(sel_size.height)>3)
			{
				game.viewport_ctx.drawImage(game.resources.get('cursors'), 0, 0, 17, 24, this.position.x, this.position.y, 17, 24);
				return;
			}
		}
		
		//Cursor draw
		var pos = this.getCellPosition(), ptype;
		if (game.action_state != ACTION_STATE_NONE)
		{
			switch (game.action_state)
			{
				case ACTION_STATE_SELL:
					this._drawCursor(current_time, 6, 6);
					break;
				case ACTION_STATE_POWER:
					this._drawCursor(current_time, 5, 8);
					break;
				case ACTION_STATE_BUILD:
					AbstractBuilding.drawBuildMouse(game.action_state_options.object, pos.x, pos.y);
					this._drawCursor(current_time, 7, 1);
					break;
				case ACTION_STATE_REPAIR:
					this._drawCursor(current_time, 8, 9);
					break;
				case ACTION_STATE_ATTACK:
					if (game.selected_info.is_can_attack)
						this._drawCursor(current_time, 3, 8);
					else
						this._drawCursor(current_time, 4, 2);
					break;
			}
		}
		else if (MapCell.getSingleUserId(game.level.map_cells[pos.x][pos.y]) != -1)
		{
			this._drawCursor(current_time, 1, 8);
		}
		else if (game.selected_objects.length>0 && !game.selected_info.is_building)
		{
			ptype = game.level.map_cells[pos.x][pos.y].type
			if (!game.selected_info.is_fly && (ptype==2 || ptype==3))
				this._drawCursor(current_time, 4, 2);
			else
				this._drawCursor(current_time, 2, 7);
		}
		else
		{
			//Normal cursor
			this.draw_frame = 0;
			game.viewport_ctx.drawImage(game.resources.get('cursors'), 0, 0, 17, 24, this.position.x, this.position.y, 17, 24);
		}
	}
	
	this._drawCursor = function(current_time, cursorid, frames)
	{
		if ((current_time - this.draw_time) > 100)
		{
			this.draw_frame = ((this.draw_frame + 1) % frames);
			this.draw_time = current_time;
		}
		game.viewport_ctx.drawImage(
			game.resources.get('cursors'), this.draw_frame*32, cursorid*32, 32, 32, 
			this.position.x - 16, this.position.y - 16, 32, 32
		);
	}
	
	this.getCellPosition = function()
	{
		return {
			x: Math.floor((this.position.x + game.viewport_x)/CELL_SIZE), 
			y: Math.floor((this.position.y + game.viewport_y)/CELL_SIZE)
		};
	}
	
	this.selectionStart = function()
	{
		switch (game.action_state)
		{
			case ACTION_STATE_NONE:
				this.is_selection = true;
				this.selection_start_pos = {
					x: game.viewport_x + this.position.x + 0.5,
					y: game.viewport_y + this.position.y + 0.5
				};
				break;
		}
	}
	
	this.selectionStop = function()
	{
		this.is_selection = false;
		
		switch (game.action_state)
		{
			case ACTION_STATE_NONE:
				var sizes = this._getSelectionSize();
		
				if (Math.abs(sizes.width)<4 && Math.abs(sizes.height)<4)
					game.onClick('left');
				else
				{
					var start_x = Math.floor(this.selection_start_pos.x/CELL_SIZE), 
						start_y = Math.floor(this.selection_start_pos.y/CELL_SIZE), 
						cur_pos = this.getCellPosition();

					game.regionSelect(Math.min(start_x, cur_pos.x), Math.min(start_y, cur_pos.y), Math.max(start_x, cur_pos.x), Math.max(start_y, cur_pos.y));
				}
				break;
			
			case ACTION_STATE_BUILD:
				var pos = this.getCellPosition();
				if (AbstractBuilding.canBuild(game.action_state_options.object, pos.x, pos.y, game.selected_objects[0]))
				{
					game.objects[game.selected_objects[0]].build(pos.x, pos.y, game.action_state_options.object);
					game.cleanActionState();
				}
				else
					game.resources.get('cant_build').play();
				break;
				
			case ACTION_STATE_SELL:
				var pos = this.getCellPosition();
				if (game.level.map_cells[pos.x][pos.y].building != -1)
					game.objects[game.level.map_cells[pos.x][pos.y].building].sell();
				break;
		}
	}
	
	this._getSelectionSize = function()
	{
		return {
			width: game.viewport_x + this.position.x - this.selection_start_pos.x + 0.5,
			height: game.viewport_y + this.position.y - this.selection_start_pos.y + 0.5
		};
	}
}