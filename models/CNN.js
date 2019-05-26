var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CNNSchema = new Schema({
    region: {
        type: String,
        trim: true,
        required: "Region is required!"
    },
    regionLink: {
        type: String,
        trim: true,
    },
    img: {
        type: String,
        trim: true,
        required: "Image is required!"
    },
    header: {
        type: String,
        required: "Header is required!"

    },
    link: {
        type: String,
        trim: true
    },
    comments: {
        type: Array,
        trim: true
    } 
}, {collection: 'CNN'});

var CNN = mongoose.model('CNN', CNNSchema);

module.exports = CNN;