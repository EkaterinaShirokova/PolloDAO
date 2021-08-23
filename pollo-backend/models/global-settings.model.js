const mongoose = require('mongoose');

const globalSettingsModel = mongoose.Schema({
    "loginRequirement":{
       "type":"Number"
    },
    "proposalRequirement":{
        "type":"Number"
    },
    "editedBy":[{
      "userId": "String"
    }]
}, {
  timestamps: false
});

module.exports = mongoose.model('globalsettings', globalSettingsModel);
