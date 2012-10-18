function ConstructManager(units, buildings)
{
	this.available_units = units;
	this.available_buildings = buildings;
	
	this.current_view_type = CONST_VIEW_DEFAULT;
	this.current_view_offset = 0;
	
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
		
		if (!start)
			start = 0;
		
		this.current_view_offset = start;
		this.current_view_type = CONST_VIEW_DEFAULT;
		
		for (var i = start; i<start+15; ++i)
		{
			if (!this.available_units[i])
				this._drawCellEmpty(i-start);
			else
				this._drawCell(i-start, 'images/units/' + this.available_units[i].box_image, this.available_units[i].enabled);
		}
	}
	
	this.drawBuildings = function(start)
	{
		this.removeCellSelection();
		
		if (!start)
			start = 0;
		
		this.current_view_offset = start;
		this.current_view_type = CONST_VIEW_BUILDINGS;
		
		for (var i = start; i<start+15; ++i)
		{
			if (!this.available_buildings[i])
				this._drawCellEmpty(i-start);
			else
				this._drawCell(i-start, 'images/buildings/' + this.available_buildings[i].box_image, this.available_buildings[i].enabled);
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