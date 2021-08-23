// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}


contract Propose is Ownable {
    
    string public name; // name or title of the proposal
    uint256 public id; // proposal ID given by the proposal factory
    address public proposer;  // address of the one who proposed
    uint256 public optionsCount; // number of options
    bool public isFinished;   // is the proposal finished or not
    address public admin; // the address of the team admin

    mapping(uint256 => string) proposalOptions; // showing the options name of an option ID
    mapping(uint256 => uint256) optionVoteCount; // showing the number of votes of an option ID
    mapping(address => uint256) userVote;  // showing the option ID number that an address voted
    mapping(address => bool) voted;  //showing whether the user voted or not

    /**
        @dev Constructor to initiate the created proposal
        @param _name The name or title of the proposal
        @param _options The array of options of the proposal
        @param _id The proposal ID assigned by the proposal factory
        @param _proposer The address who proposed
    */
    constructor(string memory _name, string[] memory _options, uint256 _id, address _proposer, address _admin) {       
        name = _name;
        id = _id;
        proposer = _proposer;
        for (uint256 i = 0; i < _options.length; i++) {
            proposalOptions[i] = _options[i];
        }
        optionsCount = _options.length;
        admin = _admin;
    }

    event UserVoted(address _voter, string vote);

    /**
        @dev Casting a vote
        @param _vote The option number that the caller voted for
    */
    function castVote(address _voter, uint256 _vote) public {
        address user = _voter;
        require(!isVoted(user), 'User has already voted');
        require(!isFinished, 'Voting period is already finished');
        require(_vote < optionsCount, 'The vote is not part of the options');
        userVote[user] = _vote;
        voted[user] = true;
        optionVoteCount[_vote] = optionVoteCount[_vote] + 1;
        emit UserVoted(user, proposalOptions[_vote]);   
    }

    /**
        @dev To check if the user has already voted
        @param _voter The address that needs to be checked
        @return If the address voted or not
    */
    function isVoted(address _voter) public view returns (bool){
        return voted[_voter];
    }

    /**
        @dev To get the vote of an address
        @param _voter The address that needs to be checked
        @return The option number that the address voted
    */
    function getVote(address _voter) public view returns (uint256){
        return userVote[_voter];
    }

    /**
        @dev To get the number of votes of an option
        @param optionID The option that will be checked
        @return The number of votes for that option
    */
    function getOptionVoteCount(uint256 optionID) public view returns (uint256){
        return optionVoteCount[optionID];
    }

    /**
        @dev To get the title of an option id
        @param optionID The option that will be checked
        @return The title of the option ID
    */
    function getOptionTitle(uint256 optionID) public view returns (string memory){
        return proposalOptions[optionID];
    }

    /**
        @dev To finish the proposal so it can no longer accept votes, can only be done by the owner of the proposal which is the proposer
    */
    function finishProposal() public{
        require((msg.sender == proposer || msg.sender == admin), 'You are not allowed to finish the proposal');

        isFinished = true;
    }

    /**
        @dev To resume the proposal so it can accept votes again, can only be done by the owner of the proposal which is the proposer
    */
    function resumeProposal() public {
        require((msg.sender == proposer || msg.sender == admin), 'You are not allowed to resume the proposal');

        isFinished = false;
    }
}