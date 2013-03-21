function WaterLaunchPadBuilding(pos_x, pos_y, player)
{
	this._proto = WaterLaunchPadBuilding;
	this.player = player;
	
	this.res_now = 0;
	this.res_max = 200;
	
	this.init(pos_x, pos_y);
	
	//Custom selection bar
	this.drawSelection = function(is_onmouse)
	{
		this._drawSelectionStandart(is_onmouse);
		
		var top_x = this.position.x - 4 - game.viewport_x,
			top_y = this.position.y + CELL_SIZE*this._proto.cell_size.y - 45 - game.viewport_y, 
			water_h = parseInt((this.res_now/this.res_max)*46);
			
		game.viewport_ctx.fillStyle = '#000000';
		game.viewport_ctx.fillRect(top_x, top_y, 4, 48);
		
		if (this.res_max > this.res_now)
		{
			game.viewport_ctx.fillStyle = '#bbbbbb';
			game.viewport_ctx.fillRect(top_x + 1, top_y + 1, 2, 46);
		}
		
		game.viewport_ctx.fillStyle = '#00a5ff';
		game.viewport_ctx.fillRect(top_x + 1, top_y + 47 - water_h, 2, water_h);
	};
	
	this.onConstructedCustom = function() 
	{
		var cell = this.getCell();
		AbstractUnit
			.createNew(FreighterUnit, cell.x + 3, cell.y + 1, this.player, true)
			.orderHarvest(this);
	};
	
	this.isHarvestPlatform = function()
	{
		return true;
	};
	
	this.increaseRes = function(amount)
	{
		var incr = this._standardIncreaseRes(amount);
		
		if (this.player == PLAYER_HUMAN)
			game.energyDraw.waterSetLevel(this.res_now);
		
		if (this.isResFull())
			this.sellWater();
		
		return incr;
	};
	
	this.sellWater = function()
	{
		var money = 0;
		
		if (this.isResFull())
			money = 3000;
		else
			money = parseInt(this.res_now * 15 - 500);
		
		if (money > 0)
		{
			this.res_now = 0;
			game.players[this.player].addMoney(money);
			
			var effect = new WaterSellEffect(this.getCell()), eid = game.addEffect(effect);
			effect.uid = eid;
			
			if (this.player == PLAYER_HUMAN)
				game.energyDraw.waterReset();
		}
	};
}

AbstractBuilding.setBuildingCommonOptions(WaterLaunchPadBuilding);

WaterLaunchPadBuilding.res_key = 'water_launch';
WaterLaunchPadBuilding.obj_name = 'Water Launch Pad';
WaterLaunchPadBuilding.cost = 2500;
WaterLaunchPadBuilding.build_time = 30;
WaterLaunchPadBuilding.sell_cost = 1250;
WaterLaunchPadBuilding.sell_time = 15;
WaterLaunchPadBuilding.health_max = 1300;
WaterLaunchPadBuilding.energy = 100;
WaterLaunchPadBuilding.enabled = true;
WaterLaunchPadBuilding.can_build = true;
WaterLaunchPadBuilding.crater = 1;

WaterLaunchPadBuilding.cell_size = {x: 5, y: 3};
WaterLaunchPadBuilding.cell_matrix = [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0];
WaterLaunchPadBuilding.move_matrix = [0,1,0,0,1,1,1,1,1,1,0,0,0,0,0];
WaterLaunchPadBuilding.cell_padding = {x: 2, y: 1};
WaterLaunchPadBuilding.images = {
	normal: {
		size: {x: 112, y: 77},
		padding: {x: -10, y: 7}
	},
	shadow: null
};