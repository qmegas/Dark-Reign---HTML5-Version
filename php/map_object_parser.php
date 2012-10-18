<?php

class MapObjectParser
{
	public function parse($text)
	{
		$items = array();
		preg_match_all('/AddThingAt\(([0-9]+) ([a-z|0-9]+) ([0-9]+) ([0-9]+)\)/', $text, $matches);
		
		foreach ($matches[1] as $key => $val)
			$items[] = array(
				'type' => $matches[2][$key],
				'x' => (int)$matches[3][$key],
				'y' => (int)$matches[4][$key]
			);

		usort($items, array($this, 'sorter'));
		return $items;
	}
	
	protected function sorter($a, $b)
	{
		if ($a['y'] == $b['y'])
			return ($a['x'] < $b['x']) ? -1 : 1;
		else
			return ($a['y'] < $b['y']) ? -1 : 1;
	}
}

$view = false;
if (isset($_POST['text']))
{
	$view = true;
	$p = new MapObjectParser();
	$data = $p->parse($_POST['text']);
}
?>

<?php if ($view) : ?>
<div style="border: 1px">
	<?php foreach ($data as $item) : ?>
	{key: '<?=$item['type']?>', x: <?=$item['x']?>, y: <?=$item['y']?>},<br/>
	<?php endforeach; ?>
</div>
<?php else : ?>
<form action="" method="post">
	<textarea name="text" rows="30" cols="100"></textarea><br/>
	<input type="submit" value="Parse" />
</form>
<?php endif; ?>