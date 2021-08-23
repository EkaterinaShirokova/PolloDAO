const mongoose = require('mongoose');

const commentModel = mongoose.Schema({
   "post_id":{
      "type":"String",
      "required": true
   },
   "text":{
      "type":"String",
      "required": true
   },
   "address":{
      "type":"String",
   },
   "commented_by":{
      "type":"String",
   },
   "liked":[{
     "userId": "String"
   }],
   "created":{
      "type":"Date",
      "default":Date.now
   },
   "modified":{
      "type":"Date",
      "default":Date.now
   }
}, {
  timestamps: false
});

module.exports = mongoose.model('Comment', commentModel);
