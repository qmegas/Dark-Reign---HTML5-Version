var CM_ITEMS_COUNT = 15;
var CM_VIEW_UNITS = 1;
var CM_VIEW_BUILDINGS = 2;

var InterfaceConstructManager = {
	available_units: [],
	available_buildings: [],
	all_buildings: [],
	
	current_view_type: CM_VIEW_UNITS,
	current_view_offset: 0,
	unit_offset: 0,
	building_offset: 0,
	
	_popup_ctx: null,
	
	init: function(units, buildings)
	{
		
		this._popup_ctx = $('#cell_popup').get(0).getContext('2d');
	
		this.current_view_type = CM_VIEW_UNITS;
		this.current_view_offset = 0;
		this.unit_offset = 0;
		this.building_offset = 0;
		
		this.available_buildings = []
		this.available_units = units[PLAYER_HUMAN];
		this.all_buildings = buildings[PLAYER_HUMAN];

		for (var i in this.all_buildings)
			if (this.all_buildings[i].can_build)
				this.available_buildings.push(this.all_buildings[i]);

		//Clear Units in productions
		ProducingQueue.init()

		if (!$('#tab_button_build').hasClass('active'))
			$('#tab_button_build').click();
	},
	
	pageUp: function()
	{
		var offset = (this.current_view_type == CM_VIEW_UNITS) ? this.unit_offset : this.building_offset;
		
		offset -= CM_ITEMS_COUNT;
		if (offset < 0)
			offset = 0;
		
		if (this.current_view_type == CM_VIEW_UNITS)
		{
			this.unit_offset = offset;
			this.drawUnits();
			this._drawUnitProductionState();
		}
		else
		{
			this.building_offset = offset;
			this.drawBuildings();
		}
	},
	
	pageDown: function()
	{
		var offset = (this.current_view_type == CM_VIEW_UNITS) ? this.unit_offset : this.building_offset,
			total = (this.current_view_type == CM_VIEW_UNITS) ? this.available_units.length : this.available_buildings.length;
		
		offset += CM_ITEMS_COUNT;
		if ((offset + CM_ITEMS_COUNT - total) > 2)
			offset = Math.ceil((total - CM_ITEMS_COUNT) / 3)*3;
		if (offset < 0)
			offset = 0;
		
		if (this.current_view_type == CM_VIEW_UNITS)
		{
			this.unit_offset = offset;
			this.drawUnits();
			this._drawUnitProductionState();
		}
		else
		{
			this.building_offset = offset;
			this.drawBuildings();
		}
	},
	
	recalcUnitAvailability: function(player_id)
	{
		var units = this._checkArrayAvailability(this.available_units, player_id);
		var buildings = this._checkArrayAvailability(this.available_buildings, player_id);
		
		this._checkUpgrade(player_id);
		
		if (player_id == PLAYER_HUMAN)
		{
			if (units.is_new && game.started)
				InterfaceSoundQueue.addSound('new_units_available');
			
			if (units.is_changed || buildings.is_changed)
				this._drawCells();
		}
	},
	
	_checkUpgrade: function(player_id)
	{
		var i, j, obj, new_state, new_upgrade = false;
		
		for (i=0; i<this.all_buildings.length; ++i)
		{
			if (this.all_buildings[i].upgradable)
			{
				new_state = true;
				obj = this.all_buildings[i].upgrade_to;
				
				for (j=0; j<obj.require_building.length; ++j)
					if (obj.require_building[j].count[player_id] == 0)
					{
						new_state = false;
						break;
					}
					
				if (this.all_buildings[i].can_upgrade_now[player_id] != new_state)
				{
					this.all_buildings[i].can_upgrade_now[player_id] = new_state;
					if (new_state)
						new_upgrade = true;
				}
			}
		}
		
		if (new_upgrade && game.started && (player_id == PLAYER_HUMAN))
			InterfaceSoundQueue.addSound('upgrade_available');
	},
	
	_checkArrayAvailability: function(arr, player_id)
	{
		var i, j, obj, have_new = false, have_changes = false, cur_enabled;
		
		for (i=0; i<arr.length; ++i)
		{
			obj = arr[i];
			cur_enabled = true;
				
			for (j=0; j<obj.require_building.length; ++j)
				if (obj.require_building[j].count[player_id] == 0)
				{
					cur_enabled = false;
					break;
				}
				
			if (obj.enabled[player_id] != cur_enabled)
			{
				if (!obj.enabled[player_id])
					have_new = true;
				
				obj.enabled[player_id] = cur_enabled;
				have_changes = true;
			}
		}
		
		return {is_changed: have_changes, is_new: have_new};
	},
	
	drawUnits: function()
	{
		this.removeCellSelection();
		this.current_view_type = CM_VIEW_UNITS;
		this._drawCells();
		
		//Check upgrade button state
		if (game.selected_info.is_building && game.objects[game.selected_objects[0]]._proto.upgradable)
			$('#upgrade_button').removeClass('disable');
	},
	
	drawBuildings: function()
	{
		this.removeCellSelection();
		this.current_view_type = CM_VIEW_BUILDINGS;
		this._drawCells();
	},
	
	_drawCells: function()
	{
		var offset = 0;
		
		if (this.current_view_type == CM_VIEW_BUILDINGS)
		{
			this._clearAllCellCanvases();
			offset = this.building_offset;
		}
		else
			offset = this.unit_offset;
		
		for (var i = offset; i<offset+CM_ITEMS_COUNT; ++i)
		{
			switch (this.current_view_type)
			{
				case CM_VIEW_UNITS:
					if (!this.available_units[i])
						this._drawCellEmpty(i-offset);
					else
					{
						this._drawCell(
							i-offset, 
							'images/units/' + this.available_units[i].resource_key + '/box.png', 
							this.available_units[i].enabled[PLAYER_HUMAN],
							!AbstractBuilding.canSelectedProduce(this.available_units[i])
						);
						if (this.available_units[i].producing_count > 0)
							this._canvasRedraw(i-offset);
					}
					break;
				case CM_VIEW_BUILDINGS:
					if (!this.available_buildings[i])
						this._drawCellEmpty(i-offset);
					else
						this._drawCell(
							i-offset, 
							'images/buildings/' + CurrentLevel.theme + '/' + this.available_buildings[i].res_key + '/box.png', 
							this.available_buildings[i].enabled[PLAYER_HUMAN],
							false
						);
					break;
			}
		}
	},
	
	_drawCellEmpty: function(cell)
	{
		$('#unit_box'+cell).css('background-image', 'url(images/units/empty_unit_box.png)');
	},
	
	_drawCell: function(cell, path, enabled, is_blue)
	{
		var style;
			
		if (enabled)
			style = (is_blue) ? '-99px 2px' : '-45px 2px';
		else
			style = '9px 2px';
		
		$('#unit_box'+cell).css({
			'background-image': 'url('+path+')',
			'background-position': style
		});
	},
	
	removeCellSelection: function()
	{
		$('.unit-image.active').removeClass('active');
		$('#upgrade_button').addClass('disable');
		$('#cell_popup').hide();
	},
	
	cellClick: function(cell_id, button)
	{
		var offset = (this.current_view_type == CM_VIEW_UNITS) ? this.unit_offset : this.building_offset,
			i = offset + parseInt(cell_id);
		
		if (this.current_view_type == CM_VIEW_BUILDINGS)
		{
			if (typeof this.available_buildings[i] == 'undefined')
				return;
			if (!this.available_buildings[i].enabled[PLAYER_HUMAN])
			{
				game.resources.play('cant_build');
				return;
			}
			if (!game.players[PLAYER_HUMAN].haveEnoughMoney(this.available_buildings[i].cost))
			{
				game.resources.play('cant_build');
				InterfaceSoundQueue.addIfEmpty('insufficient_credits');
				return;
			}
			
			this.removeCellSelection();
			$('#unit_box'+cell_id).children('.unit-image').addClass('active');
			game.action_state = ACTION_STATE_BUILD;
			game.action_state_options = {
				object: this.available_buildings[i],
				requested_unit: game.selected_objects[0]
			};
		}
		else
		{
			if (typeof this.available_units[i] == 'undefined')
				return;
			
			if (button == 'left')
				ProducingQueue.addProduction(this.available_units[i]);
			else
				ProducingQueue.pauseProduction(this.available_units[i]);
			
			this._canvasRedraw(i - offset);
		}
	},
	
	cellPopupPrepere: function(cell_id)
	{
		var offset = (this.current_view_type == CM_VIEW_UNITS) ? this.unit_offset : this.building_offset,
			i = offset + parseInt(cell_id), obj;
		
		this._clearPopup();
		
		if (this.current_view_type == CM_VIEW_BUILDINGS)
		{
			if (typeof this.available_buildings[i] == 'undefined')
				return;
			
			obj = this.available_buildings[i];
		}
		else
		{
			if (typeof this.available_units[i] == 'undefined')
				return;
			
			obj = this.available_units[i];
		}
		
		this._drawPopup(obj);
	},
	
	upgradePopupPrepere: function()
	{
		this._clearPopup();
		if (game.selected_info.is_building && game.objects[game.selected_objects[0]]._proto.upgradable)
			this._drawPopup(game.objects[game.selected_objects[0]]._proto.upgrade_to);
	},
	
	_clearPopup: function()
	{
		this._popup_ctx.clearRect(0, 0, 400, 200);
	},
	
	_drawPopup: function(obj)
	{
		var MAX_X = 400;
		var i, text;
		
		text = obj.obj_name + ' ' + obj.cost + 'c';
		
		//Draw name
		var text_size = game.fontDraw.getSize(text) + 4, left = MAX_X - text_size - 13;
		
		this._popup_ctx.fillStyle = '#07f4ff';
		this._popup_ctx.fillRect(MAX_X - 15 - text_size, 0, text_size + 2, 18);
		this._popup_ctx.fillStyle = '#000000';
		this._popup_ctx.fillRect(MAX_X - 14 - text_size, 1, text_size, 16);
		
		this._popup_ctx.lineWidth = 1;
		this._popup_ctx.strokeStyle = '#07b4b4';
		
		this._popup_ctx.beginPath();
		this._popup_ctx.moveTo(MAX_X - 15 - text_size, 17.5);
		this._popup_ctx.lineTo(MAX_X - 13.5, 17.5);
		this._popup_ctx.lineTo(MAX_X - 13.5, 0);
		this._popup_ctx.moveTo(MAX_X - 13.5, 10.5);
		this._popup_ctx.lineTo(MAX_X, 10.5);
		this._popup_ctx.stroke();
		
		game.fontDraw.drawOnCanvas(text, this._popup_ctx, MAX_X - 12.5 - text_size, 2.5, 'green');
		
		//Draw required
		var texts = [], max_text_size = 0;
		text_size = 0;
		if (obj.enabled[PLAYER_HUMAN])
			return;
		
		for (i in obj.require_building)
			if (obj.require_building[i].count[PLAYER_HUMAN] == 0)
				texts.push(obj.require_building[i].obj_name);
		if (texts.length == 0)
			return;
		
		for (i=0; i<texts.length; ++i)
		{
			text_size = game.fontDraw.getSize(texts[i]);
			if (text_size > max_text_size)
				max_text_size = text_size;
		}
		
		max_text_size += 4;
		var box_height = texts.length*15 + 3;
		
		this._popup_ctx.fillStyle = '#07f4ff';
		this._popup_ctx.fillRect(left - 15 - max_text_size, 0, max_text_size + 2, box_height);
		this._popup_ctx.fillStyle = '#000000';
		this._popup_ctx.fillRect(left - 14 - max_text_size, 1, max_text_size, box_height - 2);
		
		this._popup_ctx.strokeStyle = '#07b4b4';
		this._popup_ctx.beginPath();
		this._popup_ctx.moveTo(left - 15 - max_text_size, box_height - 0.5);
		this._popup_ctx.lineTo(left - 13.5, box_height - 0.5);
		this._popup_ctx.lineTo(left - 13.5, 0.5);
		this._popup_ctx.moveTo(left - 13.5, 10.5);
		this._popup_ctx.lineTo(left - 2, 10.5);
		this._popup_ctx.stroke();
		
		for (i=0; i<texts.length; ++i)
			game.fontDraw.drawOnCanvas(texts[i], this._popup_ctx, left - 12.5 - max_text_size, i*15 + 2.5, 'red');
	},
	
	redrawProductionState: function()
	{
		ProducingQueue.run();
		
		if (this.current_view_type == CM_VIEW_BUILDINGS)
			return;
		
		this._drawUnitProductionState();
	},
		
	_drawUnitProductionState: function()
	{
		var i, index;
		
		this._clearAllCellCanvases();
		
		for (i = 0; i<CM_ITEMS_COUNT; ++i)
		{
			index = this.unit_offset + i;
			if (!this.available_units[index])
				return;
			
			this._canvasRedraw(i);
		}
	},
	
	_canvasRedraw: function(index)
	{
		var to_point, txt, prog,
			offset = (this.current_view_type == CM_VIEW_UNITS) ? this.unit_offset : this.building_offset,
			obj = this.available_units[offset + index], 
			ctx = $('#cell_canvas_' + index).get(0).getContext('2d');
		
		if (obj.producing_count == 0)
			return;
		
		ctx.clearRect(0, 0, 64, 50);
		
		prog = obj.producing_progress/obj.construction_time;
		if (prog > 0 && prog < 1)
		{
			to_point = Math.PI*1.5 - (1-prog)*2*Math.PI;

			ctx.fillStyle = 'rgba(245, 255, 220, 0.55)';
			ctx.beginPath();
			ctx.moveTo(32, 25);
			ctx.arc(32, 25, 50, Math.PI*1.5, to_point, true); 
			ctx.moveTo(32, 25);
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
			ctx.beginPath();
			ctx.moveTo(32, 25);
			ctx.arc(32, 25, 50, to_point - 0.1, to_point + 0.1, false); 
			ctx.moveTo(32, 25);
			ctx.closePath();
			ctx.fill();
		}
		
		txt = obj.producing_count.toString();
		if (obj.producing_paused)
			txt += ' [P]';
		game.fontDraw.drawOnCanvas(txt, ctx, 13, 2, 'yellow');
	},
	
	clearProducingByObject: function(obj)
	{
		var i, index;
		
		if (this.current_view_type == CM_VIEW_BUILDINGS)
			return;
		
		for (i = 0; i<CM_ITEMS_COUNT; ++i)
		{
			index = this.unit_offset + i;
			if (!this.available_units[index])
				return;
			
			if (this.available_units[index] == obj)
				$('#cell_canvas_' + i).get(0).getContext('2d').clearRect(0, 0, 64, 50);
		}
	},
	
	_clearAllCellCanvases: function()
	{
		for (var i = 0; i<CM_ITEMS_COUNT; ++i)
			$('#cell_canvas_' + i).get(0).getContext('2d').clearRect(0, 0, 64, 50);
	}
};