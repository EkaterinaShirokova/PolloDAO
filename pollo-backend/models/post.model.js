const mongoose = require('mongoose');

const postModel = mongoose.Schema({
   "address":{
      "type":"String",
      "required": true
   },
   "userHandle":{
      "type":"String",
   },
   "title":{
      "type":"String",
      "required": true
   },
   "body":{
      "type":"String",
   },
   "created":{
      "type":"Date"
   },
   "filepath": {
     "type":"String"
   },
   "liked":[{
     "userId": "String"
   }],
   "modified":{
      "type":"Date",
      "default":Date.now
   }
}, {
  timestamps: false
});

module.exports = mongoose.model('Post', postModel);
