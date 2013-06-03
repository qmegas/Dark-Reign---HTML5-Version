<?php

$index_file = "C:\\Documents and Settings\\LENOVO User\\My Documents\\DR html\\Helpers\\Dark Reign 1.7\\DARK\\SHELL\\shell.rli";
$data_file = "C:\\Documents and Settings\\LENOVO User\\My Documents\\DR html\\Helpers\\Dark Reign 1.7\\DARK\\SHELL\\shell.rld";
$outdir = "C:\\Documents and Settings\\LENOVO User\\My Documents\\DR html\\Helpers\\tests\\1\\";

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
