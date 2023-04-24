// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenGatedDao {
    struct Proposal {
        address creator;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
    }

    IERC20 public token;
    Proposal[] public proposals;
    uint256 public proposalCount;
    uint256 public votingPeriod;
    mapping(address => bool) hasVoted;

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
        votingPeriod = block.timestamp;
    }

    function createProposal(string calldata _description) external {
        require(token.balanceOf(msg.sender) > 0, "You must hold tokens to create a proposal");
        proposals.push(Proposal(msg.sender, _description, 0, 0));
        proposalCount++;
    }

    function vote(uint256 _proposalIndex, bool _supportsProposal) external {
        require(_proposalIndex < proposalCount, "Invalid proposal index");
        require(!hasVoted[msg.sender], "You have already voted for this proposal");
        require(token.balanceOf(msg.sender) > 0, "You must hold tokens to vote");

        hasVoted[msg.sender] = true;

        if (_supportsProposal) {
            proposals[_proposalIndex].yesVotes += token.balanceOf(msg.sender);
        } else {
            proposals[_proposalIndex].noVotes += token.balanceOf(msg.sender);
        }
    }

    function getProposal(uint256 _proposalIndex) external view returns (
        address creator,
        string memory description,
        uint256 yesVotes,
        uint256 noVotes
    ) {
        require(_proposalIndex < proposalCount, "Invalid proposal index");
        Proposal memory proposal = proposals[_proposalIndex];
        return (
            proposal.creator,
            proposal.description,
            proposal.yesVotes,
            proposal.noVotes
        );
    }

    function endVoting(uint256 _proposalIndex) external  view{
        require(_proposalIndex < proposalCount, "Invalid proposal index");
        require(proposals[_proposalIndex].creator == msg.sender, "Only the creator of the proposal can end the voting");

        Proposal memory proposal = proposals[_proposalIndex];
        require(block.timestamp >= votingPeriod, "Voting period has not ended yet");

        if (proposal.yesVotes > proposal.noVotes) {
            // Execute the proposal if it has more yes votes
            // (e.g., transfer funds, call external contract, etc.)
            // ...
        } else {
            // Reject the proposal if it has more no votes
            // ...
        }
    }

    function getAllProposals() public view returns(Proposal [] memory){
        return proposals;
    }

}