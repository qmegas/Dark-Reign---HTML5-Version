function Game()
{
	this.level = {};
	
	this.viewport_x = 0;
	this.viewport_y = 0;
	this.viewport_move_x = 0;
	this.viewport_move_y = 0;
	this.viewport_move_mouse_x = 0;
	this.viewport_move_mouse_y = 0;
	this.viewport_ctx = {};
	
	this.paused = false;
	
	this.resources = new ResourseLoader();
	
	this.players = [];
	this.objects = [];
	this.effects = [];
	this.kill_objects = [];
	this.selected_objects = [];
	this.selected_info = {};
	
	//Drawers
	this.mouse = new MousePointer(this);
	this.fontDraw = new DKFont();
	this.objDraw = new ObjectDraw();
	this.notifications = new SoundQueue();
	this.moneyDraw = new MoneyDraw();
	this.energyDraw = new EnergyWaterDraw();
	this.constructor = {};
	this.minimap = new MiniMap();
	
	//Flags
	this.action_state = 0;
	this.action_state_options = {};
	this.shell_update_time = 0;
	this.minimap_navigation = false;
	
	this.debug = new Debuger();
	this.dialog = new Dialog();
	this.damageTable = new DamageTable();
	
	this.moveViewport = function(x, y, relative)
	{
		if (relative)
		{
			this.viewport_x += x*CELL_SIZE;
			this.viewport_y += y*CELL_SIZE;
		}
		else
		{
			this.viewport_x = x*CELL_SIZE;
			this.viewport_y = y*CELL_SIZE;
		}
		
		if (this.viewport_x < 0)
			this.viewport_x = 0;
		if (this.viewport_y < 0)
			this.viewport_y = 0;
		if (this.viewport_x > this.level.max_movement.x)
			this.viewport_x = this.level.max_movement.x;
		if (this.viewport_y > this.level.max_movement.y)
			this.viewport_y = this.level.max_movement.y;
		
		$('#map_view').css({
			left: -this.viewport_x,
			top: -this.viewport_y
		}, 'fast');
		
		this.minimap.drawViewport();
	};

	this.init = function(level, init_finish_callback)
	{
		if (!this._checkBrowserSupport())
		{
			$('.load-screen').css('background-image', 'url("images/shell/not_supported.png")');
			return;
		}
		
		this.viewport_ctx = $('#viewport').get(0).getContext('2d');
		
		this.level = level;
		this.level.max_movement.x = CELL_SIZE*this.level.size.x-448;
		this.level.max_movement.y = CELL_SIZE*this.level.size.y-448;
		
		$('#viewport').css('top', '-' + (CELL_SIZE*this.level.size.y+5) + 'px');
		
		$('#minimap_viewport, #minimap_objects')
			.attr('width', this.level.minimap.x)
			.attr('height', this.level.minimap.y);
			
		//Init map matrix
		for (var x=0; x<level.size.x; ++x)
			for (var y=0; y<level.size.y; ++y)
				this.level.map_cells[x][y] = {
					type: this.level.map_cells[x][y], 
					ground_unit: -1,
					fly_unit: -1,
					building: -1
				};
		
		this.damageTable.init();
		
		//Init units
		this.level.getInitUnits();
		
		this.constructor = new ConstructManager(this.level.getAvailableUnits(), this.level.getAvailableBuildings());
		
		//Preloading images
		//-- CSS --
		this.resources.addImage('css1', 'images/shell/load-screen.png');
		this.resources.addImage('css2', 'images/shell/load-bar.png');
		this.resources.addImage('css3', 'images/shell/money.png');
		this.resources.addImage('css4', 'images/shell/topbuttons.png');
		this.resources.addImage('css5', 'images/shell/money_numbers.png');
		this.resources.addImage('css6', 'images/shell/menutabs.png');
		this.resources.addImage('css7', 'images/shell/panel.png');
		this.resources.addImage('css8', 'images/shell/unit_box.png');
		this.resources.addImage('css9', 'images/shell/b_buttons.png');
		this.resources.addImage('css10', 'images/shell/minimap.png');
		this.resources.addImage('css11', 'images/shell/switches.png');
		this.resources.addImage('css12', 'images/shell/metrics.png');
		this.resources.addImage('css13', 'images/shell/buttons.png');
		//---------
		this.resources.addImage('map-tiles', 'images/levels/'+this.level.tiles);
		this.resources.addImage('minimap', 'images/levels/'+this.level.minimap.image);
		this.resources.addImage('clr', 'images/buildings/clr.png');
		this.resources.addImage('font', 'images/font.png');
		this._loadGameResources();
		this.resources.onLoaded = function(loaded, total){
			var progress = parseInt(500/total*loaded);
			$('#progress-bar').css({width: progress+'px'});
		};
		this.resources.onComplete = function(){
			game.moveViewport(0, 0, false);
			game.players[PLAYER_HUMAN].addMoney(15000); //Should add money to all players
			game.constructor.drawUnits();
			game.level.generateMap();
			game._resetSelectionInfo();
			game.energyDraw.drawAll();
			
			$('.load-screen').hide();
			$('.game').show();
			
			init_finish_callback();
		};
	};
	
	this.run = function()
	{
		if (this.paused)
			return;
		
		var i;
		
		//Debug
		this.debug.countRun();
		
		//Kill objects
		for (i = 0; i<this.kill_objects.length; ++i)
		{
			var unit = this.objects[this.kill_objects[i]];
			
			if (typeof unit === 'undefined')
				continue;
			
			unit.onObjectDeletion();
			
			//Remove user from selected array
			var sindex = this.selected_objects.indexOf(unit.uid);
			if (sindex != -1)
				this.selected_objects.splice(sindex, 1);
			
			//Delete object
			this.objects[this.kill_objects[i]] = null;
			delete this.objects[this.kill_objects[i]];
		}
		this.kill_objects = [];
		
		//Proceed objects
		for (i in this.objects)
			this.objects[i].run();
		
		//Move viewport
		var move_x = this.viewport_move_x, move_y = this.viewport_move_y;
		if (this.debug.mouse_panning && this.mouse.show_cursor)
		{
			if (this.viewport_move_mouse_x != 0)
				move_x = this.viewport_move_mouse_x;
			if (this.viewport_move_mouse_y != 0)
				move_y = this.viewport_move_mouse_y;
		}
		if (move_x!=0 || move_y!=0)
			this.moveViewport(move_x, move_y, true);
		
		//Money draw
		this.moneyDraw.draw();
	};
	
	this.draw = function()
	{
		if (!this.paused)
			this._draw();
		
		window.requestAnimFrame(function(){
			game.draw();
		});
	};
	
	this._draw = function()
	{
		var cur_time = (new Date()).getTime(), onscreen = [], unitid, eindex;
		var top_x = parseInt(this.viewport_x / CELL_SIZE) - 1, top_y = parseInt(this.viewport_y / CELL_SIZE) - 1;
		
		//Debug
		this.debug.countDraw();
		
		this.viewport_ctx.clearRect(0, 0, VIEWPORT_SIZE, VIEWPORT_SIZE);
		this.objDraw.clear();
		
		//Detect onscreen units
		for (var y=0; y<21; ++y)
			for (var x=0; x<21; ++x)
			{
				if (this.level.map_cells[top_x+x] && this.level.map_cells[top_x+x][top_y+y])
				{
					//Preventing duplicate entries (for example building can be placed in few cells)
					if (this.level.map_cells[top_x+x][top_y+y].ground_unit != -1)
						onscreen[this.level.map_cells[top_x+x][top_y+y].ground_unit] = 1;
					if (this.level.map_cells[top_x+x][top_y+y].fly_unit != -1)
						onscreen[this.level.map_cells[top_x+x][top_y+y].fly_unit] = 1;
					if (this.level.map_cells[top_x+x][top_y+y].building != -1)
						onscreen[this.level.map_cells[top_x+x][top_y+y].building] = 1;
				}
			}
			
		//Round 1: Put units to draw heap
		for (unitid in onscreen)
			if (this.objects[unitid] !== undefined)
				this.objects[unitid].draw(cur_time);
		
		//Round 1.5: Put effects to draw heap
		for (eindex in this.effects)
			this.objects[this.effects[eindex]].draw(cur_time);
		
		//Round 2: Draw all entries in draw heap
		this.objDraw.draw();
		
		//Round 3: Draw selections
		for (unitid in onscreen)
			if (this.objects[unitid].is_selected)
				this.objects[unitid].drawSelection();
		
		//Round 4: On mouse selection
		var mouse_pos = this.mouse.getCellPosition();
		unitid = MapCell.getSingleUserId(this.level.map_cells[mouse_pos.x][mouse_pos.y]);
		if (unitid != -1) // && !this.objects[unitid].is_selected)
			this.objects[unitid].drawSelection(true);
		
		//DEBUG: Unit placement
		if (this.debug.show_obj)
		{
			this.viewport_ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
			var start_x = parseInt(this.viewport_x/24), start_y = parseInt(this.viewport_y/24);
			for (var x=0; x<20; ++x)
			{
				if (this.level.map_cells[start_x+x] === undefined)
					continue;
				
				for (var y=0; y<20; ++y)
				{
					if (this.level.map_cells[start_x+x][start_y+y] === undefined)
						continue;
					
					if (MapCell.getSingleUserId(this.level.map_cells[start_x+x][start_y+y]) != -1)
						this.viewport_ctx.fillRect((start_x+x)*24-this.viewport_x, (start_y+y)*24-this.viewport_y, 24, 24);
				}
			}
		}

		//DEBUG: Ground type
		if (this.debug.show_type)
		{
			var start_x = parseInt(this.viewport_x/24), start_y = parseInt(this.viewport_y/24), skip;
			for (var x=0; x<20; ++x)
			{
				if (this.level.map_cells[start_x+x] === undefined)
					continue;
				
				for (var y=0; y<20; ++y)
				{
					if (this.level.map_cells[start_x+x][start_y+y] === undefined)
						continue;
					
					skip = false;
					switch (this.level.map_cells[start_x+x][start_y+y].type)
					{
						case CELL_TYPE_EMPTY:
							skip = true;
							break;
						case CELL_TYPE_TREE:
							this.viewport_ctx.fillStyle = 'rgba(0, 200, 0, 0.3)';
							break;
						case CELL_TYPE_WATER:
							this.viewport_ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
							break;
						case CELL_TYPE_NOWALK:
							this.viewport_ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
							break;
						case CELL_TYPE_BUILDING:
							this.viewport_ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
							break;
					}
					if (!skip)
						this.viewport_ctx.fillRect((start_x+x)*24-this.viewport_x, (start_y+y)*24-this.viewport_y, 24, 24);
				}
			}
		}

		//DEBUG: Cells grid
		if (this.debug.show_grid)
		{
			this.viewport_ctx.strokeStyle = '#ffffff';
			this.viewport_ctx.beginPath();
			var start = 24 - (this.viewport_x - parseInt(this.viewport_x/24)*24) + 0.5; // - 11.5;
			for (var i=0; i<20; ++i)
			{
				this.viewport_ctx.moveTo(start + i*24, 0);
				this.viewport_ctx.lineTo(start + i*24, 448);
			}
			start = 24 - (this.viewport_y - parseInt(this.viewport_y/24)*24) + 0.5; // - 11.5;
			for (i=0; i<20; ++i)
			{
				this.viewport_ctx.moveTo(0, start + i*24);
				this.viewport_ctx.lineTo(448, start + i*24);
			}
			this.viewport_ctx.stroke();
		}

		//Mouse
		this.mouse.draw(cur_time);
		
		//Once per second update shell info
		if ((cur_time - this.shell_update_time) > 1000)
		{
			this.shell_update_time = cur_time;
			
			//Update producing canvases
			this.constructor.redrawProductionState();
			
			//Update minimap
			this.minimap.drawObjects();
			
			//Energy
			this.energyDraw.enrgyNotification(cur_time);
			
			//Debug
			this.debug.resetCounters();
		}
		
		if (this.debug.show_fps)
			this.debug.drawFPS();
	};
	
	this.minimapNavigation = function(start)
	{
		this.minimap_navigation = start;
	};
	
	this.minimapMove = function(x, y)
	{
		if (!this.minimap_navigation)
			return;
		
		var realx = (x-this.level.minimap.rect_x/2),
			realy = (y-this.level.minimap.rect_y/2);
			
		this.moveViewport(realx, realy, false);
	};
	
	this.onClick = function(button)
	{
		var pos = this.mouse.getCellPosition();
		
		if (button == 'left')
		{
			var cunit = MapCell.getSingleUserId(this.level.map_cells[pos.x][pos.y]);
			if ((cunit !== -1) && this.objects[cunit].canBeSelected())
				this.regionSelect(pos.x, pos.y, pos.x, pos.y);
			
			//If not new selection move selected units
			if (cunit==-1 && this.selected_objects.length>0 && !this.selected_info.is_building)
				for (var i in this.selected_objects)
					this.objects[this.selected_objects[i]].orderMove(pos.x, pos.y, (i==0));
		}
		else
		{
			switch (this.action_state)
			{
				case ACTION_STATE_ATTACK:
					this.cleanActionState();
				case ACTION_STATE_NONE:
					this._deselectUnits();
					this.constructor.drawUnits();
					break;
					
				default:
					this.cleanActionState();
					break;
			}
		}
	};
	
	this.regionSelect = function (x1, y1, x2, y2)
	{
		var x, y, cur_unit, play_sound = true, harvesters = true, humans_only = true;
		
		this._deselectUnits();
		
		//Select units
		for (x=x1; x<=x2; ++x)
			for (y=y1; y<=y2; ++y)
			{
				cur_unit = MapCell.getSingleUserId(this.level.map_cells[x][y]);
				if ((cur_unit !== -1) && this.objects[cur_unit].canBeSelected())
				{
					//Do not select buildings on multiselect
					if (this.objects[cur_unit].is_building && (x1!=x2 || y1!=y2))
						continue;
					
					this.objects[cur_unit].select(true, play_sound);
					play_sound = false;
					
					if (this.objects[cur_unit].is_building)
						this.selected_info.is_building = true;
					this.selected_objects.push(cur_unit);
					this.selected_info.is_fly = this.selected_info.is_fly || this.objects[cur_unit].is_fly;
					this.selected_info.can_attack_ground = this.selected_info.can_attack_ground || this.objects[cur_unit].canAttackGround();
					this.selected_info.can_attack_fly = this.selected_info.can_attack_fly || this.objects[cur_unit].canAttackFly();
					harvesters = harvesters && this.objects[cur_unit].canHarvest();
					humans_only = humans_only && this.objects[cur_unit].isHuman();
				}
			}
		
		if (this.selected_objects.length > 0)
		{
			this.selected_info.harvesters = harvesters;
			this.selected_info.humans = humans_only;
		}
			
		//Constructor selected?
		if (this.selected_objects.length==1 && (this.objects[this.selected_objects[0]] instanceof ConstructionRigUnit))
			this.constructor.drawBuildings();
		else
			this.constructor.drawUnits();
	};
	
	this._deselectUnits = function()
	{
		this._resetSelectionInfo();
		while (this.selected_objects.length > 0)
			this.objects[this.selected_objects.pop()].select(false);
	};
	
	this._loadGameResources = function()
	{
		//Map objects
		for (var i in this.level.map_object_proto)
			this.resources.addImage('mapobj_'+i, this.level.map_object_proto[i].image);
		
		//Common resources
		this.resources.addSound('construction_under_way', 'sounds/construction_under_way.' + AUDIO_TYPE);
		this.resources.addSound('construction_complete', 'sounds/construction_complete.' + AUDIO_TYPE);
		this.resources.addSound('new_units_available', 'sounds/new_units_available.' + AUDIO_TYPE);
		this.resources.addSound('unit_completed', 'sounds/unit_completed.' + AUDIO_TYPE);
		this.resources.addSound('low_power', 'sounds/low_power.' + AUDIO_TYPE);
		this.resources.addSound('power_critical', 'sounds/power_critical.' + AUDIO_TYPE);
		this.resources.addSound('cant_build', 'sounds/cant_build.' + AUDIO_TYPE);
		this.resources.addSound('insufficient_credits', 'sounds/insufficient_credits.' + AUDIO_TYPE);
		this.resources.addSound('upgrade_available', 'sounds/upgrade_available.' + AUDIO_TYPE);
		this.resources.addSound('healing', 'sounds/healing.' + AUDIO_TYPE);
		
		//Units & Buildings
		this.constructor.loadUnitResources();
		this.constructor.loadBuildingResources();
		
		//Effects
		CraterEffect.loadResources();
		SparksExplosionEffect.loadResources();
		SplatAEffect.loadResources();
		SplatBEffect.loadResources();
		SplatDEffect.loadResources();
		WaterSellEffect.loadResources();
	};
	
	this._checkBrowserSupport = function()
	{
		//Support canvas
		var ret = !!document.createElement('canvas').getContext;
		if (!ret)
			return false;
		
		//Audio element
		ret = !!document.createElement('audio').canPlayType;
		if (!ret)
			return false;
		
		//OGG support
		var v = document.createElement('audio');
		ret = v.canPlayType('audio/ogg; codecs="theora, vorbis"');
		if (!ret)
			return false;
		
		return true;
	};
	
	this.shellStopButton = function()
	{
		for (var i in this.selected_objects)
			this.objects[this.selected_objects[i]].orderStop();
	};
	
	this._resetSelectionInfo = function()
	{
		this.selected_info = {
			is_building: false,
			is_fly: false,
			is_produce: false,
			can_attack_ground: false,
			can_attack_fly: false,
			harvesters: false,
			humans: false
		};
	};
	
	this.buildingUpgrade = function()
	{
		var upgraded = false;
		
		if (this.selected_info.is_building && this.objects[game.selected_objects[0]].isUpgradePossible())
		{
			var new_obj, old_obj = this.objects[game.selected_objects[0]], pos;
			
			if (this.players[PLAYER_HUMAN].haveEnoughMoney(old_obj._proto.upgrade_to.cost))
			{
				pos = old_obj.getCell();
				new_obj = new old_obj._proto.upgrade_to(pos.x, pos.y, old_obj.player);
			
				new_obj.uid = old_obj.uid;
				delete old_obj;
				this.objects[new_obj.uid] = new_obj;
				
				this.players[PLAYER_HUMAN].decMoney(old_obj._proto.upgrade_to.cost);
				
				upgraded = true;
			}
		}
		
		if (!upgraded)
			game.resources.play('cant_build');
	};
	
	this.toggleActionState = function(state)
	{
		var prev_state = this.action_state;
		if (this.action_state != ACTION_STATE_NONE)
			this.cleanActionState();
		
		if (state == prev_state)
			return;
		
		switch (state)
		{
			case ACTION_STATE_SELL:
				$('#top_button_sell').addClass('active');
				break;
			case ACTION_STATE_POWER:
				$('#top_button_power').addClass('active');
				break;
			case ACTION_STATE_REPAIR:
				$('#top_button_repair').addClass('active');
				break;
			case ACTION_STATE_ATTACK:
				if (this.selected_objects.length == 0)
					return;
				$('#top_button_attack').addClass('active');
				break;
		}
		
		this.action_state = state;
	};
	
	this.cleanActionState = function()
	{
		switch (this.action_state)
		{
			case ACTION_STATE_SELL:
				$('#top_button_sell').removeClass('active');
				break;
			case ACTION_STATE_POWER:
				$('#top_button_power').removeClass('active');
				break;
			case ACTION_STATE_BUILD:
				this.constructor.removeCellSelection();
				break;
			case ACTION_STATE_REPAIR:
				$('#top_button_repair').removeClass('active');
				break;
			case ACTION_STATE_ATTACK:
				$('#top_button_attack').removeClass('active');
				break;
		}
		
		this.action_state = ACTION_STATE_NONE;
	};
	
	this.addEffect = function(effect)
	{
		var uid = this.objects.length;
		this.objects.push(effect);
		this.effects.push(uid);
		return uid;
	};
	
	this.deleteEffect = function(effectid)
	{
		//Remove user from effects array
		var sindex = this.effects.indexOf(effectid);
		if (sindex != -1)
			this.effects.splice(sindex, 1);
		
		this.kill_objects.push(effectid);
	};
	
	this.findCompatibleInstance = function(object_type_arr, player)
	{
		var i, j;
		
		for (i in this.objects)
			for (j in object_type_arr)
				if ((this.objects[i] instanceof object_type_arr[j]) && (this.objects[i].player==player))
					return this.objects[i];
		
		return null;
	};
	
	this.findNearestInstance = function(object_type, player, x, y)
	{
		var len = 99999, obj = null, i, tmp_path, cell;
		
		for (i in this.objects)
		{
			if ((this.objects[i] instanceof object_type) && (this.objects[i].player == player))
			{
				cell = this.objects[i].getCell();
				if (cell.x==x && cell.y==y)
					return this.objects[i];
				
				tmp_path = PathFinder.findPath(x, y, cell.x, cell.y, true, false);
				if ((tmp_path.length > 0) && (len > tmp_path.length))
				{
					len = tmp_path.length;
					obj = this.objects[i];
				}
			}
		}
		
		return obj;
	};
	
	this.togglePause = function()
	{
		this.paused = !this.paused;
		
		if (this.paused)
		{
			this.dialog.setOptions({
				text: 'game_paused',
				buttons: [{
					text: 'continue',
					callback: function(){
						game.togglePause();
					}
				}]
			});
			this.dialog.show();
		}
		else
		{
			this.dialog.hide();
		}
	};
}

$(function(){
	var img = new Image();
	img.src = 'images/shell/load-screen.png';
	img.onload = function(){
		game = new Game();
		game.init(new Level1(), function(){
			game.draw();
			setInterval(function(){game.run();}, 1000/RUNS_PER_SECOND);
		});
	};
	
	//Interface stop button
	$('#top_button_stop').mousedown(function(){
		$(this).addClass('active');
	});
	$('#top_button_stop').mouseup(function(){
		$(this).removeClass('active');
	});
	$('#top_button_stop').click(function(){
		game.shellStopButton();
	});
	//Interface sell building button
	$('#top_button_sell').click(function(){
		game.toggleActionState(ACTION_STATE_SELL);
	});
	//Interface power building button
	$('#top_button_power').click(function(){
		game.toggleActionState(ACTION_STATE_POWER);
	});
	$('#top_button_repair').click(function(){
		game.toggleActionState(ACTION_STATE_REPAIR);
	});
	$('#top_button_attack').click(function(){
		game.toggleActionState(ACTION_STATE_ATTACK);
	});
	
	$('.tab').click(function(){
		var $this = $(this);
		
		$('.tab').removeClass('active');
		$this.addClass('active');
		
		if ($this.attr('data-panel'))
		{
			$('.panel').addClass('hidden');
			$('#'+$this.attr('data-panel')).removeClass('hidden');
		}
	});
	
	$('.unit-image').click(function(){
		var cellid = $(this).parent('div').attr('data-cell');
		game.constructor.cellClick(cellid);
	});
	$('.unit-image').mouseover(function(){
		var cellid = $(this).parent('div').attr('data-cell'), position = $(this).offset();
		game.constructor.cellPopupPrepere(cellid);
		
		position.left -= 392;
		$('#cell_popup').css(position);
		$('#cell_popup').show();
	});
	$('.unit-image').mouseout(function(e){
		$('#cell_popup').hide();
	});
	
	$('#upgrade_button').click(function(){
		game.buildingUpgrade();
	});
	$('#upgrade_button').mouseover(function(){
		if ($(this).hasClass('disable'))
			return;
		
		var position = $(this).offset();
		game.constructor.upgradePopupPrepere();
		
		position.left -= 398;
		$('#cell_popup').css(position);
		$('#cell_popup').show();
	});
	$('#upgrade_button').mouseout(function(){
		$('#cell_popup').hide();
	});
	
	$('#minimap_viewport').mousedown(function(event){
		game.minimapNavigation(true);
		game.minimapMove(event.layerX, event.layerY);
	});
	
	$('#minimap_viewport').mouseup(function(){
		game.minimapNavigation(false);
	});
	
	$('#minimap_viewport').mouseout(function(){
		game.minimapNavigation(false);
	});
	
	$('#minimap_viewport').mousemove(function(event){
		game.minimapMove(event.layerX, event.layerY);
	});
	
	$('#viewport').bind('contextmenu', function(){
		game.onClick('right');
		return false;
	});
	$('#viewport').mousedown(function(event){
		if (event.button == 0)
			game.mouse.selectionStart();
	});
	$('#viewport').mouseup(function(event){
		if (event.button == 0)
			game.mouse.selectionStop();
	});
	$('#viewport').mouseout(function(){
		game.mouse.show_cursor = false;
	});
	$('#viewport').mousemove(function(event){
		game.mouse.show_cursor = true;
		game.mouse.position = {x: event.layerX, y: event.layerY};
	});
	
	$(document).keydown(function(event) {
		var prevent = true;
		switch (event.which)
		{
			case 37: //Left
				game.viewport_move_x = -1;
				break;
			case 39: //Right
				game.viewport_move_x = 1;
				break;
			case 38: //Up
				game.viewport_move_y = -1;
				break;
			case 40: //Down
				game.viewport_move_y = 1;
				break;
			case 65: //a - attack
				game.toggleActionState(ACTION_STATE_ATTACK);
				break;
			case 80: //p - pause/unpause game
				game.togglePause();
				break;
			case 83: //s - stop selected units
				game.shellStopButton();
				break;
			default:
				prevent = false;
		}
		if (prevent)
			event.preventDefault();
	});
	
	$(document).keyup(function(event) {
		var prevent = true;
		switch (event.which)
		{
			case 37: //Left
			case 39: //Right
				game.viewport_move_x = 0;
				break;
			case 38: //Up
			case 40: //Down
				game.viewport_move_y = 0;
				break;
			default:
				prevent = false;
		}
		if (prevent)
			event.preventDefault();
	});
});
