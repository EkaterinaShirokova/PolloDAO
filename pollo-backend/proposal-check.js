"use strict"

require("./config/config")
const Web3 = require('web3');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/'); //testnet
//  const web3 = new Web3('https://bsc-dataseed.binance.org/');

var voteModel = require('./models/vote.model');
const proposeJSON = require("../client/src/contracts/Propose.json");

const finishProposal = async function(contractAddress) {
  var privKey = process.env.PRIVATE_KEY;
  let proposalAddress = contractAddress;
  let proposalContract = new web3.eth.Contract(proposeJSON.abi, proposalAddress);
  try {
      var encoded = proposalContract.methods.finishProposal().encodeABI()
      var tx = {
          gasLimit: web3.utils.toHex(6200000),
          to: proposalAddress,
          data: encoded
      }
      let signed = await web3.eth.accounts.signTransaction(tx, privKey);
      let result = await web3.eth.sendSignedTransaction(signed.rawTransaction);
      return result;
  } catch (error) {
      console.error(error);
      throw error;
  };
}

setTimeout(function(){
  setInterval(async function(){
    let result = await voteModel.find({
        status: { $regex: /ACTIVE/, $options: 'i' } 
    });
    result.forEach(async function(vote){
      if((new Date()).getTime() >= vote.dateEnd.getTime()){
        try {
          let result = await finishProposal(vote.contract);
          await voteModel.findOneAndUpdate({ _id: vote._id }, { status: "finished" }, {useFindAndModify: false});
        }
        catch (error) {
            console.error(error);
        }
      }
    });
  }, 60000*10);//
},10000);
