var DRAW_LAYER_GBUILD = 0;
var DRAW_LAYER_SHADOWS = 1;
var DRAW_LAYER_GUNIT = 2;
var DRAW_LAYER_TBUILD = 3;
var DRAW_LAYER_ABUILD = 4;
var DRAW_LAYER_FUNIT = 5;
var DRAW_LAYER_EFFECTS = 6;

function ObjectDraw()
{
	this._layers = [];
	
	this.clear = function()
	{
		this._layers = [{}, {}, {}, {}, {}, {}, {}];
	};
	
	this.addElement = function(layerid, index, draw_object)
	{
		if (typeof this._layers[layerid][index] == 'undefined')
			this._layers[layerid][index] = [];
		this._layers[layerid][index].push(draw_object);
	};
	
	this.draw = function()
	{
		var i, j, k;
		
		for (i=0; i<this._layers.length; ++i)
		{
			//console.time('_keySort')
			//this._keySort(i);
			//console.timeEnd('_keySort')

			for (j in this._layers[i])
				for (k=0; k<this._layers[i][j].length; ++k)
					this._drawElement(this._layers[i][j][k]);
		}
	};
	
	this._keySort = function(layerid)
	{
		var keys = Object.keys(this._layers[layerid]), i, len = keys.length, new_obj = {};
		
		if (len < 2)
			return;
		
		keys.sort();

		for (i = 0; i < len; ++i)
			new_obj[keys[i]] = this._layers[layerid][keys[i]];
		
		this._layers[layerid] = new_obj;
	};
	
	this._drawElement = function(element)
	{
		const resource = game.resources.get(element.res_key)
		if (resource) {
			game.viewport_ctx.drawImage(
				resource, 
				element.src_x, element.src_y, element.src_width, element.src_height, 
				element.x, element.y, element.src_width, element.src_height
			);
		}
	};
}