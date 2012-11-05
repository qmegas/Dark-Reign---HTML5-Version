function ConstructManager(units, buildings)
{
	this.available_units = units;
	this.available_buildings = buildings;
	
	this.current_view_type = CONST_VIEW_DEFAULT;
	this.current_view_offset = 0;
	
	this.recalcUnitAvailability = function()
	{
		var have_new_units = this._checkArrayAvailability(this.available_units);
		var have_new_buildings = this._checkArrayAvailability(this.available_buildings);
		
		if (have_new_units || have_new_buildings)
			this._drawCells();
		
		return have_new_units;
	}
	
	this._checkArrayAvailability = function(arr)
	{
		var i, j, obj, have_new = false, cur_enabled;
		
		for (i=0; i<arr.length; ++i)
		{
			obj = arr[i];
			if (!obj.enabled)
			{
				cur_enabled = true;
				
				for (j=0; j<obj.require_building.length; ++j)
					if (obj.require_building[j].count == 0)
					{
						cur_enabled = false;
						break;
					}
					
				if (cur_enabled)
				{
					obj.enabled = true;
					have_new = true;
				}
			}
		}
		
		return have_new;
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
		for (var i=0; i<this.available_buildings.length; ++i)
			this.available_buildings[i].loadResources();
	}
	
	this.drawUnits = function(start)
	{
		this.removeCellSelection();
		this.current_view_offset = (!start) ? 0 : start;
		this.current_view_type = CONST_VIEW_DEFAULT;
		this._drawCells();
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
		for (var i = this.current_view_offset; i<this.current_view_offset+15; ++i)
		{
			switch (this.current_view_type)
			{
				case CONST_VIEW_DEFAULT:
					if (!this.available_units[i])
						this._drawCellEmpty(i-this.current_view_offset);
					else
						this._drawCell(
							i-this.current_view_offset, 
							'images/units/' + this.available_units[i].box_image, 
							this.available_units[i].enabled
						);
					break;
				case CONST_VIEW_BUILDINGS:
					if (!this.available_buildings[i])
						this._drawCellEmpty(i-this.current_view_offset);
					else
						this._drawCell(
							i-this.current_view_offset, 
							'images/buildings/' + this.available_buildings[i].box_image, 
							this.available_buildings[i].enabled
						);
					break;
			}
		}
	}
	
	this._drawCellEmpty = function(cell)
	{
		$('#unit_box'+cell).css('background-image', 'url(images/units/empty_unit_box.png)');
	}
	
	this._drawCell = function(cell, path, enabled)
	{
		var style = enabled ? '-45px 2px' : '9px 2px';
		$('#unit_box'+cell).css({
			'background-image': 'url('+path+')',
			'background-position': style
		});
	}
	
	this.removeCellSelection = function()
	{
		$('.unit-image.active').removeClass('active');
	}
	
	this.cellClick = function(cell_id)
	{
		var i = this.current_view_offset + parseInt(cell_id);
		
		if (this.current_view_type == CONST_VIEW_BUILDINGS)
		{
			if (typeof this.available_buildings[i] == 'undefined')
				return;
			if (!this.available_buildings[i].enabled)
				return;
			
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
		}
	}
}