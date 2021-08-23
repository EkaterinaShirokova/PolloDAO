// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import './Propose.sol';

contract ProposalFactory is Ownable {
    uint256 proposalID; // this increments everytime a proposal has been created

    mapping(uint256 => address) proposer; // showing the address of the owner of a proposal id
    mapping(uint256 => Proposal) proposalDetails; // maps the proposal details to a proposal id
    mapping(uint256 => mapping(uint256 => string)) proposalOptions; // maps the options id and options title to a proposal id

    struct Proposal {
        uint256 id; // proposal ID
        string name; // name of the proposal
        address proposer; // address of the proposer
        uint256 optionsCount; // number of options for this proposal
    }

    event ProposalCreated(uint256 _proposalID, string _name, address _proposer);

    /**
        @dev Creates the proposal
        @param _name The name or title of the proposal
        @param _options The array of options of the proposal
        @param _proposer The address who proposed
    */
    function createProposal(
        string memory _name,
        string[] memory _options,
        address payable _proposer
    ) public {
        Proposal memory proposal = Proposal(proposalID, _name, _proposer, _options.length);
        proposalDetails[proposalID] = proposal;
        for (uint256 i = 0; i < _options.length; i++) {
            proposalOptions[proposalID][i] = _options[i];
        }
        new Propose(_name, _options, proposalID, _proposer, msg.sender);
        emit ProposalCreated(proposalID, _name, _proposer);
        proposalID = proposalID + 1;
    }

    /**
        @dev Get the proposal details of a proposal ID
        @param id The proposal ID that needs to be checked
        @return The name of the proposal, the address of the proposer and the number of options of this proposal ID
    */
    function getProposalDetails(uint256 id)
        public
        view
        returns (
            string memory,
            address,
            uint256
        )
    {
        return (proposalDetails[id].name, proposalDetails[id].proposer, proposalDetails[id].optionsCount);
    }

    /**
        @dev Get the next proposal ID in case there is a need to know what will be the id to be assigned next
        @return The ID that will be assigned next.
    */
    function getNextProposalID() public view returns (uint256) {
        return (proposalID);
    }

    /**
        @dev Get the name of an option
        @param _proposalID The proposal ID that needs to be checked
        @param _optionID The option ID that needs to be checked
        @return The name of an option
    */
    function getOptionName(uint256 _proposalID, uint256 _optionID) public view returns (string memory) {
        return (proposalOptions[_proposalID][_optionID]);
    }

    /**
        @dev Get the number of options of the proposal
        @param _proposalID The proposal ID that needs to be checked
        @return The number of options of a proposal
    */
    function getOptionsCount(uint256 _proposalID) public view returns (uint256) {
        return (proposalDetails[_proposalID].optionsCount);
    }
}
