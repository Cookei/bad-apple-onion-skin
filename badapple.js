const fs = require("fs")
const ffmpeg = require('ffmpeg')
const canvas = require('canvas')
global.Image = canvas.Image
const onionDistance = 15
const frameSkip = 3

const frames = []
const totalFrames = fs.readdirSync("frames").length
try {
    let process = new ffmpeg("badapple.mp4")
    process.then(function (video) {
        //convert video to frame images
        video.fnExtractFrameToJPG("frames/", {
            every_n_frames: 1,
        }, (err, files) => {
            if (err) {
                console.log(err)
            }
            else {
                createNewFrames()
            }
        })
        video.fnExtractSoundToMP3("badapple.mp3")
    }, (err) => {
        console.log("Error: " + err)
    })
} catch (e) {
    console.log(e.code)
    console.log(e.msg)
}

//put images in array
function createNewFrames() {
    let imageCount = 0
    for (let i = 1; i <= totalFrames; i++) {
        const image = canvas.loadImage("frames/badapple_" + i + ".jpg")
        image.then((e) => {
            imageCount++
            frames.push(e)
            if (imageCount >= totalFrames) {
                onionSkin()
            }
        })
    }
}

function onionSkin() {
    frames.forEach((frame, index) => {
        const cnv = canvas.createCanvas(480, 360)
        const ctx = cnv.getContext('2d')
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, cnv.width, cnv.height)

        //loop through previous onion skin
        for (let i = index - onionDistance; i < index; i += frameSkip) {
            const onionCanvas = canvas.createCanvas(cnv.width, cnv.height)
            const onionCtx = onionCanvas.getContext('2d')
            if (frames[i] != undefined) {
                onionCtx.drawImage(frames[i], 0, 0)
                let frameDataObj = onionCtx.getImageData(0, 0, onionCanvas.width, onionCanvas.height)
                let frameData = frameDataObj.data
                //change pixel colors
                for (let j = 0; j < frameData.length; j += 4) {
                    //if pixel color is not white, then set opacity to 0
                    frameData[j + 3] = 255 - frameData[j]
                    //change color to green
                    frameData[j] = 0
                    frameData[j + 1] = 255
                    frameData[j + 2] = 0
                    frameData[j + 3] -= 220
                    if (frameData[j + 3] < 0) frameData[j + 3] = 0
                }
                onionCtx.putImageData(frameDataObj, 0, 0)
            }
            let onion = new Image()
            onion.src = onionCanvas.toDataURL()
            ctx.drawImage(onion, 0, 0)
        }

        const tempCnv = canvas.createCanvas(cnv.width, cnv.height)
        const tempCtx = tempCnv.getContext("2d")
        tempCtx.drawImage(frame, 0, 0)
        let originalDataObj = tempCtx.getImageData(0, 0, cnv.width, cnv.height)
        let originalData = originalDataObj.data
        for (let i = 0; i < originalData.length; i += 4) {
            originalData[i + 3] = 255 - originalData[i]
        }
        tempCtx.putImageData(originalDataObj, 0, 0)
        let tempImage = new Image()
        tempImage.src = tempCnv.toDataURL()
        ctx.drawImage(tempImage, 0, 0)
        //loop through after onion skin
        for (let i = index + onionDistance; i > index; i -= frameSkip) {
            const onionCanvas = canvas.createCanvas(cnv.width, cnv.height)
            const onionCtx = onionCanvas.getContext('2d')
            if (frames[i] != undefined) {
                onionCtx.drawImage(frames[i], 0, 0)
                let frameDataObj = onionCtx.getImageData(0, 0, onionCanvas.width, onionCanvas.height)
                let frameData = frameDataObj.data
                //change pixel colors
                for (let j = 0; j < frameData.length; j += 4) {
                    //if pixel color is not black, then set opacity to 0
                    frameData[j + 3] = 255 - frameData[j]
                    //change color to red
                    frameData[j] = 255
                    frameData[j + 1] = 0
                    frameData[j + 2] = 0
                    frameData[j + 3] -= 220
                    if (frameData[j + 3] < 0) frameData[j + 3] = 0
                }
                onionCtx.putImageData(frameDataObj, 0, 0)
            }
            let onion = new Image()
            onion.src = onionCanvas.toDataURL()
            ctx.drawImage(onion, 0, 0)
        }

        console.log("Index: " + index)
        let path = "output/badapple_" + (index + 1) + ".png"
        const out = fs.createWriteStream(path)
        const stream = cnv.createPNGStream()
        stream.pipe(out)
    })
}