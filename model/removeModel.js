const mongoose = require("mongoose")

module.exports = mongoose.model('removeModel', mongoose.Schema({
    cate: String,
    cate_zh: String,
    create_time: Number
}))