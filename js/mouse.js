var Cursor = {
	SELECT: [1, 8],
	MOVE: [2, 7],
	ATTACK: [3, 8],
	STOP: [4, 2],
	POWER: [5, 8],
	SELL: [6, 6],
	HAND: [7, 1],
	REPAIR: [8, 9],
	HARVEST: [9, 8],
	TOHEAL: [10, 5],
	NOPAN_R: [11, 4],
	NOPAN_L: [12, 4],
	NOPAN_D: [13, 4],
	NOPAN_U: [14, 4],
	PANNING_RD: [15, 7],
	PANNING_LD: [16, 7],
	PANNING_RU: [17, 7],
	PANNING_LU: [18, 7],
	PANNING_R: [19, 7],
	PANNING_L: [20, 7],
	PANNING_D: [21, 7],
	PANNING_U: [22, 7],
	TOREPAIR: [23, 5],
	EXTRACT: [24, 10],
	ENTER: [25, 12],
	TELEPORT: [26, 11],
	REARM: [27, 12]
};

var MousePointer = {
	type: 0, //0 - simple
	show_cursor: false,
	position: {x: 0, y: 0},
	
	draw_time: 0,
	draw_frame: 0,
	
	is_selection: false,
	selection_start_pos: {},
	
	panning_region_time: 0,
	direction_to_cursor: [
		Cursor.PANNING_LU, 
		Cursor.PANNING_L, 
		Cursor.PANNING_LD, 
		0, 
		Cursor.PANNING_U, 
		0, 
		Cursor.PANNING_D, 
		0, 
		Cursor.PANNING_RU, 
		Cursor.PANNING_R,
		Cursor.PANNING_RD
	],

	mouse_ctx: null,

	init: function()
	{
		this.mouse_ctx = document.getElementById('mouseview').getContext('2d');
	},

	clearView: function()
	{
		this.mouse_ctx.clearRect(0, 0, VIEWPORT_SIZE, VIEWPORT_SIZE);
	},
	
	setPosition: function(event)
	{
		this.show_cursor = true;
		this.position = {
			x: event.offsetX, 
			y: event.offsetY
		};
	},
	
	draw: function(current_time)
	{
		if (!this.show_cursor)
		{
			this.panning_region_time = current_time;
			return;
		}
		
		//Selection draw
		if (this.is_selection)
		{
			var sel_size = this._getSelectionSize();

			this.mouse_ctx.strokeStyle = '#fff';
			this.mouse_ctx.lineWidth = 1;
			this.mouse_ctx.strokeRect(
				this.selection_start_pos.x - game.viewport_x, 
				this.selection_start_pos.y - game.viewport_y, 
				sel_size.width, sel_size.height);
			
			if (Math.abs(sel_size.width)>3 || Math.abs(sel_size.height)>3)
			{
				this.mouse_ctx.drawImage(game.resources.get('cursors'), 0, 0, 17, 24, this.position.x, this.position.y, 17, 24);
				return;
			}
		}
		
		//Cursor draw
		
		if (game.debug.mouse_panning)
		{
			var move_x = 0, move_y = 0, cur_icon;
			
			if (this.position.x < PANNING_FIELD_SIZE)
				move_x = -1;
			else if (this.position.x > (VIEWPORT_SIZE - PANNING_FIELD_SIZE))
				move_x = 1;
			else
				game.viewport_move_mouse_x = 0;
			
			if (this.position.y < PANNING_FIELD_SIZE)
				move_y = -1;
			else if (this.position.y > (VIEWPORT_SIZE - PANNING_FIELD_SIZE))
				move_y = 1;
			else
				game.viewport_move_mouse_y = 0;
			
			if (move_x!=0 || move_y!=0)
			{
				if  (current_time > (this.panning_region_time + 500))
				{
					game.viewport_move_mouse_x = move_x;
					game.viewport_move_mouse_y = move_y;
					
					//check if can move
					if (move_x != 0)
						if ((move_x==-1 && game.viewport_x<=0) || (move_x==1 && game.viewport_x>=CurrentLevel.max_movement.x))
							move_x = 0;
					if (move_y != 0)
						if ((move_y==-1 && game.viewport_y<=0) || (move_y==1 && game.viewport_y>=CurrentLevel.max_movement.y))
							move_y = 0;
					
					//Draw move pointer
					if (move_x==0 && move_y==0)
					{
						if (game.viewport_move_mouse_y == -1)
							cur_icon = Cursor.NOPAN_U;
						else if (game.viewport_move_mouse_y == 1)
							cur_icon = Cursor.NOPAN_D;
						else if (game.viewport_move_mouse_x == -1)
							cur_icon = Cursor.NOPAN_L;
						else
							cur_icon = Cursor.NOPAN_R;
						return this._drawCursor(current_time, cur_icon);
					}
					
					return this._drawCursor(current_time, this.direction_to_cursor[(move_x+1)*4 + (move_y+1)]);
				}
			}
			else
				this.panning_region_time = current_time;
		}
		
		var pos = this.getCellPosition(), ptype;
		if (!MapCell.isCorrectCord(pos.x, pos.y))
			return this._drawNormalCursor();
		
		var objid = MapCell.isFogged(pos) ? -1 : MapCell.getSingleUserId(CurrentLevel.map_cells[pos.x][pos.y]);
		
		//Actions
		if (game.action_state != ACTION_STATE_NONE)
		{
			switch (game.action_state)
			{
				case ACTION_STATE_SELL:
					return this._drawCursor(current_time, Cursor.SELL);
				case ACTION_STATE_POWER:
					return this._drawCursor(current_time, Cursor.POWER);
				case ACTION_STATE_BUILD:
					pos.x -= game.action_state_options.object.cell_padding.x;
					pos.y -= game.action_state_options.object.cell_padding.y;
					AbstractBuilding.drawBuildMouse(game.action_state_options.object, pos.x, pos.y);
					return this._drawCursor(current_time, Cursor.HAND);
				case ACTION_STATE_REPAIR:
					return this._drawCursor(current_time, Cursor.REPAIR);
				case ACTION_STATE_ATTACK:
					if (this._checkAttackAbility(objid))
						return this._drawCursor(current_time, Cursor.ATTACK);
					return this._drawCursor(current_time, Cursor.STOP);
			}
		}
		
		//On object
		if (objid != -1)
		{
			if (game.objects[objid].is_building)
			{
				if (game.objects[objid].player != PLAYER_HUMAN)
					return this._drawCursor(current_time, Cursor.SELECT);
				
				if (
					game.objects[objid]._proto.is_bridge && 
					game.selected_objects.length>0 && 
					!game.selected_info.is_building && 
					CurrentLevel.map_cells[pos.x][pos.y].type==CELL_TYPE_EMPTY
				)
					return this._drawCursor(current_time, Cursor.MOVE);
				else if (game.selected_info.harvesters && game.objects[objid].isHarvestPlatform())
					return this._drawCursor(current_time, Cursor.HARVEST);
				else if (game.selected_info.humans && game.objects[objid].isHealer())
					return this._drawCursor(current_time, Cursor.TOHEAL);
				else if (
					game.selected_objects.length>0 &&
					!game.selected_info.humans && 
					!game.selected_info.is_building && 
					game.objects[objid].isFixer()
				)
					return this._drawCursor(current_time, Cursor.TOREPAIR);
				else if (game.selected_info.cyclones && game.objects[objid]._proto==RearmingDeckBuilding && game.objects[objid].state==BUILDING_STATE_NORMAL)
					return this._drawCursor(current_time, Cursor.REARM);
			}
			
			if (game.objects[objid].canCarry())
			{
				if (game.objects[objid].is_selected && game.objects[objid].haveInsideUnits())
					return this._drawCursor(current_time, Cursor.EXTRACT);
				if (game.selected_info.move_mode_min<=MOVE_MODE_HOVER && game.objects[objid].haveFreeSpace(game.selected_info.min_mass))
					return this._drawCursor(current_time, Cursor.ENTER);
			}
			
			if (game.objects[objid].player!=PLAYER_HUMAN && game.players[PLAYER_HUMAN].isEnemy(game.objects[objid].player))
			{
				if (this._checkAttackAbility(objid))
					return this._drawCursor(current_time, Cursor.ATTACK);
				else
					return this._drawCursor(current_time, Cursor.STOP);
			}
			
			return this._drawCursor(current_time, Cursor.SELECT);
		}
		
		//Ground
		if (game.selected_objects.length>0)
		{
			if (!game.selected_info.is_building)
			{
				if (MapCell.isShroud(pos))
					return this._drawCursor(current_time, Cursor.MOVE);
					
				ptype = CurrentLevel.map_cells[pos.x][pos.y].type;
				if ((ptype==CELL_TYPE_WATER && game.selected_info.move_mode==MOVE_MODE_GROUND) || (ptype==CELL_TYPE_NOWALK && game.selected_info.move_mode!=MOVE_MODE_FLY))
					return this._drawCursor(current_time, Cursor.STOP);
				else
					return this._drawCursor(current_time, Cursor.MOVE);
			}
			else
			{
				var obj = game.objects[game.selected_objects[0]];
				if (obj.isTeleport() && obj.canTeleport())
					return this._drawCursor(current_time, Cursor.TELEPORT);
			}
		}
		
		//Normal cursor
		this.draw_frame = 0;
		this._drawNormalCursor();
	},
		
	_drawNormalCursor: function()
	{
		this.mouse_ctx.drawImage(game.resources.get('cursors'), 0, 0, 17, 24, this.position.x, this.position.y, 17, 24);
	},
		
	_drawCursor: function(current_time, cursor)
	{
		if ((current_time - this.draw_time) > 100)
		{
			this.draw_frame = ((this.draw_frame + 1) % cursor[1]);
			this.draw_time = current_time;
		}
		this.mouse_ctx.drawImage(
			game.resources.get('cursors'), this.draw_frame*32, cursor[0]*32, 32, 32, 
			this.position.x - 16, this.position.y - 16, 32, 32
		);
			
		return true;
	},	
	
	getCellPosition: function()
	{
		return {
			x: Math.floor((this.position.x + game.viewport_x - 12)/CELL_SIZE),
			y: Math.floor((this.position.y + game.viewport_y - 12)/CELL_SIZE)
		};
	},
		
	selectionStart: function()
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
	},
		
	selectionStop: function()
	{
		var pos = this.getCellPosition(), unitid;
		
		this.is_selection = false;
		
		if (!MapCell.isCorrectCord(pos.x, pos.y))
			return;
		
		switch (game.action_state)
		{
			case ACTION_STATE_NONE:
				var sizes = this._getSelectionSize();
		
				if (Math.abs(sizes.width)<4 && Math.abs(sizes.height)<4)
				{
					unitid = MapCell.isFogged(pos) ? -1 : MapCell.getSingleUserId(CurrentLevel.map_cells[pos.x][pos.y]);
					
					if (unitid != -1)
					{
						if (game.objects[unitid].is_building)
						{
							//Is a bridge?
							if (
								game.objects[unitid]._proto.is_bridge && 
								game.selected_objects.length>0 && 
								!game.selected_info.is_building && 
								CurrentLevel.map_cells[pos.x][pos.y].type==CELL_TYPE_EMPTY)
							{
								game.moveSelectedUnits(pos);
								return;
							}
							
							if (game.objects[unitid].player == PLAYER_HUMAN)
							{
								//Is harvesting?
								if (game.selected_info.harvesters && game.objects[unitid].isHarvestPlatform())
								{
									for (var i in game.selected_objects)
										game.objects[game.selected_objects[i]].orderHarvest(game.objects[unitid], true);
									return;
								}

								//Rearm Cyclones
								if (game.selected_info.cyclones && game.objects[unitid]._proto==RearmingDeckBuilding && game.objects[unitid].state==BUILDING_STATE_NORMAL)
								{
									for (var i in game.selected_objects)
										game.objects[game.selected_objects[i]].orderRearm(game.objects[unitid], true);
									return;
								}

								//Is healing humans
								if (game.selected_info.humans && game.objects[unitid].isHealer())
								{
									for (var i in game.selected_objects)
										game.objects[game.selected_objects[i]].orderHeal(game.objects[unitid], (i==0));
									return;
								}

								//Is fixing vehical
								if (
									game.selected_objects.length>0 &&
									!game.selected_info.humans && 
									!game.selected_info.is_building && 
									game.objects[unitid].isFixer())
								{
									for (var i in game.selected_objects)
										game.objects[game.selected_objects[i]].orderFix(game.objects[unitid], (i==0));
									return;
								}
							}
						}
						
						//Carry unit/building
						if (game.objects[unitid].canCarry())
						{
							if (game.objects[unitid].is_selected && game.objects[unitid].haveInsideUnits())
							{
								game.objects[unitid].extractCarry();
								return;
							}
							if (game.selected_info.move_mode_min<=MOVE_MODE_HOVER && game.objects[unitid].haveFreeSpace(game.selected_info.min_mass))
							{
								for (var i in game.selected_objects)
									game.objects[game.selected_objects[i]].orderToCarry(game.objects[unitid], (i==0));
								return;
							}
						}
						
						//Attack enemy unit
						if (game.objects[unitid].player!=PLAYER_HUMAN && game.players[PLAYER_HUMAN].isEnemy(game.objects[unitid].player))
						{
							if (this._checkAttackAbility(unitid))
								this._actAttack(pos);
						}
					}
					else
					{
						//Teleport
						if (game.selected_info.is_building && game.objects[game.selected_objects[0]].isTeleport())
						{
							if (game.objects[game.selected_objects[0]].canTeleport())
							{
								game.objects[game.selected_objects[0]].teleport(pos);
								return;
							}
						}
					}
					
					//Move or select unit
					game.onClick('left');
				}
				else
				{
					var start_x = Math.floor(this.selection_start_pos.x/CELL_SIZE), 
						start_y = Math.floor(this.selection_start_pos.y/CELL_SIZE);

					game.regionSelect(Math.min(start_x, pos.x), Math.min(start_y, pos.y), Math.max(start_x, pos.x), Math.max(start_y, pos.y));
				}
				break;
			
			case ACTION_STATE_BUILD:
				pos.x -= game.action_state_options.object.cell_padding.x;
				pos.y -= game.action_state_options.object.cell_padding.y;
				if (AbstractBuilding.canBuild(game.action_state_options.object, pos.x, pos.y, game.selected_objects[0]))
				{
					game.objects[game.selected_objects[0]].orderBuild(pos.x, pos.y, game.action_state_options.object);
					game.cleanActionState();
				}
				else
					game.resources.play('cant_build');
				break;
				
			case ACTION_STATE_SELL:
				if (CurrentLevel.map_cells[pos.x][pos.y].building != -1)
					game.objects[CurrentLevel.map_cells[pos.x][pos.y].building].sell();
				break;
				
			case ACTION_STATE_REPAIR:
				if (CurrentLevel.map_cells[pos.x][pos.y].building != -1)
					game.objects[CurrentLevel.map_cells[pos.x][pos.y].building].repair();
				break;
				
			case ACTION_STATE_ATTACK:
				this._actAttack(pos);
				game.toggleActionState(ACTION_STATE_ATTACK);
				break;
		}
	},
		
	_actAttack: function(pos)
	{
		var target, unitid = MapCell.getSingleUserId(CurrentLevel.map_cells[pos.x][pos.y]);

		if (unitid == -1)
			target = {type: 'ground', x: pos.x*CELL_SIZE + 12, y: pos.y*CELL_SIZE + 12};
		else
			target = {type: 'object', objid: unitid};

		for (var i in game.selected_objects)
			game.objects[game.selected_objects[i]].orderAttack(target);
	},
		
	_getSelectionSize: function()
	{
		return {
			width: game.viewport_x + this.position.x - this.selection_start_pos.x + 0.5,
			height: game.viewport_y + this.position.y - this.selection_start_pos.y + 0.5
		};
	},
		
	loadResources: function()
	{
		game.resources.addImage('cursors', 'images/cursors.png');
	},
		
	_checkAttackAbility: function(objid)
	{
		if (game.selected_info.can_attack_ground)
		{
			if ((objid == -1) || game.objects[objid].is_building || (game.objects[objid]._proto.move_mode != MOVE_MODE_FLY))
				return true;
		}
		
		if (game.selected_info.can_attack_fly && (objid != -1) && !game.objects[objid].is_building && (game.objects[objid]._proto.move_mode == MOVE_MODE_FLY))
			return true;
		
		return false;
	}
};