const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer')
const ffmpeg = require('fluent-ffmpeg')

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if(ext !== '.mp4') {
      return cb(res.status(400).end('only mp4 is allowed'), false)
    }
    cb(null, true)
  }
})

const upload = multer({ storage: storage }).single("file")

//=================================
//             Video
//=================================

// 비디오 정보를 저장한다.
router.post('/uploadVideo', (req, res) => {
  const video = new Video(req.body)
  video.save((err, doc) => {
    if(err) return res.json({ success: false, err })
    res.status(200).json({ success: true })
  })
})

router.post('/uploadfiles', (req, res) => {
  // 비디오를 서버에 저장하면 된다
  upload(req, res, err => {
    if(err) {
      return res.json({ success: false, err })
    }
    return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
  })
})

router.post('/thumbnail', (req, res) => {
  // 썸네일 생성, 비디오의 러닝타임 가져온후 서버에 저장하면 된다
  let filePath = ''
  let fileDuration = ''

  // 비디오의 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.log(metadata)
    console.log(metadata.format.duration)
    fileDuration = metadata.format.duration
  })

  // 썸네일 생성하기
  ffmpeg(req.body.url)
  .on('filenames', function(filenames) {
    console.log(filenames)
    console.log('Will generate ' + filenames.join(', '))

    filePath = 'uploads/thumbnails/' + filenames[0]
  })
  .on('end', function() {
    console.log('Screenshosts taken')
    return res.json({ success: true, url: filePath, fileDuration: fileDuration })
  })
  .on('error', function(err) {
    console.log(err)
    return res.json({ success: false, err })
  })
  .screenshots({
    count: 3,
    folder: 'uploads/thumbnails',
    size: '320x240',
    filename: 'thumbnail-%b.png'
  })
})

module.exports = router;
