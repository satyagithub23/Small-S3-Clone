const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    fileName: String,
    path: String,
    uniqueIdentifier: { type: String, unique: true, default: Date.now },
    uploadDate: { type: Date, default: Date.now },
})

const File = mongoose.model('File', fileSchema)

module.exports = File