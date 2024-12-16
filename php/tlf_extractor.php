<?php

$index_file = __DIR__ . "/../vendors/DarkReign/dark/shell/shell.rli";
$data_file = __DIR__ . "/../vendors/DarkReign/dark/shell/shell.rld";
$outdir = __DIR__ . "/../vendors/";


$fp = fopen($index_file, 'rb');
$fd = fopen($data_file, 'rb');
if  (!$fp || !$fd)
	exit('File not found');

fseek($fp, 12);
while (!feof($fp))
{
	/*
	 * 12 - File name
	 * 4  - Type ?
	 * 4  - Unknown
	 * 4  - Offset
	 * 4  - Size
	 * 4  - Unknown 2
	 */
	$bytes = fread($fp, 32);
	if (!empty($bytes))
	{
		$idata = unpack('a12name/a4type/Lunknown/Loffset/Lsize/Lunk', $bytes);
		echo "Extracting: {$idata['name']}.tlf<br>\n";
		
		fseek($fd, $idata['offset']);
		$data = fread($fd, $idata['size']);
		
		$fi = fopen($outdir.$idata['name'].'.tlf', 'wb');
		fwrite($fi, $data);
		fclose($fi);
	}
}
fclose($fp);
