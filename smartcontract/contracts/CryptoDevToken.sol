// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ICryptoDevs.sol";

error InsufficientFunds();
error TotalSupplyExceeded();
error NotNftOwner();
error AllTokensClaimed();
error TransactionError();

contract CryptoDevToken is ERC20, Ownable {
    uint256 public constant tokenPrice = 0.001 ether;
    uint256 public constant tokensPerNFT = 10 * 10**18;
    uint256 public constant maxTotalSupply = 10000 * 10**18;

    ICryptoDevs CryptoDevsNFT;

    mapping(uint256 => bool) public tokenIdsClaimed;

    constructor(address _cryptoDevsContract) ERC20("Crypto Dev Token", "CD") {
        CryptoDevsNFT = ICryptoDevs(_cryptoDevsContract);
    }

    receive() external payable {}

    fallback() external payable {}

    function mint(uint256 amount) public payable {
        uint256 _requiredAmount = tokenPrice * amount;

        if (msg.value < _requiredAmount) {
            revert InsufficientFunds();
        }

        uint256 amountWithDecimals = amount * 10**18;

        if ((totalSupply() + amountWithDecimals) > maxTotalSupply) {
            revert TotalSupplyExceeded();
        }

        _mint(msg.sender, amountWithDecimals);
    }

    function claim() public {
        address sender = msg.sender;
        uint256 balance = CryptoDevsNFT.balanceOf(sender);

        if (balance <= 0) {
            revert NotNftOwner();
        }

        uint256 amount = 0;

        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = CryptoDevsNFT.tokenOfOwnerByIndex(sender, i);
            if (!tokenIdsClaimed[tokenId]) {
                amount += 1;
                tokenIdsClaimed[tokenId] = true;
            }
        }

        if (amount <= 0) {
            revert AllTokensClaimed();
        }

        _mint(msg.sender, amount * tokensPerNFT);
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        if (!sent) {
            revert TransactionError();
        }
    }
}
