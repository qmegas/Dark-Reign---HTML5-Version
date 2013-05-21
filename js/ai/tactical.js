var TacticalAI = {
	handleUnitEvent: function(unit, event, params)
	{
		switch (event)
		{
			case 'no_ammo':
				if (unit instanceof CycloneUnit)
				{
					var obj = game.findNearestInstance(RearmingDeckBuilding, unit.player, unit.position_cell.x, unit.position_cell.y);
					if (obj !== null)
						unit.orderRearm(obj);
				}
				break;
			
			case 'standing_too_close':
			case 'standing_too_far':
				var pos = MapCell.pixelToCell(unit.parts[params.part].weapon.getTargetPosition());
				pos = PathFinder.findNearestEmptyCell(pos.x, pos.y, unit._proto.move_mode);
				if (pos !== null)
					unit._move(pos.x, pos.y);
				else
					unit.state = UNIT_STATE_STAND;
				break;
				
			case 'tactic_changed':
				break;
		}
	}
};

