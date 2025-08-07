
var USER_WORKER_TIMER = false;
var GAME_TIMER;

function Game()
{
	this.viewport_x = 0;
	this.viewport_y = 0;
	this.viewport_move_x = 0;
	this.viewport_move_y = 0;
	this.viewport_move_mouse_x = 0;
	this.viewport_move_mouse_y = 0;
	this.viewport_ctx = {};
	
	this.paused = false;
	this.started = false;
	
	this.resources = null
	this.fontDraw = null;
	
	this.level = null
	this.players = [];
	this.objects = [];
	this.effects = [];
	this.map_elements = [];
	this.kill_objects = [];
	this.selected_objects = [];
	this.selected_info = {};
	this.tactical_groups = {};
	
	//Drawers
	this.objDraw = new ObjectDraw();
	this.dialog = new InterfaceDialog();
	
	//Flags
	this.action_state = 0;
	this.action_state_options = {};
	this.interface_update_time = 0;
	this.minimap_navigation = false;

	//GameOver
	// TODO check game over
	
	this.debug = new Debuger();
	
	this.init = function(init_finish_callback)
	{
		if (!BrowserCheck.check()) {
			BrowserCheck.standartMessage();
			return;
		}

		$('.load-screen').show();
		$('.game').hide();

		// Handle UI onces		
		InterfaceGUI.setHandlers();	

		// Handle resize
		$(window).on('resize orientationchange devicepixelratiochange', () => {
			this.resizeViewPort()
		});

		window.addEventListener("hashchange", (event) => { 
			var level = (window.location.hash).substr(1);

			if (level) {
				this.loadLevel(level, () => {
					this.start();
				});
			}
		});
		
		// Load level via hash
		var level = (window.location.hash || '#fg1').substr(1);

		this.loadLevel(level, init_finish_callback);
	};

	this.loadLevel = function(level, init_finish_callback) {

		this.cancelDraw();

		this.level = level
 		this.resources = new ResourseLoader();

 		var levelUrl = './js/levels/' + this.level + '/map.js';
		this.resources.loadScript(levelUrl, () => {
			this.initLevel(init_finish_callback);
		});
	}
	
	this.addPlayer = function(player)
	{
		this.players[player.type] = player;
	};
	
	this.moveViewport = function(x, y, relative)
	{

		if (relative) {
			this.viewport_x += x*CELL_SIZE;
			this.viewport_y += y*CELL_SIZE;
		} else {
			this.viewport_x = x*CELL_SIZE;
			this.viewport_y = y*CELL_SIZE;
		}
		
		if (this.viewport_x < 0){
			this.viewport_x = 0;
		}
		
		if (this.viewport_y < 0){
			this.viewport_y = 0;
		}

		this.drawViewport(this.viewport_x, this.viewport_y);
	};

	this.drawViewport = function(x, y) {

		if (this.viewport_x > MousePointer.max_movement.x) {
			this.viewport_x = MousePointer.max_movement.x;
		}
		
		if (this.viewport_y > MousePointer.max_movement.y){
			this.viewport_y = MousePointer.max_movement.y;
		}
		
		$('#map_view, #map_fog').css({
			left: -this.viewport_x,
			top: -this.viewport_y
		}, 'fast');
		
		InterfaceMinimap.drawViewport();
	};

	this.resizeViewPort = function () {
		MousePointer.setMaxMovement(CurrentLevel);
	 	this.drawViewport(this.viewport_x, this.viewport_y);
	};

	this.initLevel = function(init_finish_callback)
	{	
		//State
		this.players = [];
		this.objects = [];
		this.effects = [];
		this.map_elements = [];
		this.kill_objects = [];
		this.selected_objects = [];
		this.selected_info = {};
		this.tactical_groups = {};
		
		//Flags
		this.action_state = 0;
		this.action_state_options = {};
		this.interface_update_time = 0;
		this.minimap_navigation = false;
			
		this.cancelDraw();

		this.viewport_ctx = $('#viewport').get(0).getContext('2d');
		
		var levelBuilder = new LevelBuilder(CurrentLevel);
		levelBuilder.build();
		
		// Weapon setup
		DamageTable.init();
			
		InterfaceFogOfWar.init(CurrentLevel);
		
		//Interface init
		InterfaceConstructManager.init(
			CurrentLevel.getAvailableUnits(), 
			CurrentLevel.getAvailableBuildings()
		);
		
		// Reset resources
		InterfaceMoneyDraw.init();
		InterfaceEnergyWaterDraw.init();

		InterfaceMinimap.init(CurrentLevel);
		MousePointer.setMaxMovement(CurrentLevel)
		
		//Preloading images
		InterfaceGUI.preloadImages(CurrentLevel);
		levelBuilder.loadMapElements();

		//Reset fonts
		this.fontDraw = null;

		this.resources.onLoaded = function(loaded, total){
			var progress = parseInt(500/total*loaded);
			$('#progress-bar').css({width: progress+'px'}, 'fast');
		};

		this.resources.onComplete = () => {
			this.fontDraw = new FontDraw('font', 14);
		
			this._resetSelectionInfo();

			this.moveViewport(
				CurrentLevel.start_positions[0].x - 10, 
				CurrentLevel.start_positions[0].y - 10, false
			);

			// Init units
			CurrentLevel.getInitUnits();
			
			// Generate map
			levelBuilder.generateMap();
			InterfaceFogOfWar.redrawFog();

			// Inut Gui
			InterfaceGUI.drawMenu();
			InterfaceConstructManager.drawUnits();
			InterfaceEnergyWaterDraw.drawAll();
			InterfaceMinimap.switchState();		
			MousePointer.init();

			$('.load-screen').hide();
			$('.game').show();

			this.draw();

			if (init_finish_callback) {
				init_finish_callback();				
			}
		};
		
		this._loadGameResources();
	};

	this.start = function()
	{
		var game = this;
		
		if (USER_WORKER_TIMER) {
			GAME_TIMER && WorkerTimers.clearTimeout(GAME_TIMER);
			(function render() {
				GAME_TIMER = WorkerTimers.setTimeout(function(){
					game.run();
					render();
				}, 1000 / RUNS_PER_SECOND);
			}());
		} else {

			GAME_TIMER && clearTimeout(GAME_TIMER);

			(function render() {
				GAME_TIMER = setTimeout(function(){
					game.run();
					render();
				}, 1000 / RUNS_PER_SECOND);
			}());
	
			/*			
			GAME_TIMER && clearInterval(GAME_TIMER)
			GAME_TIMER = setInterval(function(){
				game.run();
			}, 1000 / RUNS_PER_SECOND);
			*/
		}

		InterfaceMusicPlayer.start();

		this.paused = false;
		this.started = true;
	};

	this.stop = function() {

		if (USER_WORKER_TIMER) {
			GAME_TIMER && WorkerTimers.clearTimeout(GAME_TIMER);
		} else {

			GAME_TIMER && clearTimeout(GAME_TIMER);
		}

		InterfaceMusicPlayer.stop();
		
		this.paused = true;
		this.started = false;
	};

	this.restart = function() {

		// TODO pure restart
		//location.reload();
		this.stop();
		this.loadLevel(this.level, () => {
			this.start()
		})
	};

	this.save = function () {
		return JSON.stringify({
			players: this.players,
			objects: this.objects,
			selected_objects: this.selected_objects,
			tactical_groups: this.tactical_groups,
		})
	};


	this.load = function (str) {
		var data = JSON.parse(str)
		Object.assign(this, data)
	};
	
	this.run = function()
	{
		if (this.paused)
			return;
		
		var i;
		
		//Debug
		this.debug.countRun();
		
		//Kill objects
		var killedUnit = false;
		for (i = 0; i<this.kill_objects.length; ++i)
		{
			var unit = this.objects[this.kill_objects[i]];
			
			if (typeof unit === 'undefined')
				continue;
			
			unit.onObjectDeletion();

			//Mark Killed Units (vs Effects and Others Objects)
			killedUnit = killedUnit || (unit instanceof AbstractBuilding || unit instanceof AbstractUnit);
			
			//Remove user from selected array
			var sindex = this.selected_objects.indexOf(unit.uid);
			if (sindex != -1)
				this.selected_objects.splice(sindex, 1);
			
			//Delete object
			this.objects[this.kill_objects[i]] = null;
			delete this.objects[this.kill_objects[i]];
		}

		//Check for game over conditions
		if (killedUnit) {
			this._checkGameOver()
		}

		this.kill_objects = [];
		
		//Proceed objects
		for (i in this.objects)
			this.objects[i].run();
		
		//Move viewport
		var move_x = this.viewport_move_x, move_y = this.viewport_move_y;
		if (this.debug.mouse_panning && MousePointer.show_cursor)
		{
			if (this.viewport_move_mouse_x != 0)
				move_x = this.viewport_move_mouse_x;
			if (this.viewport_move_mouse_y != 0)
				move_y = this.viewport_move_mouse_y;
		}
		if (move_x!=0 || move_y!=0)
			this.moveViewport(move_x, move_y, true);
		
		//Money draw
		InterfaceMoneyDraw.draw();
	};

	this._checkGameOver = function() {

		var i, cur_unit;
		var playersUnits = {};
		for (i in this.objects) {	
			cur_unit = this.objects[i];
			if ((cur_unit instanceof AbstractBuilding || cur_unit instanceof AbstractUnit)) {
				playersUnits[cur_unit.player] = playersUnits[cur_unit.player] ? playersUnits[cur_unit.player] + 1 : 1;
			}
		}

		if (!playersUnits[PLAYER_HUMAN]) {
			this.gameOver(false)
		} else if (!playersUnits[PLAYER_COMPUTER1]) {
			this.gameOver(true)
		}
	}

	this.cancelDraw = function() {
		// Stop annimation
		if (this.requestAnimFrameTimer) {
			window.cancelAnimationFrame(this.requestAnimFrameTimer)
			console.count('cancelAnimationFrame')
		}
	};

	this.requestDraw = function() {
		this.requestAnimFrameTimer = window.requestAnimationFrame(() => {
			delete this.requestAnimFrameTimer
			this.draw();
		});
	};
	
	this.draw = function()
	{
		this.cancelDraw();
		this._draw();
		this.requestDraw();
	};
	
	this._draw = function()
	{
		var unitid, eindex, 
			onscreen = [], 
			mapelem_onscreen = []
			// If paused fo no animate
			cur_time = this.paused ? this.interface_update_time : Date.now();
		
		var top_x = parseInt(this.viewport_x / CELL_SIZE) - 1, 
			top_y = parseInt(this.viewport_y / CELL_SIZE) - 1;
		
		//Debug
		this.debug.countDraw();
		
		this.viewport_ctx.clearRect(0, 0, VIEWPORT_SIZE_X, VIEWPORT_SIZE_Y);
		MousePointer.clearView();
		this.objDraw.clear();
		
		//Detect onscreen units
		var max_y = VIEWPORT_SIZE_Y / CELL_SIZE,
			max_x = VIEWPORT_SIZE_X / CELL_SIZE;
		for (var y=0; y<max_y; ++y)
			for (var x=0; x<max_x; ++x)
			{
				if (CurrentLevel.map_cells[top_x+x] && CurrentLevel.map_cells[top_x+x][top_y+y])
				{
					//Preventing duplicate entries (for example building can be placed in few cells)
					
					if (CurrentLevel.map_cells[top_x+x][top_y+y].map_element != -1)
						mapelem_onscreen[CurrentLevel.map_cells[top_x+x][top_y+y].map_element] = 1;
					if (CurrentLevel.map_cells[top_x+x][top_y+y].building != -1)
						onscreen[CurrentLevel.map_cells[top_x+x][top_y+y].building] = 1;
					
					if (CurrentLevel.map_cells[top_x+x][top_y+y].fog == 0)
						continue;
					
					if (CurrentLevel.map_cells[top_x+x][top_y+y].ground_unit != -1)
					{
						onscreen[CurrentLevel.map_cells[top_x+x][top_y+y].ground_unit] = 1;
						//console.log('Unit %s on position %s:%s', CurrentLevel.map_cells[top_x+x][top_y+y].ground_unit, top_x+x, top_y+y);
					}
					if (CurrentLevel.map_cells[top_x+x][top_y+y].fly_unit != -1)
						onscreen[CurrentLevel.map_cells[top_x+x][top_y+y].fly_unit] = 1;
				}
			}
			
		//Round 1: Put units to draw heap
		for (unitid in onscreen)
			if (this.objects[unitid] !== undefined)
				this.objects[unitid].draw(cur_time);
		
		//Round 1.1: Put map elements to draw heap
		for (eindex in mapelem_onscreen)
			this.map_elements[eindex].draw();
		
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
		var mouse_pos = MousePointer.getCellPosition();
		unitid = -1;
		if (MapCell.isCorrectCord(mouse_pos.x, mouse_pos.y) && 
				CurrentLevel.map_cells[mouse_pos.x][mouse_pos.y].fog>0
		) {
			unitid = MapCell.getSingleUserId(CurrentLevel.map_cells[mouse_pos.x][mouse_pos.y]);
		}

		if (unitid != -1) {// && !this.objects[unitid].is_selected)
			this.objects[unitid].drawSelection(true);
		}
		
		//Round 5: Update fog of war
		InterfaceFogOfWar.redrawFog();
		
		//DEBUG: Unit placement
		if (this.debug.show_obj)
		{
			this.viewport_ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
			var start_x = parseInt(this.viewport_x/CELL_SIZE), start_y = parseInt(this.viewport_y/CELL_SIZE);
			for (var x=0; x<20; ++x)
			{
				if (CurrentLevel.map_cells[start_x+x] === undefined)
					continue;
				
				for (var y=0; y<20; ++y)
				{
					if (CurrentLevel.map_cells[start_x+x][start_y+y] === undefined)
						continue;
					
					if (MapCell.getSingleUserId(CurrentLevel.map_cells[start_x+x][start_y+y]) != -1)
						this.viewport_ctx.fillRect((start_x+x)*CELL_SIZE-this.viewport_x + 12, (start_y+y)*CELL_SIZE-this.viewport_y + 12, CELL_SIZE, CELL_SIZE);
				}
			}
		}

		//DEBUG: Ground type
		if (this.debug.show_type)
		{
			var start_x = parseInt((this.viewport_x-12)/CELL_SIZE), start_y = parseInt((this.viewport_y-12)/CELL_SIZE), skip;
			for (var x=0; x<20; ++x)
			{
				if (CurrentLevel.map_cells[start_x+x] === undefined)
					continue;
				
				for (var y=0; y<20; ++y)
				{
					if (CurrentLevel.map_cells[start_x+x][start_y+y] === undefined)
						continue;
					
					skip = false;
					switch (CurrentLevel.map_cells[start_x+x][start_y+y].type)
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
						this.viewport_ctx.fillRect((start_x+x)*CELL_SIZE-this.viewport_x + 12, (start_y+y)*CELL_SIZE-this.viewport_y + 12, CELL_SIZE, CELL_SIZE);
				}
			}
		}

		//DEBUG: Cells grid
		if (this.debug.show_grid)
		{
			this.viewport_ctx.strokeStyle = '#ffffff';
			this.viewport_ctx.beginPath();
			var start = CELL_SIZE - (this.viewport_x - parseInt(this.viewport_x/CELL_SIZE)*CELL_SIZE) - 11.5; 
			for (var i=0; i<20; ++i)
			{
				this.viewport_ctx.moveTo(start + i*CELL_SIZE, 0);
				this.viewport_ctx.lineTo(start + i*CELL_SIZE, VIEWPORT_SIZE_X);
			}
			start = CELL_SIZE - (this.viewport_y - parseInt(this.viewport_y/CELL_SIZE)*CELL_SIZE) - 11.5; 
			for (i=0; i<20; ++i)
			{
				this.viewport_ctx.moveTo(0, start + i*CELL_SIZE);
				this.viewport_ctx.lineTo(VIEWPORT_SIZE_Y, start + i*CELL_SIZE);
			}
			this.viewport_ctx.stroke();
		}

		//Mouse
		MousePointer.draw(cur_time);
		
		//Once per second update interface info
		if ((cur_time - this.interface_update_time) > 1000)
		{
			this.interface_update_time = cur_time;
			
			ActionsHeap.run();
			
			//Update producing canvases
			InterfaceConstructManager.redrawProductionState();
			
			//Update minimap
			InterfaceMinimap.drawObjects();
			
			//Energy
			InterfaceEnergyWaterDraw.enrgyNotification(cur_time);
			
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
		
		var delta = CurrentLevel.size.x / CurrentLevel.minimap.x,
			realx = parseInt((x-CurrentLevel.minimap.rect_x/2) * delta),
			realy = parseInt((y-CurrentLevel.minimap.rect_y/2) * delta);
			
		this.moveViewport(realx, realy, false);
	};
	
	this.onClick = function(button)
	{
		var pos = MousePointer.getCellPosition();
		
		if (button == 'left')
		{
			var cunit = MapCell.isFogged(pos) ? -1 : MapCell.getSingleUserId(CurrentLevel.map_cells[pos.x][pos.y]);
			if ((cunit !== -1) && this.objects[cunit].canBeSelected())
				this.regionSelect(pos.x, pos.y, pos.x, pos.y);
			
			//If not new selection move selected units
			if (cunit==-1 && this.selected_objects.length>0 && !this.selected_info.is_building)
				this.moveSelectedUnits(pos);
		}
		else
		{
			switch (this.action_state)
			{
				case ACTION_STATE_ATTACK:
					this.cleanActionState();
				case ACTION_STATE_NONE:
					this._deselectUnits();
					InterfaceConstructManager.drawUnits();
					break;
					
				default:
					this.cleanActionState();
					break;
			}
		}
	};
	
	this.moveSelectedUnits = function(pos)
	{
		for (var i in this.selected_objects)
			this.objects[this.selected_objects[i]].orderMove(pos.x, pos.y, (i==0));
	};
	
	this.regionSelect = function (x1, y1, x2, y2)
	{
		var x, y, cur_unit, play_sound = true;
		
		this._deselectUnits();
		
		//Select units
		for (x=x1; x<=x2; ++x)
			for (y=y1; y<=y2; ++y)
			{
				cur_unit = !CurrentLevel.map_cells[x] ?	-1 :
								MapCell.getSingleUserId(CurrentLevel.map_cells[x][y]);
				if ((cur_unit !== -1) && this.objects[cur_unit].canBeSelected())
				{
					//Do not select buildings on multiselect
					if (this.objects[cur_unit].is_building && (x1!=x2 || y1!=y2))
						continue;
					
					this.objects[cur_unit].select(true, play_sound);
					play_sound = false;
					
					this.selected_objects.push(cur_unit);
				}
			}
		
		this.rebuildSelectionInfo();
	};
	
	this.rebuildSelectionInfo = function(skip_constructor)
	{
		var i, cur_unit, 
			harvesters = false, 
			humans_only = true, 
			cyclones = true;
		
		for (i in this.selected_objects)
		{
			cur_unit = this.selected_objects[i];
			
			if (this.objects[cur_unit].is_building)
				this.selected_info.is_building = true;
			else
			{
				this.selected_info.min_mass = Math.min(this.selected_info.min_mass, this.objects[cur_unit]._proto.mass);
				harvesters = harvesters || this.objects[cur_unit].canHarvest();
				cyclones = cyclones || (this.objects[cur_unit]._proto == CycloneUnit);
				humans_only = humans_only || this.objects[cur_unit].isHuman();
				this.selected_info.move_mode = Math.max(this.selected_info.move_mode, this.objects[cur_unit]._proto.move_mode);
				this.selected_info.move_mode_min = Math.min(this.selected_info.move_mode, this.objects[cur_unit]._proto.move_mode);
				
				if (i == 0)
					this.selected_info.tactic_info = cloneObj(this.objects[cur_unit].tactic);
				else
				{
					if (this.objects[cur_unit].tactic.order != this.selected_info.tactic_info.order)
						this.selected_info.tactic_info.order = 0;
					if (this.objects[cur_unit].tactic.pursuit != this.selected_info.tactic_info.pursuit)
						this.selected_info.tactic_info.pursuit = 0;
					if (this.objects[cur_unit].tactic.tolerance != this.selected_info.tactic_info.tolerance)
						this.selected_info.tactic_info.tolerance = 0;
					if (this.objects[cur_unit].tactic.independance != this.selected_info.tactic_info.independance)
						this.selected_info.tactic_info.independance = 0;
				}
			}
			
			this.selected_info.can_attack_ground = this.selected_info.can_attack_ground || this.objects[cur_unit].canAttackGround();
			this.selected_info.can_attack_fly = this.selected_info.can_attack_fly || this.objects[cur_unit].canAttackFly();
		}
		
		if (this.selected_objects.length > 0)
		{	
			this.selected_info.harvesters = harvesters;
			this.selected_info.cyclones = cyclones;
			this.selected_info.humans = humans_only;
		}
			
		//Constructor selected?
		if (!skip_constructor)
		{
			if (this.selected_objects.length==1 && (this.objects[this.selected_objects[0]] instanceof ConstructionRigUnit))
				InterfaceConstructManager.drawBuildings();
			else
				InterfaceConstructManager.drawUnits();
		}
		
		InterfaceGUI.updateOrdersTab();
	};
	
	this._deselectUnits = function()
	{
		this._resetSelectionInfo();
		for (var i in this.selected_objects)
			this.objects[this.selected_objects[i]].select(false);
		this.selected_objects = [];
		
		InterfaceGUI.updateOrdersTab();
	};
	
	this._loadGameResources = function()
	{
		//Mouse
		MousePointer.loadResources();
		
		//Common resources
		this.resources.addImage('fogofwar', 'images/fog.png');
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
		this.resources.addSound('fixed', 'sounds/gxrepoc0.' + AUDIO_TYPE);
		this.resources.addSound('water_sell', 'sounds/gxcrdoc0.' + AUDIO_TYPE);
		this.resources.addSound('teleport', 'sounds/gxtgtoc0.' + AUDIO_TYPE);
		this.resources.addSound('unit_generation_in_progress', 'sounds/gvstscl3.' + AUDIO_TYPE);
		for (var i=0; i<10; ++i)
			this.resources.addSound('tactical_group' + ((i+1)%10), 'sounds/gvselcl' + i + '.' + AUDIO_TYPE);
		
		//Effects
		CraterEffect.loadResources();
		
		Animator.loadResources();
		WeaponHolder.loadResources();
	};
	
	this.unselectUnit = function(uid)
	{
		var index = this.selected_objects.indexOf(uid);
		if (index != -1)
		{
			this.objects[uid].select(false);
			this.selected_objects.splice(index, 1);
			
			this._resetSelectionInfo();
			this.rebuildSelectionInfo(true);
		}
	};
	
	this._resetSelectionInfo = function()
	{
		this.selected_info = {
			is_building: false,
			move_mode: 0,
			move_mode_min: MOVE_MODE_FLY,
			is_produce: false,
			can_attack_ground: false,
			can_attack_fly: false,
			humans: false,
			min_mass: 999,
			
			harvesters: false,
			cyclones: false,
			
			tactic_info: {
				order: 0,
				pursuit: 0,
				tolerance: 0,
				independance: 0
			}
		};
	};
	
	this.buildingUpgrade = function()
	{
		var upgraded = false;
		
		if (this.selected_info.is_building && this.objects[this.selected_objects[0]].isUpgradePossible())
		{
			var new_obj, old_obj = this.objects[this.selected_objects[0]], pos;
			
			if (this.players[PLAYER_HUMAN].haveEnoughMoney(old_obj._proto.upgrade_to.cost))
			{
				pos = old_obj.getCell();
				new_obj = new old_obj._proto.upgrade_to(pos.x, pos.y, old_obj.player);
			
				new_obj.uid = old_obj.uid;
				new_obj.health = old_obj.health;
				delete old_obj;
				this.objects[new_obj.uid] = new_obj;
				
				var time = (this.debug.quick_build) ? 2 : new_obj._proto.build_time;
				ActionsHeap.add(new_obj.uid, 'construct', {
					steps: time,
					current: 0,
					money: parseInt(new_obj._proto.cost / time),
					health: Math.ceil(new_obj._proto.health_max / time)
				});
				
				upgraded = true;
			}
		}
		
		if (!upgraded)
			this.resources.play('cant_build');
	};
	
	this.toggleActionState = function(state)
	{
		var prev_state = this.action_state;
		
		// Toggle
		if (prev_state == state) {
			this.cleanActionState();
			return;
		}

		if (prev_state != ACTION_STATE_NONE)
			this.cleanActionState();
		
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
				InterfaceConstructManager.removeCellSelection();
				this._deselectUnits();
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
		effect.uid = uid;
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
	
	/**
	 * @param AbstractBuilding object_type
	 * @param int player Player ID
	 * @param int x
	 * @param int y
	 * @returns AbstractBuilding
	 */
	this.findNearestInstance = function(object_type, player, x, y)
	{
		var len = 99999, obj = null, i, tmp_path, cell;
		
		if (object_type.count[player] == 0)
			return null;
		
		for (i in this.objects)
		{
			if ((this.objects[i] instanceof object_type) && (this.objects[i].player == player))
			{
				cell = this.objects[i].getCell();
				if (cell.x==x && cell.y==y)
					return this.objects[i];
				
				tmp_path = PathFinder.findPath(x, y, cell.x, cell.y, MOVE_MODE_FLY, false);
				if ((tmp_path.length > 0) && (len > tmp_path.length))
				{
					len = tmp_path.length;
					obj = this.objects[i];
				}
			}
		}
		
		return obj;
	};

	this.gameOver = function(winner) {
		if(this.started) {
			
			this.stop();

			this.dialog.setOptions({
				text: winner ? 'Victory' : 'Game Over',
				buttons: [{
					text: 'Restart',
					callback: () => {
						this.dialog.hide();
						this.restart();
					}
				}]
			});
			this.dialog.show();
		}
	}
	
	this.togglePause = function()
	{
		this.paused = !this.paused;
		
		if (this.paused)
		{
			this.dialog.setOptions({
				text: 'Game Paused',
				buttons: [{
					text: 'Continue',
					callback: () => {
						this.togglePause();
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
	
	this.createTacticalGroup = function(id)
	{
		if (this.selected_objects.length == 0)
			return;
		
		var i, obj_id, fnd_indx;
		
		if ((this.tactical_groups[id] !== undefined) && (this.tactical_groups[id].length > 0))
		{
			for (i in this.tactical_groups[id])
			{
				obj_id = this.tactical_groups[id][i];
				if (this.objects[obj_id] === undefined)
					continue;
				this.objects[obj_id].tactic_group = -1;
			}
		}
		
		this.tactical_groups[id] = this.selected_objects;
		for (i in this.tactical_groups[id])
		{
			obj_id = this.tactical_groups[id][i];
			if (this.objects[obj_id].tactic_group != -1)
			{
				fnd_indx = this.tactical_groups[this.objects[obj_id].tactic_group].indexOf(obj_id);
				if (fnd_indx != -1)
					this.tactical_groups[this.objects[obj_id].tactic_group].splice(fnd_indx, 1);
			}
			this.objects[obj_id].tactic_group = id;
		}
	};
	
	this.selectTacticalGroup = function(id)
	{
		if (this.tactical_groups[id] === undefined)
			return;
		
		var i, obj_id, toselect = [];
		
		for (i in this.tactical_groups[id])
		{
			obj_id = this.tactical_groups[id][i];
			if (this.objects[obj_id] === undefined)
				continue;
			toselect.push(obj_id);
		}
		this.tactical_groups[id] = toselect;
		
		if (toselect.length > 0)
		{
			this._deselectUnits();
			for (i in toselect)
			{
				this.objects[toselect[i]].select(true, false);
				this.objects[toselect[i]].tactic_group = id;
				this.selected_objects.push(toselect[i]);
			}
			this.rebuildSelectionInfo();
			InterfaceSoundQueue.addIfEmpty('tactical_group' + id);
		}
	};
	
	this.changeGameParam = function(param, value)
	{
		switch (param)
		{
			case 'sound_volume':
				this.resources.setSoundVolume(value/100);
				break;
			case 'music_volume':
				InterfaceMusicPlayer.setVolume(value/100);
				break;
			case 'game_speed':
				// Max, 120, Min 0, Default: 50
				RUNS_PER_SECOND = Math.min(120, Math.max(1, value))
				console.warn('RUNS_PER_SECOND', RUNS_PER_SECOND);
				startInterval(game)
				break;

			case 'panning_speed':
				// min, 120, Max 1, Default: 50
				ANIMATION_SPEED = Math.min(120, Math.max(1, value))
				console.warn('ANIMATION_SPEED', ANIMATION_SPEED);
				break;

		}
	};
}

$(function(){
	var img = new Image();
	img.src = 'images/interface/load-screen.png';
	img.onload = () => {
		game = new Game();
		game.init(() => {
			game.start()
		});
	};
});
