var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RequestSchema = new Schema({
  action: {
    type: String,
    required: 'Kindly enter the action'
  },
  pending: {
    type: String,
  },
  speech: {
    type: String,
  }
});

module.exports = mongoose.model('Requests', RequestSchema);