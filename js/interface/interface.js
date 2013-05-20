var InterfaceGUI = {
	_current_tab: 'panel_build',
		
	preloadImages: function()
	{
		//-- CSS --
		game.resources.addImage('css1', 'images/shell/load-screen.png');
		game.resources.addImage('css2', 'images/shell/load-bar.png');
		game.resources.addImage('css3', 'images/shell/money.png');
		game.resources.addImage('css4', 'images/shell/topbuttons.png');
		game.resources.addImage('css5', 'images/shell/money_numbers.png');
		game.resources.addImage('css6', 'images/shell/menutabs.png');
		game.resources.addImage('css7', 'images/shell/panel.png');
		game.resources.addImage('css8', 'images/shell/unit_box.png');
		game.resources.addImage('css9', 'images/shell/b_buttons.png');
		game.resources.addImage('css10', 'images/shell/minimap.png');
		game.resources.addImage('css11', 'images/shell/switches.png');
		game.resources.addImage('css12', 'images/shell/metrics.png');
		game.resources.addImage('css13', 'images/shell/buttons.png');
		game.resources.addImage('css14', 'images/shell/menu_icons.png');
		game.resources.addImage('css15', 'images/shell/slider_box.png');
		game.resources.addImage('css16', 'images/shell/slide_scale.png');
		game.resources.addImage('css17', 'images/shell/title.png');
		game.resources.addImage('css18', 'images/shell/order_check.png');
		game.resources.addImage('css19', 'images/shell/checkbox.png');
		//---------
		game.resources.addImage('map-tiles', 'images/levels/'+game.level.tiles);
		game.resources.addImage('minimap', 'images/levels/'+game.level.minimap.image);
		game.resources.addImage('clr', 'images/buildings/clr.png');
		game.resources.addImage('font', 'images/font.png');
	},
		
	tabChanged: function(tab_id)
	{
		this._current_tab = tab_id;
		this.updateOrdersTab();
	},
		
	updateOrdersTab: function()
	{
		if (this._current_tab != 'panel_orders')
			return;
		
		var i, info = game.selected_info.tactic_info, keys = ['pursuit', 'tolerance', 'independance'];
		
		(info.order == TACTIC_ORDER_SCOUT) ? $('#order_scout_chk').addClass('checked') : $('#order_scout_chk').removeClass('checked');
		(info.order == TACTIC_ORDER_HARASS) ? $('#order_harass_chk').addClass('checked') : $('#order_harass_chk').removeClass('checked');
		(info.order == TACTIC_ORDER_SND) ? $('#order_snd_chk').addClass('checked') : $('#order_snd_chk').removeClass('checked');
		
		$('#order_options .dk-order-chk').removeClass('checked');
		if (info.order == TACTIC_ORDER_DEFAULT)
		{
			for (i in keys)
			{
				if (info[keys[i]] == 0)
					continue;
				$('#order_'+keys[i]+'_'+info[keys[i]]).addClass('checked');
			}
		}
	},
	
	setHandlers: function()
	{
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
			var $this = $(this), panel_id = $this.attr('data-panel');

			$('.tab').removeClass('active');
			$this.addClass('active');

			if (panel_id)
			{
				$('.panel').addClass('hidden');
				$('#'+panel_id).removeClass('hidden');
				InterfaceGUI.tabChanged(panel_id);
			}
		});

		$('.unit-image').click(function(){
			var cellid = $(this).parent('div').attr('data-cell');
			InterfaceConstructManager.cellClick(cellid, 'left');
		});
		$('.unit-image').bind('contextmenu', function(){
			var cellid = $(this).parent('div').attr('data-cell');
			InterfaceConstructManager.cellClick(cellid, 'right');
			return false;
		});
		$('.unit-image').mouseover(function(){
			var cellid = $(this).parent('div').attr('data-cell'), position = $(this).offset();
			InterfaceConstructManager.cellPopupPrepere(cellid);

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
			InterfaceConstructManager.upgradePopupPrepere();

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
				MousePointer.selectionStart();
		});
		$('#viewport').mouseup(function(event){
			if (event.button == 0)
				MousePointer.selectionStop();
		});
		$('#viewport').mouseout(function(){
			MousePointer.show_cursor = false;
		});
		$('#viewport').mousemove(function(event){
			MousePointer.setPosition(event);
		});
		$('#cm_page_up').click(function(){
			InterfaceConstructManager.pageUp();
		});
		$('#cm_page_down').click(function(){
			InterfaceConstructManager.pageDown();
		});
		$('.scroll-box').live('mousedown', function(event){
			var $this = $(this), proc = parseInt(event.offsetX / $this.width() * 100);
			$this.children().css('width', proc + '%');
			game.changeGameParam($this.attr('data-param'), proc);
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
				case 48: //0
				case 49: //1
				case 50: //2
				case 51: //3
				case 52: //4
				case 53: //5
				case 54: //6
				case 55: //7
				case 56: //8
				case 57: //9
					if (event.ctrlKey)
						game.createTacticalGroup(event.which - 48);
					else
						game.selectTacticalGroup(event.which - 48);
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
	}
};