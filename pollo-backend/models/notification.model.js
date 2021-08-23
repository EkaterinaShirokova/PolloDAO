const mongoose = require('mongoose');

const notificationModel = mongoose.Schema({
    "userId":{
       "type":"String",
       "default" : ""
    },
    "notifications":{
        "type":"Number",
        "default":0
    },
    "isRead":{
      "type":"Boolean",
      "default":false
    },
    "notification_data":[{
      "isRead":false,
      "title": "String",
      "link": "String" ,
      "from": "String"
    }]
}, {
  timestamps: false
});

module.exports = mongoose.model('Notification', notificationModel);
