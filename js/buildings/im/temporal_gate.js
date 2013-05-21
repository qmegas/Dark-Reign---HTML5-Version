function TemporalGateBuilding(pos_x, pos_y, player)
{
	var max_charge = 42;
	
	this._proto = TemporalGateBuilding;
	
	this._carry_spaces = this._proto.carry.places;
	this._charge = max_charge;
	
	this.init(pos_x, pos_y, player);
	
	//Custom selection bar
	this.drawSelection = function(is_onmouse)
	{
		this._drawSelectionStandart(is_onmouse);
		
		var i, color, top_y = this.position.y + CELL_SIZE*this._proto.cell_size.y + 18  - game.viewport_y,
			top_x = this.position.x - game.viewport_x + 4;
		
		for (i = 0; i < this._proto.carry.places; ++i)
		{
			game.viewport_ctx.fillStyle = '#000000';
			game.viewport_ctx.fillRect(top_x + i*22, top_y, 20, 4);
			color = ((2 - this._carry_spaces)>=i) ? '#ff0000' : '#A5FF6C';
			game.viewport_ctx.fillStyle = color;
			game.viewport_ctx.fillRect(top_x + 1 + i*22, top_y + 1, 18, 2);
		}
	};
	
	this.canTeleport = function()
	{
		return (this.haveInsideUnits() && this._charge==max_charge && this.state==BUILDING_STATE_NORMAL);
	};
	
	this.teleport = function(tpos)
	{
		var i, teleported = 0, new_arr = [], pos, unit;
		
		PathFinder.setSearchRadius(5);
		
		for (i in this._carry_units)
		{
			unit = game.objects[this._carry_units[i]];
			pos = PathFinder.findNearestEmptyCell(tpos.x, tpos.y, unit._proto.move_mode);
			if (pos !== null)
			{
				unit.setCell(pos);
				game.level.map_cells[pos.x][pos.y].ground_unit = unit.uid;
				SimpleEffect.quickCreate('electric_blue_animation', {
					pos: {
						x: unit.position.x + 12,
						y: unit.position.y + 12
					}
				});
				this._carry_spaces++;
				teleported++;
				this._carry_units[i] = -1;
			}
			else
				new_arr.push(this._carry_units[i]);
		}
		
		if (teleported > 0)
		{
			game.resources.play('teleport');
			this._charge = 0;
			this.progress_bar = 0;
			this.state = BUILDING_STATE_CHARGING;
			ActionsHeap.add(this.uid, 'charge', 0);
		}
		
		PathFinder.restoreSearchRadius();
		
		this._carry_units = new_arr;
	};
	
	this.charge = function()
	{
		this._charge++;
		this.progress_bar = this._charge / max_charge;
		if (this._charge == max_charge)
		{
			this.state = BUILDING_STATE_NORMAL;
			ActionsHeap.remove(this.uid, 'charge');
		}
	};
	
	this.onObjectDeletionCustom = function() 
	{
		if (this.haveInsideUnits())
			this.extract();
	};
}

AbstractBuilding.setBuildingCommonOptions(TemporalGateBuilding);

TemporalGateBuilding.res_key = 'temporal_gate';
TemporalGateBuilding.obj_name = 'Temporal Gate';
TemporalGateBuilding.cost = 1800;
TemporalGateBuilding.build_time = 36;
TemporalGateBuilding.sell_cost = 900;
TemporalGateBuilding.sell_time = 18;
TemporalGateBuilding.health_max = 1000;
TemporalGateBuilding.energy = 100;
TemporalGateBuilding.can_build = true;
TemporalGateBuilding.crater = 1;
TemporalGateBuilding.is_teleport = true;

TemporalGateBuilding.carry = {places: 3, max_mass: 10};

TemporalGateBuilding.cell_size = {x: 3, y: 2};
TemporalGateBuilding.cell_matrix = [1,1,1,1,1,1];
TemporalGateBuilding.move_matrix = [1,1,1,0,1,1];
TemporalGateBuilding.cell_padding = {x: 1, y: 0};
TemporalGateBuilding.images = {
	normal: {
		size: {x: 72, y: 48},
		padding: {x: 0, y: 0}
	},
	shadow: {
		size: {x: 49, y: 45},
		padding: {x: -23, y: -3}
	}
};
TemporalGateBuilding.hotpoints = [
	{x: 12, y: 12},
	{x: 52, y: 7},
	{x: 44, y: 37}
];