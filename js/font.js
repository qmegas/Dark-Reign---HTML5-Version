function DKFont()
{
	this._size = 14;
	this._space_size = 4;
	this._table = [
		 //  0        1        2        3        4        5        6        7        8        9        A        B        C        D        E        F 
		 [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], //0
		 [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], //1
		 [189,4],   [0,3],   [4,4],   [9,8],  [18,8], [27,10],  [38,8],  [47,3],  [51,5],  [57,5],  [63,6],  [70,5],  [76,2],  [79,4],  [84,2],  [87,6], //2
		  [94,6], [101,3], [105,6], [112,6], [119,6], [126,6], [133,6], [140,6], [147,6], [154,6], [161,2], [164,2], [167,6], [174,7], [182,6], [189,7], //3
		[197,13], [211,6], [218,6], [225,6], [232,6], [239,6], [246,6], [253,7], [261,6], [268,3], [272,6], [279,6], [286,5], [292,8], [301,6], [308,6], //4
		 [315,6], [322,7], [330,6], [337,6], [344,7], [352,6], [359,6], [366,8], [375,6], [382,6], [389,6], [396,3], [400,5], [406,3], [410,6], [417,7], //5
		 [425,3], [429,6], [436,6], [443,5], [449,6], [456,6], [463,4], [468,6], [475,6], [482,3], [486,4], [491,6], [498,3], [502,9], [512,6], [519,6], //6
		 [526,6], [533,6], [540,4], [545,6], [552,4], [557,6], [564,6], [571,8], [580,6], [587,6], [594,6], [601,4], [606,3], [610,4], [615,7], [189,7], //7
		 [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], //8
		 [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], //9
		 [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], //A
		 [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], //B
		 [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], //C
		 [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], //D
		 [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], //E
		 [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7], [189,7]  //F
	];
	
	this._buffer = $('#text_buffer').get(0).getContext('2d');
	
	this._cache_table = {};
	this._cache_offset = 0;
	
	this.drawOnCanvas = function(text, ctx, x, y, color, align, align_width)
	{
		var key = 'chached_text_'+text+color;
		
		if (typeof this._cache_table[key] === 'undefined')
		{
			this._cache_table[key] = {top: this._cache_offset, width: this._bufferDraw(text, color)};
			this._cache_offset += this._size;
		}
		
		switch (align)
		{
			case 'center':
				x += parseInt((align_width - this._cache_table[key].width)/2);
				break;
			case 'right':
				x += (align_width - this._cache_table[key].width);
				break;
			default:
				//No changes required for other types
				break;
		}
		
		ctx.drawImage(
			$('#text_buffer').get(0), 0, this._cache_table[key].top, this._cache_table[key].width, this._size,
			x+0.5, y+0.5, this._cache_table[key].width, this._size
		);
	}
	
	this.getSize = function(text)
	{
		var summ = 0;
		for (var i=0; i<text.length; ++i)
			summ += this._table[text.charCodeAt(i)][1];
		
		return summ;
	}
	
	this._bufferDraw = function(text, color)
	{
		var current_position = 0, ascii, letter, color_offset = this._getColorOffset(color), font = game.resources.get('font');
		
		for (var i=0; i<text.length; ++i)
		{
			ascii = text.charCodeAt(i);
			if (ascii == 32)
				current_position += this._space_size;
			else
			{
				letter = this._table[ascii];
				this._buffer.drawImage(
					font, letter[0], color_offset, letter[1], this._size, 
					current_position, this._cache_offset, letter[1], this._size
				);
				current_position += letter[1];
			}
		}
		
		return current_position;
	}
	
	this._getColorOffset = function(color)
	{
		switch (color)
		{
			case 'red':
				return 14;
			case 'green':
				return 28;
			default:
				return 0;
		}
	}
}