var ProducingQueue = {
	_queue: {},
		
	addProduction: function(obj) 
	{
		if (!obj.enabled)
		{
			game.resources.play('cant_build');
			return;
		}
		
		if (obj.producing_paused)
		{
			obj.producing_paused = false;
			return;
		}
		
		if (obj.producing_count >= 11)
			return;
		
		if (!game.players[PLAYER_HUMAN].haveEnoughMoney(obj.cost))
		{
			game.resources.play('cant_build');
			game.notifications.addIfEmpty('insufficient_credits');
			return;
		}
		
		if (obj.producing_count == 0)
		{
			if (game.selected_objects.length==1 && game.selected_info.is_building)
			{
				if (!AbstractBuilding.canSelectedProduce(obj))
					return;
				obj.producing_building_id = game.objects[game.selected_objects[0]].uid;
			}
			else
				obj.producing_building_id = game.findCompatibleInstance(obj.construction_building, PLAYER_HUMAN).uid;
		}
		
		obj.producing_count++;
		
		if (typeof this._queue[obj.producing_building_id] == 'undefined')
			this._queue[obj.producing_building_id] = [];
		
		this._queue[obj.producing_building_id].push(obj);
	},
	
	pauseProduction: function(obj) 
	{
		if (!obj.enabled)
			return;
		
		if (obj.producing_count == 0)
			return;
		
		if (obj.producing_paused)
			this._cancelProduction(obj);
		else
			obj.producing_paused = true;
	},
		
	getProductionInfo: function(build_id) 
	{
		var name = this._queue[build_id][0].obj_name;
		
		if (this._queue[build_id][0].producing_paused)
			name += ' - paused';
		
		return {
			progress: this._queue[build_id][0].producing_progress / this._queue[build_id][0].construction_time,
			name: name
		};
	},
	
	run: function()
	{
		for (var i in this._queue)
		{
			if (this._queue[i].length > 0)
			{
				if (game.objects[i] === undefined)
				{
					this._buildingDisapear(i);
					return;
				}
				
				var step, money, obj = this._queue[i][0];
				
				if (obj.producing_paused)
					continue;
				
				if (game.objects[i].state == BUILDING_STATE_PRODUCING)
				{
					if (game.debug.quick_build || (obj.producing_progress >= obj.construction_time))
					{
						obj.producing_count--;
						obj.producing_progress = 0;
						this._queue[i].shift();
						
						game.objects[i].produce(obj);
						
						if (this._queue[i].length == 0)
							game.objects[i].state = BUILDING_STATE_NORMAL;
						
						continue;
					}
					
					step = Math.min(1, obj.construction_time - obj.producing_progress);
					money = step * (obj.cost / obj.construction_time);
					
					if (!game.players[PLAYER_HUMAN].haveEnoughMoney(money))
						continue;
						
					game.players[PLAYER_HUMAN].decMoney(money);
					obj.producing_progress += step;
				}
				else
				{
					if (game.objects[i].state == BUILDING_STATE_NORMAL)
						game.objects[i].state = BUILDING_STATE_PRODUCING;
				}
			}
		}
	},
		
	_buildingDisapear: function(i)
	{
		var obj, j;
		
		this._queue[i][0].producing_progress = 0;
		obj = game.findCompatibleInstance(this._queue[i][0].construction_building, PLAYER_HUMAN);
		if (obj !== null)
		{
			//transfere production queue to another building
			for (j in this._queue[i])
				this._queue[i][j].producing_building_id = obj.uid;
			
			if (typeof this._queue[obj.uid] == 'undefined')
				this._queue[obj.uid] = [];
			
			this._queue[obj.uid] = this._queue[obj.uid].concat(this._queue[i]);
		}
		else
		{
			//Cancel production
			for (j in this._queue[i])
			{
				this._queue[i][j].producing_progress = 0;
				this._queue[i][j].producing_count = 0;
				this._queue[i][j].producing_paused = false;
			}
		}
		delete this._queue[i];
	},
	
	_cancelProduction: function(obj) 
	{
		var building = game.objects[obj.producing_building_id], new_arr = [];
		
		obj.producing_progress = 0;
		obj.producing_count = 0;
		obj.producing_paused = false;
		
		if (this._queue[building.uid][0] == obj)
		{
			if (building.state == BUILDING_STATE_PRODUCING)
				building.state = BUILDING_STATE_NORMAL;
		}
		
		for (var i in this._queue[building.uid])
		{
			if (this._queue[building.uid][i] != obj)
				new_arr.push(this._queue[building.uid][i]);
		}
		this._queue[building.uid] = new_arr;
	}
};