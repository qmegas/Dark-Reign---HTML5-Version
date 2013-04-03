<?php

$source_file = 'C:\\Documents and Settings\\LENOVO User\\My Documents\\DR html\\Helpers\\Dark Reign 1.7\\DARK\\sndfx\\SOUNDS.FTG';
$output_dir = 'C:\\Documents and Settings\\LENOVO User\\My Documents\\DR html\\Helpers\\sounds\\';

$fh = fopen($source_file, 'rb');
if (!$fh)
	throw new Exception('Source file not found');

fseek($fh, 4);
$meta = unpack('Lindex/Lcount', fread($fh, 8));

fseek($fh, $meta['index']);

for ($i=0; $i<$meta['count']; ++$i)
{
	$file_info = unpack('a28name/Loffset/Lsize', fread($fh, 36));
	$stored_position = ftell($fh);
	
	echo 'Extracting: '.$file_info['name']."\n";
	
	$sf = fopen($output_dir.$file_info['name'], 'wb');
	fseek($fh, $file_info['offset']);
	fwrite($sf, fread($fh, $file_info['size']));
	fclose($sf);
	
	fseek($fh, $stored_position);
}

fclose($fh);