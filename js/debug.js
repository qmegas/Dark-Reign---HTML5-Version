function Debuger()
{
	this.quick_build = false;
	this.show_obj = false;
	this.show_type = false;
	this.show_grid = false;
	
	var me = this;
	
	$('#debug_quick_build').click(function(){
		me.quick_build = $(this).is(':checked');
	});
	$('#debug_show_obj').click(function(){
		me.show_obj = $(this).is(':checked');
	});
	$('#debug_show_type').click(function(){
		me.show_type = $(this).is(':checked');
	});
	$('#debug_show_grid').click(function(){
		me.show_grid = $(this).is(':checked');
	});
	
	$('#debug_add_money').click(function(){
		game.players[PLAYER_HUMAN].addMoney(15000);
	});
}