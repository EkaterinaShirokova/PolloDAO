const Web3 = require('web3');
import { createProposal } from 'redux/Proposal/proposalCrud';
import { createProposal } from 'redux/Proposal/proposalCrud';
// const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');  testnet
const web3 = new Web3('https://bsc-dataseed.binance.org/');
const poolPoFiBUSDJSON = require("./abi/pofi_busd.json");
const poolPoFiBNBJSON = require("./abi/pofi_bnb.json");
const poolPoFiJSON = require("./abi/pofi_pool.json");
const poFiJSON = require("./abi/pofi.json");
const proposalFactoryJSON = require("../client/src/contracts/ProposalFactory.json");
const proposeJSON = require("../client/src/contracts/Propose.json");

const checkBalance = async (req, res) => {

    var userAddress = req.userAddress
    privKey = process.env.PRIVATE_KEY
    const poolPoFiBUSDAddress = '0xee39EAc90FFb27a9878512200c50481f69D16B76'
    var poolPoFiBUSDContract = new web3.eth.Contract(poolPoFiBUSDJSON, poolPoFiBUSDAddress);
    var poolPoFiBUSDBalanceOfUser = await poolPoFiBUSDContract.methods.balanceOf(userAddress).call();
    var poolPoFiBUSDReserves = await poolPoFiBUSDContract.methods.getReserves().call();
    var poolPoFiBUSDSupply = await poolPoFiBUSDContract.methods.totalSupply().call();
    var poolPoFiBUSDPercentOfUser = poolPoFiBUSDBalanceOfUser / poolPoFiBUSDSupply
    var poFiPoolPoFiBUSDReserves = web3.utils.fromWei(poolPoFiBUSDReserves[0], 'ether');
    var userPoFiShareFromPoFiBUSDPool = poolPoFiBUSDPercentOfUser * poFiPoolPoFiBUSDReserves
    console.log("PoFi Share from PoFiBUSD Pool: ", userPoFiShareFromPoFiBUSDPool)

    const poolPoFiBNBAddress = '0xc84433A2580Aa85Cb88094a63E099A8FE8B2F526'
    var poolPoFiBNBContract = new web3.eth.Contract(poolPoFiBNBJSON, poolPoFiBNBAddress);
    var poolPoFiBNBBalanceOfUser = await poolPoFiBNBContract.methods.balanceOf(userAddress).call();
    var poolPoFiBNBReserves = await poolPoFiBNBContract.methods.getReserves().call();
    var poolPoFiBNBSupply = await poolPoFiBNBContract.methods.totalSupply().call();
    var poolPoFiBNBPercentOfUser = poolPoFiBNBBalanceOfUser / poolPoFiBNBSupply
    var poFiPoolPoFiBNBReserves = web3.utils.fromWei(poolPoFiBNBReserves[0], 'ether');
    var userPoFiShareFromPoFiBNBPool = poolPoFiBNBPercentOfUser * poFiPoolPoFiBNBReserves
    console.log("PoFi Share from PoFiBNB Pool: ", userPoFiShareFromPoFiBNBPool)

    const poFiAddress = '0x461f6C9aE13a7daC7055C73fBF8daB529D667041'
    var poFiContract = new web3.eth.Contract(poFiJSON, poFiAddress);
    var poFiBalanceOfUser = await poFiContract.methods.balanceOf(userAddress).call();
    console.log("PoFi Balance of the User Address: ", poFiBalanceOfUser)

    const poolPoFiAddress = '0xdCBb9f33CA60d7994162a98C0E3B6a8b1Ef5Bb50'
    var poolPoFiContract = new web3.eth.Contract(poolPoFiJSON, poolPoFiAddress);
    var res = await poolPoFiContract.methods.userInfo(4, userAddress).call();
    poolPoFiBalanceOfUser = web3.utils.fromWei(res[0], 'ether');
    console.log("PoFi Pool Balance of the User Address: ", poolPoFiBalanceOfUser)

    var totalUserBalance = userPoFiShareFromPoFiBUSDPool + userPoFiShareFromPoFiBNBPool + poFiBalanceOfUser + poolPoFiBalanceOfUser;

    console.log("Total Balance is: ", totalUserBalance)
    res.send(totalUserBalance);
}

const createProposal = async (req, res) => {

    var proposalFactoryAddress = process.env.FACTORY_CONTRACT
    var proposalFactoryContract = new web3.eth.Contract(proposalFactoryJSON.abi, proposalFactoryAddress);
    try {
        encoded = proposalFactoryContract.methods.createProposal(req.title, req.options, req.owner).encodeABI();
        var tx = {
            gasLimit: web3.utils.toHex(6200000),
            to: proposalFactoryAddress,
            data: encoded
        }

        signed = await web3.eth.accounts.signTransaction(tx, privKey);
        web3.eth
            .sendSignedTransaction(signed.rawTransaction).once("receipt", function (receipt) {
                res.send(receipt.logs[0].address);
            })

    } catch (error) {
        console.error(error);
        throw error;
    };
}

const castVote = async (req, res) => {

    var proposalAddress = req.address;
    var proposalContract = new web3.eth.Contract(proposeJSON.abi, proposalAddress);
    try {
        encoded = proposalContract.methods.castVote(req.vote).encodeABI()
        var tx = {
            gasLimit: web3.utils.toHex(6200000),
            to: proposalAddress,
            data: encoded
        }

        signed = await web3.eth.accounts.signTransaction(tx, privKey);
        web3.eth
            .sendSignedTransaction(signed.rawTransaction).once("receipt", function (receipt) {
                res.send(receipt.logs[0]);
            })

    } catch (error) {
        console.error(error);
        throw error;
    };
}

module.exports = {
    checkBalance, createProposal, castVote
};
