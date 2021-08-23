"use strict"

require("./config/config")

var userModel = require('./models/user.model');

setTimeout(function(){
  setInterval(async function(){
    let result = await userModel.find({
        banLevel: 2
    });
    result.forEach(async function(user){
      if((new Date()).getTime() - user.bannedTime.getTime() > (7*86400000)){
        await userModel.findOneAndUpdate({ address: user.address }, { banLevel: 0}, {useFindAndModify: false});
      }
    });
  }, 60000*10);
},10000);
