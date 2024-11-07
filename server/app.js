const express = require('express')
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const File = require('./fileSchema')
const { v4: uuidv4 } = require('uuid');

const app = express()
const PORT = 3300 || process.env.PORT


mongoose.connect('mongodb://localhost:27017/fileData')


const diskStorage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});


const upload = multer({ storage: diskStorage })


app.get('/', (req, res) => {
    res.send('Hello')
})

app.post('/upload', upload.single('file'), async (req, res) => {
    if (req.file) {
        const uniqueIdentifier = uuidv4()
        const newFile = new File({
            fileName: req.file.originalname,
            path: path.join(__dirname, `uploads/${req.file.filename}`),
            uniqueIdentifier: uniqueIdentifier
        })
        await newFile.save()
        res.send(`File uploaded successfully! <a href='http://localhost:${PORT}/uploads?id=${uniqueIdentifier}'>${uniqueIdentifier}</a>`)
    } else {
        res.send("Some error occurred!")
    }
})


app.get('/uploads', async(req, res) => {
    const id = req.query.id
    const filePath = await File.findOne({ uniqueIdentifier: `${id}` })    
    if (!filePath) {
        return res.status(404).send('File not found');
    }
    res.setHeader('Content-Disposition', `inline; filename="${filePath.fileName}"`);
    res.sendFile(filePath.path)
})

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})