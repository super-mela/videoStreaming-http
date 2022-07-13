const express = require("express")
const fs = require('fs')
const path = require("path")
const app = express()
const LiveCam = require('livecam');

const videoPath = './asset/ProudAfricanCampaign.mkv'

const webcam_server = new LiveCam({
    'start': function () {
        console.log("webcam server started!");
    }
})

app.get("/", (res, req) => {
    res.res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/video', (res, req) => {

    const range = req.req.headers.range;
    const videoSize = fs.statSync(videoPath).size;

    const chunkSize = 1 * 1e+6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start * chunkSize, videoSize - 1);
    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Range": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }

    res.res.writeHead(206, headers);

    const stream = fs.createReadStream(videoPath, { start, end })
    stream.pipe(res.res);
})

app.listen("4000", function () {
    console.log("server connected on 4000")
});

webcam_server.broadcast();