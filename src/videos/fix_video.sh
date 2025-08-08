rm output_video.mp4
echo $1
ffmpeg -i $1 -filter:v "setpts=0.25*PTS" -an output_video.mp4
ffmpeg -i output_video.mp4 -i cube02.mp4 -c:v copy -map 0:v -map 1:a -shortest "_$1"
