<?php

define('CURSOR_SIZE', 32);
define('VIEW_ICONS', 323);
define('START_POS', 12);

$fp = fopen(__DIR__ . '/../vendors/DarkReign/dark/graphics/INTFACE/MOUSE.CRS', 'rb');
fseek($fp, START_POS);
$img = imagecreatetruecolor(CURSOR_SIZE, CURSOR_SIZE*VIEW_ICONS);
$j = 0;
$colors = array();

//Generate palete
for ($i=0; $i<256; ++$i)
	$colors[$i] = imagecolorallocate($img, $i, $i, $i);

//$colors[0] = imagecolorallocate($img, 0, 0, 0);
//$colors[3] = imagecolorallocate($img, 14, 14, 14);
//$colors[4] = imagecolorallocate($img, 14, 14, 14);
//$colors[5] = imagecolorallocate($img, 26, 26, 26);
//$colors[6] = imagecolorallocate($img, 26, 26, 26);
//$colors[7] = imagecolorallocate($img, 38, 38, 38);
//$colors[8] = imagecolorallocate($img, 38, 38, 38);
//$colors[9] = imagecolorallocate($img, 50, 50, 50);
//$colors[10] = imagecolorallocate($img, 62, 62, 62);
//$colors[11] = imagecolorallocate($img, 136, 136, 136);
//$colors[12] = imagecolorallocate($img, 158, 158, 158);
//$colors[13] = imagecolorallocate($img, 172, 172, 172);
//$colors[14] = imagecolorallocate($img, 107, 107, 107);
//$colors[15] = imagecolorallocate($img, 255, 255, 255);
//$colors[29] = imagecolorallocate($img, 0, 80, 80);
////$colors[30] = imagecolorallocate($img, 0, 150, 49);
//$colors[30] = imagecolorallocate($img, 208, 255, 237);
//$colors[31] = imagecolorallocate($img, 0, 80, 0);
//$colors[38] = imagecolorallocate($img, 33, 33, 33);
//$colors[41] = imagecolorallocate($img, 106, 5, 10);
//$colors[43] = imagecolorallocate($img, 150, 21, 21);
//$colors[44] = imagecolorallocate($img, 176, 27, 27);
//$colors[46] = imagecolorallocate($img, 235, 42, 66);
//$colors[47] = imagecolorallocate($img, 255, 61, 91);
//$colors[54] = imagecolorallocate($img, 255, 184, 72);
//$colors[55] = imagecolorallocate($img, 255, 198, 107);
//$colors[57] = imagecolorallocate($img, 38, 38, 38);
//$colors[59] = imagecolorallocate($img, 37, 115, 0);
//$colors[60] = imagecolorallocate($img, 0, 128, 0);
//$colors[61] = imagecolorallocate($img, 0, 150, 49);
//$colors[63] = imagecolorallocate($img, 0, 185, 122);
//$colors[66] = imagecolorallocate($img, 0, 115, 115);
//$colors[67] = imagecolorallocate($img, 0, 115, 115);
//$colors[68] = imagecolorallocate($img, 0, 150, 150);
//$colors[71] = imagecolorallocate($img, 43, 255, 255);
//$colors[73] = imagecolorallocate($img, 0, 25, 80);
//$colors[74] = imagecolorallocate($img, 0, 37, 115);
//$colors[75] = imagecolorallocate($img, 0, 49, 150);
//$colors[77] = imagecolorallocate($img, 37, 87, 255);
//$colors[86] = imagecolorallocate($img, 150, 49, 0);
//$colors[90] = imagecolorallocate($img, 230, 230, 230);
//$colors[91] = imagecolorallocate($img, 255, 255, 255);
//$colors[92] = imagecolorallocate($img, 255, 255, 255);
//$colors[97] = imagecolorallocate($img, 115, 0, 7);
//$colors[98] = imagecolorallocate($img, 118, 6, 11);
//$colors[99] = imagecolorallocate($img, 169, 6, 6);
//$colors[101] = imagecolorallocate($img, 229, 38, 6);
//$colors[102] = imagecolorallocate($img, 241, 62, 6);
//$colors[104] = imagecolorallocate($img, 254, 110, 21);
//$colors[105] = imagecolorallocate($img, 254, 134, 35);
//$colors[106] = imagecolorallocate($img, 255, 181, 60);
//$colors[128] = imagecolorallocate($img, 38, 38, 38);
//$colors[134] = imagecolorallocate($img, 185, 122, 0);
//$colors[138] = imagecolorallocate($img, 98, 150, 0);
//$colors[152] = imagecolorallocate($img, 100, 28, 7);
//$colors[153] = imagecolorallocate($img, 64, 36, 14);
//$colors[154] = imagecolorallocate($img, 136, 86, 64);
//$colors[157] = imagecolorallocate($img, 37, 170, 255);
//$colors[158] = imagecolorallocate($img, 107, 198, 255);
//$colors[230] = imagecolorallocate($img, 128, 128, 128);
//$colors[255] = imagecolorallocate($img, 158, 158, 158);

for ($icon=0; $icon<VIEW_ICONS; ++$icon)
{
	$data = unpack('C1024', fread($fp, 1024));

	for ($i=0; $i<1024; ++$i)
	{
		imagesetpixel($img, $j%32, floor($j/32), $colors[$data[$i+1]]);
		$j++;
	}
}

fclose($fp);
header("Content-Type: image/png"); 
imagepng($img);
imagedestroy($img);