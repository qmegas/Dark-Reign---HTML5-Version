var CraterEffect = {
	items: {
		crater0: {
			padding: {x: 0, y: 0}
		},
		crater1: {
			padding: {x: 11, y: 8}
		},
		crater2: {
			padding: {x: 22, y: 17}
		},
		crater3: {
			padding: {x: 23, y: 18}
		},
		crater4: {
			padding: {x: 35, y: 34}
		}
	},
		
	create: function(obj)
	{
		var ctx = $('#map_view').get(0).getContext('2d'), type = 'crater' + obj._proto.crater;
		ctx.drawImage(
			game.resources.get(type), 
			obj.position.x + obj._proto.cell_padding.x * CELL_SIZE - this.items[type].padding.x,
			obj.position.y + obj._proto.cell_padding.y * CELL_SIZE - this.items[type].padding.y
		);
	},
		
	loadResources: function()
	{
		for (var i in this.items)
			game.resources.addImage(i, 'images/effects/craters/'+i+'.png');
	}
};