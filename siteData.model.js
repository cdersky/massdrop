'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var siteDataSchema = new Schema({
  url: String,
  data: String,
  downloadComplete: Boolean
});

module.exports = mongoose.model('SiteData', siteDataSchema);