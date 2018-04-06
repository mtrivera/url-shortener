const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  original: {
    type: String
  },
  shortened: {
    type: String
  }
}, {timestamps: true});

const Url = mongoose.model('shorturl', urlSchema);

module.exports = Url;