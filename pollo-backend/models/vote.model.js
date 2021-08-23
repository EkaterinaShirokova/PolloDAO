const mongoose = require('mongoose');

const voteModel = mongoose.Schema({
   "createdBy":{
      "type":"String",
      "required": true
   },
   "title":{
      "type":"String"
   },
   "description":{
      "type":"String"
   },
   "status":{
      "type":"String",
   },
   "options":[{
     "votersId": ['String'],
     "label": "String"
   }],
   "dateCreated":{
      "type":"Date"
   },
   "dateApproved":{
      "type":"Date",
      "default":Date.now
   },
   "dateEnd":{
      "type":"Date"
   },
   "winningOption":{
      "type":"String"
   },
   "filePath": {
      "type":"String"
   },
   "forum": {
      "type":"String"
   },
   "contract": {
      "type":"String"
   }
}, {
  timestamps: false
});

module.exports = mongoose.model('Vote', voteModel);
