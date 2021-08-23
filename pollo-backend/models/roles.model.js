const mongoose = require('mongoose');

const rolesModel = mongoose.Schema({
    "role":{
       "type":"String"
    },
    "userId":{
       "type":"String"
    },
    "userHandle":{
       "type":"String"
    },
    "address":{
       "type":"String"
    }
}, {
  timestamps: false
});

module.exports = mongoose.model('Roles', rolesModel);
