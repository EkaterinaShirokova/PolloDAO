const Web3 = require('web3');

const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545'); //testnet
// const web3 = new Web3('https://bsc-dataseed.binance.org/');
const poolPoFiBUSDJSON = require("./abi/pofi_busd.json");
const poolPoFiBNBJSON = require("./abi/pofi_bnb.json");
const poolPoFiJSON = require("./abi/pofi_pool.json");
const poFiJSON = require("./abi/pofi.json");
const poFiVaultJSON = require("./abi/pofi_vault.json");
const proposalFactoryJSON = require("../client/src/contracts/ProposalFactory.json");
const proposeJSON = require("../client/src/contracts/Propose.json");

async function main() {

    // var userAddress = "0x968F89DEC9d12b6989E06E4007dD0Ff3Cc6D3595"
    // const poolPoFiBUSDAddress = '0xee39EAc90FFb27a9878512200c50481f69D16B76'
    // var poolPoFiBUSDContract = new web3.eth.Contract(poolPoFiBUSDJSON, poolPoFiBUSDAddress);
    // var poolPoFiBUSDBalanceOfUser = await poolPoFiBUSDContract.methods.balanceOf(userAddress).call();
    // var poolPoFiBUSDReserves = await poolPoFiBUSDContract.methods.getReserves().call();
    // var poolPoFiBUSDSupply = await poolPoFiBUSDContract.methods.totalSupply().call();
    // var poolPoFiBUSDPercentOfUser = poolPoFiBUSDBalanceOfUser / poolPoFiBUSDSupply
    // var poFiPoolPoFiBUSDReserves = web3.utils.fromWei(poolPoFiBUSDReserves[0], 'ether');
    // var userPoFiShareFromPoFiBUSDPool = poolPoFiBUSDPercentOfUser * poFiPoolPoFiBUSDReserves
    // console.log("PoFi Share from PoFiBUSD Pool: ", userPoFiShareFromPoFiBUSDPool)

    // const poolPoFiBNBAddress = '0xc84433A2580Aa85Cb88094a63E099A8FE8B2F526'
    // var poolPoFiBNBContract = new web3.eth.Contract(poolPoFiBNBJSON, poolPoFiBNBAddress);
    // var poolPoFiBNBBalanceOfUser = await poolPoFiBNBContract.methods.balanceOf(userAddress).call();
    // var poolPoFiBNBReserves = await poolPoFiBNBContract.methods.getReserves().call();
    // var poolPoFiBNBSupply = await poolPoFiBNBContract.methods.totalSupply().call();
    // var poolPoFiBNBPercentOfUser = poolPoFiBNBBalanceOfUser / poolPoFiBNBSupply
    // var poFiPoolPoFiBNBReserves = web3.utils.fromWei(poolPoFiBNBReserves[0], 'ether');
    // var userPoFiShareFromPoFiBNBPool = poolPoFiBNBPercentOfUser * poFiPoolPoFiBNBReserves
    // console.log("PoFi Share from PoFiBNB Pool: ", userPoFiShareFromPoFiBNBPool)

    // const poFiAddress = '0x461f6C9aE13a7daC7055C73fBF8daB529D667041'
    // var poFiContract = new web3.eth.Contract(poFiJSON, poFiAddress);
    // var res = await poFiContract.methods.balanceOf(userAddress).call();
    // var poFiBalanceOfUser = web3.utils.fromWei(res, 'ether');
    // console.log("PoFi Balance of the User Address: ", poFiBalanceOfUser)

    // const poolPoFiAddress = '0xdCBb9f33CA60d7994162a98C0E3B6a8b1Ef5Bb50'
    // var poolPoFiContract = new web3.eth.Contract(poolPoFiJSON, poolPoFiAddress);
    // var res = await poolPoFiContract.methods.userInfo(4, userAddress).call();
    // var poolPoFiBalanceOfUser = web3.utils.fromWei(res[0], 'ether');
    // console.log("PoFi Pool Balance of the User Address: ", poolPoFiBalanceOfUser)

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

    // var totalUserBalance = parseInt(userPoFiShareFromPoFiBUSDPool) + parseInt(userPoFiShareFromPoFiBNBPool) + parseInt(poFiBalanceOfUser) + parseInt(poolPoFiBalanceOfUser) + parseInt(userPoFiShareFromPoFiBNBVault) + parseInt(userPoFiShareFromPoFiBUSDVault) + parseInt(poFiVaultBalanceOfUser);

    // console.log("Total Balance is: ", totalUserBalance)
    var proposalAddress = '0x3E8961951DD552Ed0Ca64Dcf0Ad48Aee181c4010'
    var proposalContract = new web3.eth.Contract(proposeJSON.abi, proposalAddress);
    var response = await proposalContract.methods.isFinished().call();
    console.log(response);
    const privKey = 'c8d91345b97701a665d0019658cbcaf1ab0cbd7ae623099c81db17b53453710a'
    // var proposalFactoryAddress = '0xAA9E94686fba2D0c6035bfaF033eC3E038B31856'
    // var proposalFactoryContract = new web3.eth.Contract(proposalFactoryJSON.abi, proposalFactoryAddress);
    try {
        // encoded = proposalFactoryContract.methods.createProposal("Test", ["First", "second", "third"], '0x16EDE61a09835D35e60D92AE0F11CF148cE262bF').encodeABI();
        encoded = proposalContract.methods.castVote("0x06b1EE054Ec18E1823caD4B255327ef3Ea0994a9", 0).encodeABI();
        var tx = {
            gasLimit: web3.utils.toHex(7200000),
            to: proposalAddress,
            data: encoded
        }

        signed = await web3.eth.accounts.signTransaction(tx, privKey);
        web3.eth
            .sendSignedTransaction(signed.rawTransaction).once("receipt", function (receipt) {
                // res.send(receipt.logs[0].address);
                console.log("Hi: ", receipt.logs[0].address)
            })

    } catch (error) {
        console.error(error);
        throw error;
    };
}

main()
