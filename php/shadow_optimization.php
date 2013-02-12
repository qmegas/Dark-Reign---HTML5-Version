<?php

function isBlack($img, $x, $y)
{
	$rgb = imagecolorat($img, $x, $y);
	//echo "isBlack: {$x},{$y} = {$rgb} - ".($rgb & 0xFFFFFF)."<br>";
	return (($rgb & 0xFFFFFF) == 0);
}

function haveBlackPixelY($img, $x, $y_from, $y_to)
{
	//echo "haveBlackPixelY {$x},{$y_from},{$y_to}<br>";
	for ($y = $y_from; $y < $y_to; $y++)
		if (isBlack($img, $x, $y))
			return true;
	return false;
}

function haveBlackPixelX($img, $y, $x_from, $x_to)
{
	//echo "haveBlackPixelX {$y},{$x_from},{$x_to}<br>";
	for ($x = $x_from; $x < $x_to; $x++)
		if (isBlack($img, $x, $y))
			return true;
	return false;
}

$file = 'C:\\Documents and Settings\\LENOVO User\\My Documents\\DR html\\Helpers\\1\\ee.png';
$rows = 6;
$cols = 8;

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
			if (haveBlackPixelY($img, $col*$col_size + $cur_pad, $row*$row_size, ($row+1)*$row_size))
			{
				$padding['left'] = $cur_pad;
				break;
			}
			$cur_pad++;
		}
		//echo "col {$col},{$row} = {$padding['left']}<br>";
		
		//Right padding
		$cur_pad = $col_size - 1;
		while ($cur_pad > $padding['right'])
		{
			if (haveBlackPixelY($img, $col*$col_size + $cur_pad, $row*$row_size, ($row+1)*$row_size))
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
			if (haveBlackPixelX($img, $row*$row_size + $cur_pad, $col*$col_size, ($col+1)*$col_size))
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
			if (haveBlackPixelX($img, $row*$row_size + $cur_pad, $col*$col_size, ($col+1)*$col_size))
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

//var_dump($padding);
//exit;

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
				
				if (isBlack($img, $orig_x, $orig_y))
					imagesetpixel($new_img, $col*$new_col_size + $x, $row*$new_row_size + $y, $black);
			}
		}
	}
}

header('Content-Type: image/png');

imagepng($new_img);
imagedestroy($new_img);
imagedestroy($img);