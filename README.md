# bad-apple-onion-skin

[[!Video](http://img.youtube.com/vi/n_fwUL_BDxY/0.jpg)](https://www.youtube.com/watch?v=n_fwUL_BDxY)

# Instructions
> Install all node modules\
> Install ffmpeg\
> Add badapple.mp4 to root filepath\
> Create frames and output directories\
> Run badapple.js\
> Run `ffmpeg -framerate 30 -i output/badapple_%d.png -i badapple.mp3 -c:a copy -shortest -c:v libx264 -pix_fmt yuv420p out.mp4`
