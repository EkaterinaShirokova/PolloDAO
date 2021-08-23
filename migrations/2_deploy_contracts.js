const ProposalFactory = artifacts.require("./ProposalFactory.sol");
module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(ProposalFactory);
};