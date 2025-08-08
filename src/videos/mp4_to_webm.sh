rm *.webm
for i in *.mp4;
  do name=`echo "$i" | cut -d'.' -f1`
  echo "$name"
  ffmpeg -i "$i" -filter:v "setpts=2.5*PTS" -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis "${name}.webm"
done