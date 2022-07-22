const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
let upload = multer({ dest: 'upload/' })

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods","PUT,GET,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers","X-Requestd-With");
    res.header("Access-Control-Allow-Headers","Content-Type");
    next();
})


app.post('/', upload.array('files'), (req, res) => {
    
    req.files.forEach(item => {
        let newPath = path.join(__dirname, 'upload', 'images', Date.now().toString() + item.originalname);
        let oldPath = path.join(__dirname, 'upload', item.filename)

        let from = fs.createReadStream(oldPath)
        let to = fs.createWriteStream(newPath)
        from.pipe(to)

        from.on('end', function() {
            fs.unlinkSync(oldPath)
        })

    })
    
    res.send({ code: 200 })
})


app.get('/', (req, res) => {
    let imgObj = {
        url: [],
    }
    fs.readdir(__dirname + '/upload/images', (err, files) => {
        if (err) {
            console.log(err)
        }
        else {
            files.forEach(item => {
                const webPathBase = 'http://localhost/uploadImg'
                let webPath = webPathBase + '/upload/images/' + item
                imgObj.url.push(webPath)
            })
            res.send(imgObj)
        }
    })
})

app.listen('8056', () => {
    console.log("running at http://localhost:8056/");
})
