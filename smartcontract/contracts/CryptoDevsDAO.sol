// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ICryptoDevs.sol";
import "./interfaces/IFakeNFTMarketplace.sol";

error DeadlineExceeded();
error NotDaoMember();
error ProposalAlreadyExecuted();
error DeadlineNotExceeded();
error NftNotForSale();
error AlreadyVoted();
error InsufficientFunds();

contract CryptoDevsDAO is Ownable {
    struct Proposal {
        uint256 nftTokenId;
        uint256 deadline;
        uint256 yayVotes;
        uint256 nayVotes;
        bool executed;
        mapping(uint256 => bool) voters;
    }

    enum Vote {
        YAY,
        NAY
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public numProposals;

    IFakeNFTMarketplace private immutable nftMarketplace;
    ICryptoDevs private immutable cryptoDevsNFT;

    modifier nftHolderOnly() {
        if (cryptoDevsNFT.balanceOf(msg.sender) <= 0) {
            revert NotDaoMember();
        }
        _;
    }

    modifier activeProposalOnly(uint256 proposalIndex) {
        if (proposals[proposalIndex].deadline <= block.timestamp) {
            revert DeadlineExceeded();
        }
        _;
    }

    modifier inactiveProposalOnly(uint256 proposalIndex) {
        if (proposals[proposalIndex].deadline > block.timestamp) {
            revert DeadlineNotExceeded();
        }
        if (proposals[proposalIndex].executed) {
            revert ProposalAlreadyExecuted();
        }
        _;
    }

    constructor(address _nftMarketplace, address _cryptoDevsNFT) payable {
        nftMarketplace = IFakeNFTMarketplace(_nftMarketplace);
        cryptoDevsNFT = ICryptoDevs(_cryptoDevsNFT);
    }

    receive() external payable {}

    fallback() external payable {}

    function createProposal(uint256 _nftTokenId)
        external
        nftHolderOnly
        returns (uint256)
    {
        if (!nftMarketplace.available(_nftTokenId)) {
            revert NftNotForSale();
        }
        Proposal storage proposal = proposals[numProposals];
        proposal.nftTokenId = _nftTokenId;
        proposal.deadline = block.timestamp + 5 minutes;

        numProposals++;

        return numProposals - 1;
    }

    function voteOnProposal(uint256 proposalIndex, Vote vote)
        external
        nftHolderOnly
        activeProposalOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];

        uint256 voterNFTBalance = cryptoDevsNFT.balanceOf(msg.sender);
        uint256 numVotes = 0;

        for (uint256 i = 0; i < voterNFTBalance; i++) {
            uint256 tokenId = cryptoDevsNFT.tokenOfOwnerByIndex(msg.sender, i);
            if (proposal.voters[tokenId] == false) {
                numVotes++;
                proposal.voters[tokenId] = true;
            }
        }

        if (numVotes <= 0) {
            revert AlreadyVoted();
        }

        if (vote == Vote.YAY) {
            proposal.yayVotes += numVotes;
        } else {
            proposal.nayVotes += numVotes;
        }
    }

    function executeProposal(uint256 proposalIndex)
        external
        nftHolderOnly
        inactiveProposalOnly(proposalIndex)
    {
        Proposal storage proposal = proposals[proposalIndex];

        if (proposal.yayVotes > proposal.nayVotes) {
            uint256 nftPrice = nftMarketplace.getPrice();
            if (address(this).balance < nftPrice) {
                revert InsufficientFunds();
            }
            nftMarketplace.purchase{value: nftPrice}(proposal.nftTokenId);
        }
        proposal.executed = true;
    }

    function withdrawEther() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
