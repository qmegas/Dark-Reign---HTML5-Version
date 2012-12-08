function ConstructManager(units, buildings)
{
	this.available_units = units;
	this.available_buildings = [];
	this.all_buildings = buildings;
	
	this.current_view_type = CONST_VIEW_DEFAULT;
	this.current_view_offset = 0;
	
	this._popup_ctx = $('#cell_popup').get(0).getContext('2d');
	
	//Constructor
	for (var i in buildings)
		if (buildings[i].can_build)
			this.available_buildings.push(buildings[i]);
	//Constructor end
	
	this.recalcUnitAvailability = function()
	{
		var units = this._checkArrayAvailability(this.available_units);
		var buildings = this._checkArrayAvailability(this.available_buildings);
		
		if (units.is_new)
			game.notifications.addSound('new_units_available');
		
		this._checkUpgrade();
		
		if (units.is_changed || buildings.is_changed)
			this._drawCells();
	}
	
	this._checkUpgrade = function()
	{
		var i, j, obj, new_state, new_upgrade = false;
		
		for (i=0; i<this.all_buildings.length; ++i)
		{
			if (this.all_buildings[i].upgradable)
			{
				new_state = true;
				obj = this.all_buildings[i].upgrade_to;
				
				for (j=0; j<obj.require_building.length; ++j)
					if (obj.require_building[j].count == 0)
					{
						new_state = false;
						break;
					}
					
				if (this.all_buildings[i].can_upgrade_now != new_state)
				{
					this.all_buildings[i].can_upgrade_now = new_state;
					if (new_state)
						new_upgrade = true;
				}
			}
		}
		
		if (new_upgrade)
			game.notifications.addSound('upgrade_available');
	}
	
	this._checkArrayAvailability = function(arr)
	{
		var i, j, obj, have_new = false, have_changes = false, cur_enabled;
		
		for (i=0; i<arr.length; ++i)
		{
			obj = arr[i];
			cur_enabled = true;
				
			for (j=0; j<obj.require_building.length; ++j)
				if (obj.require_building[j].count == 0)
				{
					cur_enabled = false;
					break;
				}
				
			if (obj.enabled != cur_enabled)
			{
				if (!obj.enabled)
					have_new = true;
				
				obj.enabled = cur_enabled;
				have_changes = true;
			}
		}
		
		return {is_changed: have_changes, is_new: have_new};
	}
	
	this.loadUnitResources = function()
	{
		for (var i=0; i<this.available_units.length; ++i)
		{
			var obj = this.available_units[i];
			obj.loadResources();
		}
	}
	
	this.loadBuildingResources = function()
	{
		for (var i=0; i<this.all_buildings.length; ++i)
			this.all_buildings[i].loadResources();
	}
	
	this.drawUnits = function(start)
	{
		this.removeCellSelection();
		this.current_view_offset = (!start) ? 0 : start;
		this.current_view_type = CONST_VIEW_DEFAULT;
		this._drawCells();
		
		//Check upgrade button state
		if (game.selected_info.is_building && game.objects[game.selected_objects[0]]._proto.upgradable)
			$('#upgrade_button').removeClass('disable');
	}
	
	this.drawBuildings = function(start)
	{
		this.removeCellSelection();
		this.current_view_offset = (!start) ? 0 : start;
		this.current_view_type = CONST_VIEW_BUILDINGS;
		this._drawCells();
	}
	
	this._drawCells = function()
	{
		if (this.current_view_type == CONST_VIEW_BUILDINGS)
			this._clearAllCellCanvases();
		
		for (var i = this.current_view_offset; i<this.current_view_offset+15; ++i)
		{
			switch (this.current_view_type)
			{
				case CONST_VIEW_DEFAULT:
					if (!this.available_units[i])
						this._drawCellEmpty(i-this.current_view_offset);
					else
					{
						this._drawCell(
							i-this.current_view_offset, 
							'images/units/' + this.available_units[i].resource_key + '/box.png', 
							this.available_units[i].enabled,
							!this._canSelectedProduce(this.available_units[i])
						);
						if (this.available_units[i].construction_queue > 0)
							this._canvasRedraw(i-this.current_view_offset);
					}
					break;
				case CONST_VIEW_BUILDINGS:
					if (!this.available_buildings[i])
						this._drawCellEmpty(i-this.current_view_offset);
					else
						this._drawCell(
							i-this.current_view_offset, 
							'images/buildings/' + this.available_buildings[i].res_key + '/box.png', 
							this.available_buildings[i].enabled,
							false
						);
					break;
			}
		}
	}
	
	this._canSelectedProduce = function(obj)
	{
		if (game.selected_info.is_building)
			return (obj.construction_building.indexOf(game.objects[game.selected_objects[0]]._proto) != -1);
		
		return true;
	}
	
	this._drawCellEmpty = function(cell)
	{
		$('#unit_box'+cell).css('background-image', 'url(images/units/empty_unit_box.png)');
	}
	
	this._drawCell = function(cell, path, enabled, is_blue)
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
	}
	
	this.removeCellSelection = function()
	{
		$('.unit-image.active').removeClass('active');
		$('#upgrade_button').addClass('disable');
		$('#cell_popup').hide();
	}
	
	this.cellClick = function(cell_id)
	{
		var i = this.current_view_offset + parseInt(cell_id), obj;
		
		if (this.current_view_type == CONST_VIEW_BUILDINGS)
		{
			if (typeof this.available_buildings[i] == 'undefined')
				return;
			if (!this.available_buildings[i].enabled)
			{
				game.resources.get('cant_build').play();
				return;
			}
			if (!game.players[PLAYER_HUMAN].haveEnoughMoney(this.available_buildings[i].cost))
			{
				game.resources.get('cant_build').play();
				game.notifications.addIfEmpty('insufficient_credits');
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
			if (!this.available_units[i].enabled)
			{
				game.resources.get('cant_build').play();
				return;
			}
			if (this.available_units[i].construction_queue >= 11)
				return;
			if (!game.players[PLAYER_HUMAN].haveEnoughMoney(this.available_units[i].cost))
			{
				game.resources.get('cant_build').play();
				game.notifications.addIfEmpty('insufficient_credits');
				return;
			}
			
			if (game.selected_objects.length==1 && game.selected_info.is_building)
			{
				if (!this._canSelectedProduce(this.available_units[i]))
					return;
				obj = game.objects[game.selected_objects[0]];
			}
			else
				obj = this._findCompatibleInstance(this.available_units[i].construction_building);
			
			if (obj === null)
				return;
			
			obj.produce(this.available_units[i]);
			this.available_units[i].construction_queue++;
		}
	}
	
	this._findCompatibleInstance = function(proto_obj_arr)
	{
		var i, j;
		
		for (i in game.objects)
			for (j in proto_obj_arr)
				if (game.objects[i] instanceof proto_obj_arr[j])
					return game.objects[i];
		
		return null;
	}
	
	this.cellPopupPrepere = function(cell_id)
	{
		var i = this.current_view_offset + parseInt(cell_id), obj;
		
		this._clearPopup();
		
		if (this.current_view_type == CONST_VIEW_BUILDINGS)
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
	}
	
	this.upgradePopupPrepere = function()
	{
		this._clearPopup();
		if (game.selected_info.is_building && game.objects[game.selected_objects[0]]._proto.upgradable)
			this._drawPopup(game.objects[game.selected_objects[0]]._proto.upgrade_to);
	}
	
	this._clearPopup = function()
	{
		this._popup_ctx.clearRect(0, 0, 400, 200);
	}
	
	this._drawPopup = function(obj)
	{
		var MAX_X = 400, MAX_Y = 200;
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
		if (obj.enabled)
			return;
		
		for (i in obj.require_building)
			if (obj.require_building[i].count == 0)
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
	}
	
	
	this.redrawProductionState = function()
	{
		var i, index;
		
		if (this.current_view_type == CONST_VIEW_BUILDINGS)
			return;
		
		for (i = 0; i<15; ++i)
		{
			index = this.current_view_offset + i;
			if (!this.available_units[index])
				return;
			
			if (this.available_units[index].construction_queue > 0)
				this._canvasRedraw(i);
		}
	}
	
	this._canvasRedraw = function(index)
	{
		var ctx = $('#cell_canvas_' + index).get(0).getContext('2d'), obj = this.available_units[this.current_view_offset + index], to_point;
		
		ctx.clearRect(0, 0, 64, 50);
		
		if (obj.construction_queue == 0)
			return;
		
		to_point = Math.PI*1.5 - (1-obj.construction_progress)*2*Math.PI;
					
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
		
		game.fontDraw.drawOnCanvas(obj.construction_queue.toString(), ctx, 13, 2, 'yellow');
	}
	
	this.clearProducingByObject = function(obj)
	{
		var i, index;
		
		if (this.current_view_type == CONST_VIEW_BUILDINGS)
			return;
		
		for (i = 0; i<15; ++i)
		{
			index = this.current_view_offset + i;
			if (!this.available_units[index])
				return;
			
			if (this.available_units[index] == obj)
				$('#cell_canvas_' + i).get(0).getContext('2d').clearRect(0, 0, 64, 50);
		}
	}
	
	this._clearAllCellCanvases = function()
	{
		for (var i = 0; i<15; ++i)
			$('#cell_canvas_' + i).get(0).getContext('2d').clearRect(0, 0, 64, 50);
	}
}