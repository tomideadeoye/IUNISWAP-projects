// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;
import { Isuretoken } from "./interfaces/Isuretoken.sol";

contract Vcontract {
    ///owner of the contract
    address public controller;
    ///@dev token used as ticket to vote
    Isuretoken ticket;
    ///@dev name of the voting contract
    string public name;

    //@dev number of people that have voted in the ballot
    uint256 public totalVotes;

    //@dev the starting period of the vote
    uint256 public Open;

    //@dev timestamp the vote ends
    uint public close;

    //@dev the winner of the competition
    uint256 public _winner;
    
    ///@dev token per vote
    uint256 public tokenPerVote;

    uint256 private numOfVotes;

    address[] public voterAddress;

    address private ticketToken;

    struct contenderData {
        string name;
        uint8 votePoints;
    }

    mapping(string => contenderData) public contender;
    string[]  contenders;
    mapping(address => bool) private hasVoted;

    constructor (string memory _contractName, string[] memory _contenders, uint256 _period, uint256 _tokenPerVote, address voterCord) {
        name = _contractName;
        Open = block.timestamp;
        close = Open + _period;


        tokenPerVote = _tokenPerVote;
        ticketToken = voterCord;
        controller = msg.sender;

        require(_contenders.length == 3, "There can only be three contenders");

        for (uint i = 0; i < 3; i++) {
           // contender.name = _contenders[i];
            contenders.push(_contenders[i]);
        }

    }
        
    
    function vote (string[] calldata _candidateRank ) external {
        require(block.timestamp < close, "Vote has ended");
        require(Isuretoken(ticketToken).balanceOf(msg.sender) > tokenPerVote, "Not enough ticket token to vote");

        require(hasVoted[msg.sender] == false, "Cannot vote twice");
        require(_candidateRank.length == 3, "You can only rank three contenders");

        contender[_candidateRank[0]].votePoints += 3;
        contender[_candidateRank[1]].votePoints += 2;
        contender[_candidateRank[2]].votePoints += 1;

        hasVoted[msg.sender] == true;
        numOfVotes += 1;

        voterAddress.push(msg.sender);

        uint256 controllerIncentive = (tokenPerVote * 10) / 100;
        uint256 burnAmount = tokenPerVote - controllerIncentive;

        Isuretoken(ticketToken).transferFrom(msg.sender, controller, controllerIncentive);
        Isuretoken(ticketToken).burnTokenFor(msg.sender, burnAmount);

    }



    function winner () external view returns (string memory){
            string memory win = contender[contenders[0]].votePoints >
                contender[contenders[1]].votePoints
                ? // if true
                (
                    contender[contenders[0]].votePoints >
                        contender[contenders[2]].votePoints
                        ? contender[contenders[0]].name
                        : contender[contenders[2]].name
                )
                : // if false
                (
                    contender[contenders[1]].votePoints >
                        contender[contenders[2]].votePoints
                        ? contender[contenders[1]].name
                        : contender[contenders[2]].name
                );

            return win;
    }

    function returnVoters() external view returns(address[] memory){
        return voterAddress;
    }

    function name_() external view returns(string memory) {
        return name;
    }


       
}

