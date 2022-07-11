// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IWhitelist.sol";

error ContractPaused();
error PresaleNotRunning();
error NotWhitelisted();
error MaxTokensReached();
error InsufficientFunds();
error PresaleRunning();
error PresaleNotStarted();

contract CryptoDevs is ERC721Enumerable, Ownable {
    IWhitelist whitelist;

    uint256 public constant tokenPrice = 0.01 ether;
    uint256 public constant maxTokens = 20;
    string public _baseTokenURI;
    uint256 public tokenIds;
    uint256 public presaleEnded;
    bool public _paused;
    bool public presaleStarted;

    modifier onlyWhenNotPaused() {
        if (_paused) {
            revert ContractPaused();
        }
        _;
    }

    constructor(string memory baseURI, address whitelistContract)
        ERC721("Crypto Devs", "CD")
    {
        _baseTokenURI = baseURI;
        whitelist = IWhitelist(whitelistContract);
    }

    receive() external payable {}

    fallback() external payable {}

    function startPresale() public onlyOwner {
        presaleStarted = true;
        presaleEnded = block.timestamp + 5 minutes;
    }

    function presaleMint() public payable onlyWhenNotPaused {
        if (!presaleStarted || block.timestamp >= presaleEnded) {
            revert PresaleNotRunning();
        }
        if (!whitelist.whitelistedAddresses(msg.sender)) {
            revert NotWhitelisted();
        }
        if (tokenIds >= maxTokens) {
            revert MaxTokensReached();
        }
        if (msg.value < tokenPrice) {
            revert InsufficientFunds();
        }
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    function mint() public payable onlyWhenNotPaused {
        if (!presaleStarted) {
            revert PresaleNotStarted();
        }
        if (block.timestamp < presaleEnded) {
            revert PresaleRunning();
        }
        if (tokenIds >= maxTokens) {
            revert MaxTokensReached();
        }
        if (msg.value < tokenPrice) {
            revert InsufficientFunds();
        }
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}
