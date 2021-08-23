"use strict"

var AppError = require('../models/appError.model');
const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');
const Web3 = require('web3');
const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/'); //testnet
//  const web3 = new Web3('https://bsc-dataseed.binance.org/');
const poolPoFiBUSDJSON = require("../abi/pofi_busd.json");
const poolPoFiBNBJSON = require("../abi/pofi_bnb.json");
const poolPoFiJSON = require("../abi/pofi_pool.json");
const poFiJSON = require("../abi/pofi.json");
const poFiTestJSON = require("../abi/pofi_testnet.json");
const poFiVaultJSON = require("../abi/pofi_vault.json");
const proposeJSON = require("../../client/src/contracts/Propose.json");
const proposalFactoryJSON = require("../../client/src/contracts/ProposalFactory.json");
const AccountService = require('./account.service');

module.exports = class PoolPoFiService {

    constructor() {
        this.accountService = new AccountService();
    }

    async getUserBalance(_userAddress) {
        let userAddress = _userAddress;
        let userDetails = await this.accountService.getUserInfo(userAddress);

        // const poolPoFiBUSDAddress = '0xee39EAc90FFb27a9878512200c50481f69D16B76'
        // let poolPoFiBUSDContract = new web3.eth.Contract(poolPoFiBUSDJSON, poolPoFiBUSDAddress);
        // let poolPoFiBUSDBalanceOfUser = userDetails.success ? await poolPoFiBUSDContract.methods.balanceOf(userAddress).call() : '';
        // let poolPoFiBUSDReserves = await poolPoFiBUSDContract.methods.getReserves().call();
        // let poolPoFiBUSDSupply = await poolPoFiBUSDContract.methods.totalSupply().call();
        // let poolPoFiBUSDPercentOfUser = poolPoFiBUSDBalanceOfUser / poolPoFiBUSDSupply
        // let poFiPoolPoFiBUSDReserves = web3.utils.fromWei(poolPoFiBUSDReserves[0], 'ether');
        // let userPoFiShareFromPoFiBUSDPool = poolPoFiBUSDPercentOfUser * poFiPoolPoFiBUSDReserves

        // const poolPoFiBNBAddress = '0xc84433A2580Aa85Cb88094a63E099A8FE8B2F526'
        // let poolPoFiBNBContract = new web3.eth.Contract(poolPoFiBNBJSON, poolPoFiBNBAddress);
        // let poolPoFiBNBBalanceOfUser = userDetails.success ? await poolPoFiBNBContract.methods.balanceOf(userAddress).call() : '';
        // let poolPoFiBNBReserves = await poolPoFiBNBContract.methods.getReserves().call();
        // let poolPoFiBNBSupply = await poolPoFiBNBContract.methods.totalSupply().call();
        // let poolPoFiBNBPercentOfUser = poolPoFiBNBBalanceOfUser / poolPoFiBNBSupply;
        // let poFiPoolPoFiBNBReserves = web3.utils.fromWei(poolPoFiBNBReserves[0], 'ether');
        // let userPoFiShareFromPoFiBNBPool = poolPoFiBNBPercentOfUser * poFiPoolPoFiBNBReserves

        // const poFiAddress = '0x461f6C9aE13a7daC7055C73fBF8daB529D667041'
        // let poFiContract = new web3.eth.Contract(poFiJSON, poFiAddress);
        // let result = userDetails.success ? await poFiContract.methods.balanceOf(userAddress).call() : '';
        // var poFiBalanceOfUser = web3.utils.fromWei(result, 'ether');
        // // var poFiBalanceOfUser = result[0];

        // const poolPoFiAddress = '0xdCBb9f33CA60d7994162a98C0E3B6a8b1Ef5Bb50'
        // var poolPoFiContract = new web3.eth.Contract(poolPoFiJSON, poolPoFiAddress);
        // result = userDetails.success ? await poolPoFiContract.methods.userInfo(4, userAddress).call() : '';
        // let poolPoFiBalanceOfUser = web3.utils.fromWei(result[0], 'ether');

        // const poFiVaultAddress = '0x0F4e179549864e2A4272D62FD88F0699355773C5'
        // var poFiVaultContract = new web3.eth.Contract(poFiVaultJSON, poFiVaultAddress);
        // var res = await poFiVaultContract.methods.stakedWantTokens(12, userAddress).call();
        // poolPoFiBNBPercentOfUser = res / poolPoFiBNBSupply
        // var userPoFiShareFromPoFiBNBVault = poolPoFiBNBPercentOfUser * poFiPoolPoFiBNBReserves
        // console.log("PoFi Share from PoFiBNB Vault: ", userPoFiShareFromPoFiBNBVault)

        // res = await poFiVaultContract.methods.stakedWantTokens(7, userAddress).call();
        // poolPoFiBUSDPercentOfUser = res / poolPoFiBUSDSupply
        // var userPoFiShareFromPoFiBUSDVault = poolPoFiBUSDPercentOfUser * poFiPoolPoFiBUSDReserves
        // console.log("PoFi Share from PoFiBUSD Vault: ", userPoFiShareFromPoFiBUSDVault)

        // res = await poFiVaultContract.methods.stakedWantTokens(14, userAddress).call();
        // var poFiVaultBalanceOfUser = web3.utils.fromWei(res, 'ether');
        // console.log("PoFi Share from PoFi Vault: ", poFiVaultBalanceOfUser)

        // let totalUserBalance = parseInt(userPoFiShareFromPoFiBUSDPool) + parseInt(userPoFiShareFromPoFiBNBPool) + parseInt(poFiBalanceOfUser) + parseInt(poolPoFiBalanceOfUser) + parseInt(userPoFiShareFromPoFiBNBVault) + parseInt(userPoFiShareFromPoFiBUSDVault) + parseInt(poFiVaultBalanceOfUser);

        // console.log("PoFi Share from PoFiBUSD Pool: ", userPoFiShareFromPoFiBUSDPool)
        // console.log("PoFi Share from PoFiBNB Pool: ", userPoFiShareFromPoFiBNBPool)
        // console.log("PoFi Pool Balance of the User Address: ", poolPoFiBalanceOfUser)
        // console.log("PoFi Balance of the User Address: ", poFiBalanceOfUser)
        // console.log("PoFi Share from PoFiBNB Vault: ", userPoFiShareFromPoFiBNBVault)
        // console.log("PoFi Share from PoFiBUSD Vault: ", userPoFiShareFromPoFiBUSDVault)
        // console.log("PoFi Share from PoFi Vault: ", poFiVaultBalanceOfUser)
        // console.log("Total Balance is: ", totalUserBalance)
        var userPoFiShareFromPoFiBUSDPool = 0
        var userPoFiShareFromPoFiBNBPool = 0
        var poolPoFiBalanceOfUser = 0
        var poFiBalanceOfUser = 0
        var userPoFiShareFromPoFiBNBVault = 0
        var userPoFiShareFromPoFiBUSDVault = 0
        var poFiVaultBalanceOfUser = 0

        const poFiAddress = '0x80288656852BD71bdCAc3D93176650bA1DeaE509'
        let poFiContract = new web3.eth.Contract(poFiTestJSON, poFiAddress);
        let result = userDetails.success ? await poFiContract.methods.balanceOf(userAddress).call() : '';
        var totalUserBalance = result / 10000;
        // var poFiBalanceOfUser = result[0];

        if (userDetails.success)
            return {
                success: true,
                result: {
                    userPoFiShareFromPoFiBUSDPool: userPoFiShareFromPoFiBUSDPool,
                    userPoFiShareFromPoFiBNBPool: userPoFiShareFromPoFiBNBPool,
                    poolPoFiBalanceOfUser: poolPoFiBalanceOfUser,
                    poFiBalanceOfUser: poFiBalanceOfUser,
                    userPoFiShareFromPoFiBNBVault: userPoFiShareFromPoFiBNBVault,
                    userPoFiShareFromPoFiBUSDVault: userPoFiShareFromPoFiBUSDVault,
                    poFiVaultBalanceOfUser: poFiVaultBalanceOfUser,
                    totalUserBalance: totalUserBalance
                }
            }
        else {
            return {
                success: false
            }
        }
    }

    async castVote(req, res) {
        var privKey = process.env.PRIVATE_KEY;
        let proposalAddress = req.body.address;
        let proposalContract = new web3.eth.Contract(proposeJSON.abi, proposalAddress);
        try {
            var encoded = proposalContract.methods.castVote(req.body.userAddress, req.body.vote).encodeABI()
            var tx = {
                gasLimit: web3.utils.toHex(6200000),
                to: proposalAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            web3.eth
                .sendSignedTransaction(signed.rawTransaction).once("receipt", function (receipt) {
                    res.send(receipt.logs[0]);
                })

        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    async finishProposal(req, res) {
        var privKey = process.env.PRIVATE_KEY;
        let proposalAddress = req.body.address;
        let proposalContract = new web3.eth.Contract(proposeJSON.abi, proposalAddress);
        try {
            var encoded = proposalContract.methods.finishProposal().encodeABI()
            var tx = {
                gasLimit: web3.utils.toHex(6200000),
                to: proposalAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            web3.eth
                .sendSignedTransaction(signed.rawTransaction).once("receipt", function (receipt) {
                    res.send(receipt.logs[0]);
                })

        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    async resumeProposal(req, res) {
        var privKey = process.env.PRIVATE_KEY;
        let proposalAddress = req.body.address;
        let proposalContract = new web3.eth.Contract(proposeJSON.abi, proposalAddress);
        try {
            encoded = proposalContract.methods.finishProposal().encodeABI()
            var tx = {
                gasLimit: web3.utils.toHex(6200000),
                to: proposalAddress,
                data: encoded
            }

            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            web3.eth
                .sendSignedTransaction(signed.rawTransaction).once("receipt", function (receipt) {
                    res.send(receipt.logs[0]);
                })

        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    async createProposal(req, res) {
        var privKey = process.env.PRIVATE_KEY;
        var proposalFactoryAddress = process.env.FACTORY_CONTRACT;
        var admin = process.env.ADMIN_ADDRESS;
        var proposalFactoryContract = new web3.eth.Contract(proposalFactoryJSON.abi, proposalFactoryAddress);
        try {
            let options = req.body.options.map(item => item.label);
            let encoded = proposalFactoryContract.methods.createProposal(req.body.title, options, req.body.owner).encodeABI();
            var tx = {
                gasLimit: web3.utils.toHex(6200000),
                to: proposalFactoryAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            web3.eth
                .sendSignedTransaction(signed.rawTransaction).once("receipt", function (receipt) {
                    res.send(receipt.logs[0].address);
                })

        } catch (error) {
            console.error(error);
            throw error;
        };
    }
}
