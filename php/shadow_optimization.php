<?php

/* Config */
$file = 'C:\\Documents and Settings\\LENOVO User\\My Documents\\tirep1l0_03.png';
//$file = 'F:\\My Docs\\DR Helpers\\Dark Reign 1.7\\utilities\\readsprites\\eoblalg0_00.png';
$output = 'C:\\Documents and Settings\\LENOVO User\\My Documents\\opt.png';
//$output = 'F:\\My Docs\\DR Helpers\\Dark Reign 1.7\\utilities\\readsprites\\eoblalg0_opt.png';
$rows = 3;
$cols = 1;
$shadow_mode = false;
/* Config */

$isBlack = function($img, $x, $y)
{
	$rgb = imagecolorat($img, $x, $y);
	//echo "isBlack: {$x},{$y} = {$rgb} - ".($rgb & 0xFFFFFF)."<br>";
	return (($rgb & 0xFFFFFF) == 0);
};

$isColored = function($img, $x, $y)
{
	$rgb = imagecolorat($img, $x, $y);
//	$i = ($rgb >> 24);
//	var_dump("isColored at ({$x},{$y}) = {$rgb} = {$i}");
	return (($rgb >> 24) != 127);
};

function haveUsedPixelY($img, $x, $y_from, $y_to, $not_empty_function)
{
	//echo "haveBlackPixelY {$x},{$y_from},{$y_to}<br>";
	for ($y = $y_from; $y < $y_to; $y++)
		if ($not_empty_function($img, $x, $y))
			return true;
	return false;
}

function haveUsedPixelX($img, $y, $x_from, $x_to, $not_empty_function)
{
	//echo "haveBlackPixelX {$y},{$x_from},{$x_to}<br>";
	for ($x = $x_from; $x < $x_to; $x++)
		if ($not_empty_function($img, $x, $y))
			return true;
	return false;
}



if ($shadow_mode)
{
	$not_empty_function = $isBlack;
}
else
{
	$not_empty_function = $isColored;
}

$stats = getimagesize($file);
if ($stats[2] != IMAGETYPE_PNG)
{
	echo 'Not a PNG!';
	exit;
}

$col_size = $stats[0] / $cols;
$row_size = $stats[1] / $rows;

$padding = array(
	'top' => $row_size,
	'bottom' => 0,
	'left' => $col_size,
	'right' => 0,
);

$img = imagecreatefrompng($file);

for ($row = 0; $row < $rows; $row++)
{
	for ($col = 0; $col < $cols; $col++)
	{
		//Left padding
		$cur_pad = 0;
		while ($cur_pad < $padding['left'])
		{
			if (haveUsedPixelY($img, $col*$col_size + $cur_pad, $row*$row_size, ($row+1)*$row_size, $not_empty_function))
			{
				$padding['left'] = $cur_pad;
				break;
			}
			$cur_pad++;
		}
//		echo "col {$col},{$row} = {$padding['left']}<br>";
//		continue;
		
		//Right padding
		$cur_pad = $col_size - 1;
		while ($cur_pad > $padding['right'])
		{
			if (haveUsedPixelY($img, $col*$col_size + $cur_pad, $row*$row_size, ($row+1)*$row_size, $not_empty_function))
			{
				$padding['right'] = $cur_pad;
				break;
			}
			$cur_pad--;
		}
		
		
		//Top padding
		$cur_pad = 0;
		while ($cur_pad < $padding['top'])
		{
			if (haveUsedPixelX($img, $row*$row_size + $cur_pad, $col*$col_size, ($col+1)*$col_size, $not_empty_function))
			{
				$padding['top'] = $cur_pad;
				break;
			}
			$cur_pad++;
		}
		
		//Bottom padding
		$cur_pad = $row_size - 1;
		while ($cur_pad > $padding['bottom'])
		{
			if (haveUsedPixelX($img, $row*$row_size + $cur_pad, $col*$col_size, ($col+1)*$col_size, $not_empty_function))
			{
				$padding['bottom'] = $cur_pad;
				break;
			}
			$cur_pad--;
		}
	}
}

$padding['right'] = $col_size - $padding['right'] - 1;
$padding['bottom'] = $row_size - $padding['bottom'] - 1;

print_r($padding);

//Create new sprite image
$new_col_size = $col_size - $padding['left'] - $padding['right'];
$new_row_size = $row_size - $padding['top'] - $padding['bottom'];

$new_img = imagecreatetruecolor($new_col_size*$cols, $new_row_size*$rows);
$black = imagecolorallocate($new_img, 0, 0, 0);
$white = imagecolorallocate($new_img, 255, 255, 255);

imagefill($new_img, 0, 0, $white);

imagecolortransparent($new_img, $white);

for ($row = 0; $row < $rows; $row++)
{
	for ($col = 0; $col < $cols; $col++)
	{
		for ($y = 0; $y < $new_row_size; $y++)
		{
			for ($x = 0; $x < $new_col_size; $x++)
			{
				$orig_x = $col*$col_size + $padding['left'] + $x;
				$orig_y = $row*$row_size + $padding['top'] + $y;
				
				if ($not_empty_function($img, $orig_x, $orig_y))
				{
					if ($shadow_mode)
					{
						imagesetpixel($new_img, $col*$new_col_size + $x, $row*$new_row_size + $y, $black);
					}
					else
					{
						$rgb = imagecolorat($img, $orig_x, $orig_y);
						$r = ($rgb >> 16) & 0xFF;
						$g = ($rgb >> 8) & 0xFF;
						$b = $rgb & 0xFF;
//						var_dump("{$rgb}: {$r}, {$g}, {$b}");
						$color = imagecolorallocate($new_img, $r, $g, $b);
						imagesetpixel($new_img, $col*$new_col_size + $x, $row*$new_row_size + $y, $color);
					}
				}
			}
		}
	}
}

//header('Content-Type: image/png');

imagepng($new_img, $output);
imagedestroy($new_img);
imagedestroy($img);