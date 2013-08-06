var TacticalAI = {
	handleUnitEvent: function(unit, event, params)
	{
		switch (event)
		{
			case 'attacked':
				this._underAttack(unit, params);
				break;
				
			case 'no_ammo':
				unit.state = UNIT_STATE_STAND;
				break;
				
			case 'standing_too_close':
				var target_pos = MapCell.pixelToCell(unit.parts[params.part].weapon.getTargetPosition()),
					angle = Math.atan2(unit.position_cell.y - target_pos.y, unit.position_cell.x - target_pos.x),
					x = target_pos.x + Math.ceil(Math.cos(angle) * unit.parts[params.part].weapon.getMinRange() * 1.1),
					y = target_pos.y + Math.ceil(Math.sin(angle) * unit.parts[params.part].weapon.getMinRange() * 1.1);
				
				if (!MapCell.isCorrectCord(x, y))
					unit.orderWait(500);
				else
					unit._move(x, y);
				break;
				
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
	},
		
	regularScan: function(unit)
	{
		/**
		 * Right now i implement tactical AI when unit is idle
		 * But multi-part units may attack even when moving.
		 * That should be implemented later
		 */
		if (unit.state != UNIT_STATE_STAND)
			return;
		
		if (this._noAmmo(unit))
			return;
		
		if (this._flyUnderBuilding(unit))
			return;
		
		//@todo Go fixing
		
		if (this._findEnemy(unit))
			return;
	},
		
	_underAttack: function(unit, params)
	{
		if (unit.is_building)
			return;
		
		if (unit.state != UNIT_STATE_STAND)
			return;
		
		if (!game.objects[params.attacker])
			return;
		
		//@todo Run away or run toward
	},
		
	_findEnemy: function(unit)
	{
		if (!unit._is_have_weapon)
			return false;
		
		var pos = unit.getCell(), attack_unit = null, current_player = game.players[unit.player];
		
		rangeItterator(pos.x, pos.y, unit._proto.seeing_range, function(x, y) {
			var i, uid, users = MapCell.getAllUserIds(game.level.map_cells[x][y]);
			for (i in users)
			{
				uid = users[i];
				if (unit.uid == uid)
					continue;
				
				if (unit.player == game.objects[uid].player)
					continue;
				
				var target = {type: 'object', objid: uid};
				if (current_player.isEnemy(game.objects[uid].player) && unit.isCanAttackTarget(target))
				{
					attack_unit = target;
					return true;
				}
			}
			
			return false;
		});
		
		if (attack_unit)
		{
			unit.orderAttack(attack_unit);
			return true;
		}
		
		return false;
	},
	
	_noAmmo: function(unit)
	{
		if (unit instanceof CycloneUnit)
		{
			if (unit.parts[0].weapon.getAmmoState() == 0)
			{
				var obj = game.findNearestInstance(RearmingDeckBuilding, unit.player, unit.position_cell.x, unit.position_cell.y);
				if (obj !== null)
				{
					unit.orderRearm(obj);
					return true;
				}
			}
		}
		return false;
	},
		
	_flyUnderBuilding: function(unit)
	{
		if (unit._proto.move_mode != MOVE_MODE_FLY)
			return false;
		
		var cell = unit.getCell();
		
		if (game.level.map_cells[cell.x][cell.y].building != -1)
		{
			cell = PathFinder.findNearestEmptyCell(cell.x, cell.y);
			if (cell)
			{
				unit.orderMove(cell.x, cell.y);
				return true;
			}
		}
		
		return false;
	}
};
	