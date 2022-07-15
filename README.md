<div id="top"></div>

<br />
<div align="center">

  <h3 align="center">Join it</h3>

  <p align="center">
    <br />
    <a href="https://eth-coinflip.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/AlanRacciatti/coinflip/issues">Report Bug</a>
    ·
    <a href="https://github.com/AlanRacciatti/coinflip/issues">Request Feature</a>
  </p>
</div>



<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#smart-contract">Smart Contract</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This blockchain-based project allows users to bet ETH and randomly duplicate or lose their bet

### Built With

#### Smart Contract

* [Solidity](https://docs.soliditylang.org/en/v0.8.15/)
* [Hardhat](https://hardhat.org)
* [Mocha](https://mochajs.org/)
* [Chai](https://www.chaijs.com/)

<p align="right">(<a href="#top">Back to top</a>)</p>

## Getting Started

### Prerequisites

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`
- [npm](https://www.npmjs.com/)
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
- [Hardhat](https://hardhat.org/)
  - You'll know you've installed yarn right if you can run:
    - `npx hardhat --version` and get an output like: `x.x.x`
    
    
#### Quickstart

```bash
git clone github.com/AlanRacciatti/coinflip
cd coinflip/frontend
yarn
cd ../smartcontract
npm i
npx hardhat deploy --network rinkeby # Add contract to Chainlink VRF
```

### Smart contract

   
#### Usage   
Deploy:

```bash
npx hardhat deploy
```

#### Test:
Unit tests

```bash
npx hardhat test
```

#### Deploying to mainnet or testnet
1. Setup environment variabltes

You'll want to set your `RINKEBY_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file, similar to what you see in `.env.example`.

- `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
  - You can [learn how to export it here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
- `RINKEBY_RPC_URL`: This is url of the rinkeby testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981)

2. Get testnet ETH

Head over to [faucets.chain.link](https://faucets.chain.link/) and get some testnet ETH. You should see the ETH show up in your metamask. [You can read more on setting up your wallet with LINK.](https://docs.chain.link/docs/deploy-your-first-contract/#install-and-fund-your-metamask-wallet)

3. Deploy

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">Back to top</a>)</p>

<!-- LICENSE -->
## License

[MIT](https://choosealicense.com/licenses/mit/)

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [LearnWeb3 DAO](https://www.learnweb3.io/)

<p align="right">(<a href="#top">Back to top</a>)</p>
